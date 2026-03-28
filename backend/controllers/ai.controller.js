import { GoogleGenerativeAI } from '@google/generative-ai';
import { Expense } from '../models/Expense.js';
import { Income } from '../models/Income.js';

const DEFAULT_MODEL_CANDIDATES = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
];

const envPreferredModels = [
    process.env.GEMINI_MODEL,
    ...(process.env.GEMINI_MODELS
        ? process.env.GEMINI_MODELS.split(',').map((item) => item.trim())
        : []),
].filter(Boolean);

const MODEL_CANDIDATES = [...new Set([...envPreferredModels, ...DEFAULT_MODEL_CANDIDATES])];

const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

let activeGeminiModel = envPreferredModels[0] || null;

const getModelClient = (modelName) => {
    if (!genAI || !modelName) return null;
    return genAI.getGenerativeModel({ model: modelName });
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const toSafeNumber = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

const parseRetryDelayMs = (errorDetails = []) => {
    try {
        const retryInfo = errorDetails.find((detail) => detail?.['@type']?.includes('RetryInfo'));
        const retryDelay = retryInfo?.retryDelay;
        if (!retryDelay || typeof retryDelay !== 'string') return 1000;

        if (retryDelay.endsWith('ms')) {
            return Math.min(2000, Math.max(500, Number.parseInt(retryDelay, 10)));
        }

        if (retryDelay.endsWith('s')) {
            const seconds = Number.parseFloat(retryDelay.replace('s', ''));
            if (!Number.isNaN(seconds)) {
                return Math.min(2000, Math.max(500, Math.ceil(seconds * 1000)));
            }
        }

        return 1000;
    } catch {
        return 1000;
    }
};

const isDailyQuotaExceeded = (errorDetails = []) => {
    try {
        const quotaFailure = errorDetails.find((detail) => detail?.['@type']?.includes('QuotaFailure'));
        const violations = quotaFailure?.violations || [];
        return violations.some((violation) => String(violation?.quotaId || '').toLowerCase().includes('perday'));
    } catch {
        return false;
    }
};

const isQuotaOrRateLimitError = (error) => {
    if (!error) return false;

    if (error.status === 429) return true;

    const msg = String(error.message || '').toLowerCase();
    return msg.includes('quota') || msg.includes('too many requests') || msg.includes('rate limit');
};

const isModelUnavailableError = (error) => {
    if (!error) return false;

    if (error.status === 404) return true;

    const msg = String(error.message || '').toLowerCase();
    return msg.includes('model') && (
        msg.includes('not found')
        || msg.includes('not supported')
        || msg.includes('unsupported')
    );
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const topCategoriesText = (categoryBreakdown, limit = 3) => {
    const sorted = Object.entries(categoryBreakdown || {})
        .map(([category, amount]) => ({ category, amount: toSafeNumber(amount) }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, limit);

    if (!sorted.length) return 'No expense categories available yet.';
    return sorted.map((item, index) => `${index + 1}. ${item.category}: ${formatCurrency(item.amount)}`).join('\n');
};

const buildSpendingInsightsFallback = ({ totalIncome, totalExpenses, balance, categoryBreakdown }) => {
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0.0';
    const topCategories = topCategoriesText(categoryBreakdown);

    return `1. Spending insights\n- Income: ${formatCurrency(totalIncome)}\n- Expenses: ${formatCurrency(totalExpenses)}\n- Net balance: ${formatCurrency(balance)}\n- Savings rate: ${savingsRate}%\n\n2. Bad spending habits\n- Focus on reducing costs in your top spending categories:\n${topCategories}\n\n3. Saving suggestions\n- Set a fixed auto-transfer for savings right after income is received.\n- Reduce the highest expense category by 10% for the next month.\n- Review recurring expenses and cancel low-value subscriptions.\n\n4. Budget advice\n- Start with 50/30/20 split (needs/wants/savings).\n- Keep monthly expenses below ${formatCurrency(totalIncome * 0.8)} to preserve at least 20% savings.`;
};

const buildPredictionFallback = ({ avgExpense, monthlyAverages, categoryBreakdown }) => {
    const recentTrend = monthlyAverages.length >= 2
        ? monthlyAverages[monthlyAverages.length - 1] - monthlyAverages[monthlyAverages.length - 2]
        : 0;
    const projected = Math.max(0, avgExpense + (recentTrend * 0.4));

    return `1. Predicted next month expense\n- Estimated expense: ${formatCurrency(projected)}\n- Baseline monthly average: ${formatCurrency(avgExpense)}\n\n2. Confidence level\n- Medium (based on historical average and recent trend only).\n\n3. Category-wise prediction\n- Prioritize monitoring top categories:\n${topCategoriesText(categoryBreakdown)}\n\n4. Risk factors\n- Irregular one-time purchases\n- Seasonal costs\n- Lifestyle inflation in high-spend categories`;
};

const buildBudgetFallback = ({ avgMonthlyIncome, avgMonthlyExpense, avgMonthlySavings }) => {
    const needs = avgMonthlyIncome * 0.5;
    const wants = avgMonthlyIncome * 0.3;
    const savings = avgMonthlyIncome * 0.2;

    return `1. Recommended monthly budget\n- Total expense budget: ${formatCurrency(Math.min(avgMonthlyExpense, needs + wants))}\n\n2. Budget allocation by category\n- Needs (50%): ${formatCurrency(needs)}\n- Wants (30%): ${formatCurrency(wants)}\n- Savings (20%): ${formatCurrency(savings)}\n\n3. Savings target\n- Target at least ${formatCurrency(savings)} per month (20% of income).\n\n4. Adjustments needed\n- Current avg expense: ${formatCurrency(avgMonthlyExpense)}\n- Current avg savings: ${formatCurrency(avgMonthlySavings)}\n- If expenses exceed 80% of income, reduce discretionary spending first.\n\n5. Emergency fund\n- Build 3-6 months of expenses: ${formatCurrency(avgMonthlyExpense * 3)} to ${formatCurrency(avgMonthlyExpense * 6)}.`;
};

const buildReportFallback = ({ monthName, totalIncome, totalExpenses, balance, expenses, income, categoryBreakdown }) => {
    const expenseRatio = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : '0.0';
    const topExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];
    const topIncome = [...income].sort((a, b) => b.amount - a.amount)[0];

    return `1. Executive summary (${monthName})\n- Total income: ${formatCurrency(totalIncome)}\n- Total expenses: ${formatCurrency(totalExpenses)}\n- Net balance: ${formatCurrency(balance)}\n\n2. Income analysis\n- Primary source: ${topIncome ? `${topIncome.source} (${formatCurrency(topIncome.amount)})` : 'No income recorded'}\n\n3. Expense analysis\n- Highest expense: ${topExpense ? `${topExpense.category} (${formatCurrency(topExpense.amount)})` : 'No expenses recorded'}\n- Top categories:\n${topCategoriesText(categoryBreakdown)}\n\n4. Key metrics\n- Expense-to-income ratio: ${expenseRatio}%\n\n5. Performance\n- ${balance >= 0 ? 'Positive monthly cashflow.' : 'Negative monthly cashflow. Consider reducing non-essential expenses.'}\n\n6. Recommendations\n- Keep expense ratio below 80%.\n- Increase automatic savings if monthly balance is positive.`;
};

const generateWithGemini = async ({ prompt, fallbackText, maxRetries = 1 }) => {
    if (!genAI) {
        return {
            text: fallbackText,
            source: 'local-fallback',
            warning: '',
        };
    }

    const modelQueue = [
        ...(activeGeminiModel ? [activeGeminiModel] : []),
        ...MODEL_CANDIDATES.filter((modelName) => modelName !== activeGeminiModel),
    ];

    let sawModelUnavailable = false;

    for (const modelName of modelQueue) {
        const modelClient = getModelClient(modelName);
        if (!modelClient) continue;

        for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
            try {
                const result = await modelClient.generateContent(prompt);
                activeGeminiModel = modelName;
                return { text: result.response.text(), source: 'gemini', model: modelName };
            } catch (error) {
                const isRetryable = isQuotaOrRateLimitError(error);
                const dailyQuotaExceeded = isDailyQuotaExceeded(error.errorDetails);
                const isLastAttempt = attempt === maxRetries;

                if (isModelUnavailableError(error)) {
                    sawModelUnavailable = true;
                    break;
                }

                if (isRetryable && !dailyQuotaExceeded && !isLastAttempt) {
                    const delay = parseRetryDelayMs(error.errorDetails);
                    await sleep(delay);
                    continue;
                }

                if (isRetryable) {
                    return {
                        text: fallbackText,
                        source: 'local-fallback',
                        warning: '',
                    };
                }

                return {
                    text: fallbackText,
                    source: 'local-fallback',
                    warning: '',
                };
            }
        }
    }

    if (sawModelUnavailable) {
        return {
            text: fallbackText,
            source: 'local-fallback',
            warning: '',
        };
    }

    return {
        text: fallbackText,
        source: 'local-fallback',
        warning: '',
    };
};

const getCategoryBreakdown = async (userId) => {
    try {
        const expenses = await Expense.find({ userId });
        const breakdown = {};

        expenses.forEach((expense) => {
            if (!breakdown[expense.category]) {
                breakdown[expense.category] = 0;
            }
            breakdown[expense.category] += expense.amount;
        });

        return breakdown;
    } catch (error) {
        console.error('Error calculating category breakdown:', error);
        return {};
    }
};


export const getSpendingInsights = async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch all expenses and income for the user
        const [expenses, income] = await Promise.all([
            Expense.find({ userId }).sort({ date: -1 }),
            Income.find({ userId }).sort({ date: -1 }),
        ]);

        // Calculate totals
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
        const categoryBreakdown = await getCategoryBreakdown(userId);

        // Get last 10 transactions
        const recentTransactions = [...expenses.slice(0, 5), ...income.slice(0, 5)]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10)
            .map((t) => ({
                type: t.category ? 'expense' : 'income',
                amount: t.amount,
                category: t.category || t.source,
                date: t.date,
            }));

        // Prepare data for Gemini
        const categoryList = Object.entries(categoryBreakdown)
            .map(([cat, amount]) => `${cat}: ${formatCurrency(amount)}`)
            .join('\n');

        const transactionList = recentTransactions
            .map((t) => `${t.type.toUpperCase()} - ${t.category}: ${formatCurrency(t.amount)} on ${t.date.toDateString()}`)
            .join('\n');

        const prompt = `You are a financial advisor AI.
Analyze the following financial data.

Income: ${formatCurrency(totalIncome)}
Expenses: ${formatCurrency(totalExpenses)}
Category breakdown:
${categoryList || 'No category data'}
Recent transactions:
${transactionList || 'No transactions available'}

Provide:
1. Spending insights
2. Budget recommendation
3. Saving tips
4. Expense prediction
Keep response short and structured.`;

        const fallbackText = buildSpendingInsightsFallback({
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
            categoryBreakdown,
        });

        const aiResult = await generateWithGemini({ prompt, fallbackText, maxRetries: 1 });

        res.status(200).json({
            success: true,
            message: 'Spending insights generated successfully',
            data: {
                insights: aiResult.text,
                financialSummary: {
                    totalIncome,
                    totalExpenses,
                    balance: totalIncome - totalExpenses,
                },
                ai: {
                    source: aiResult.source,
                    warning: aiResult.warning || null,
                },
            },
        });
    } catch (error) {
        console.error('Error generating spending insights:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating spending insights',
            error: error.message,
        });
    }
};

/**
 * Get AI Expense Prediction
 * GET /api/ai/prediction
 */
export const getExpensePrediction = async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch last 3 months of expenses
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const expenses = await Expense.find({
            userId,
            date: { $gte: threeMonthsAgo },
        }).sort({ date: -1 });

        if (expenses.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'Not enough expense data for prediction',
                data: {
                    prediction: 'Not enough data. Please add more expenses for accurate prediction.',
                },
            });
        }

        // Calculate monthly averages
        const monthlyExpenses = {};
        expenses.forEach((expense) => {
            const month = expense.date.toISOString().slice(0, 7); // YYYY-MM
            monthlyExpenses[month] = (monthlyExpenses[month] || 0) + expense.amount;
        });

        const monthlyAverages = Object.values(monthlyExpenses);
        const avgExpense = monthlyAverages.reduce((a, b) => a + b, 0) / monthlyAverages.length;

        const categoryBreakdown = await getCategoryBreakdown(userId);

        const categoryList = Object.entries(categoryBreakdown)
            .map(([cat, amount]) => `${cat}: ${formatCurrency(amount)}`)
            .join('\n');

        const prompt = `You are a financial advisor AI.
    Analyze the following financial data.

    Income: Not required for this task
    Expenses: ${monthlyAverages.map((exp) => formatCurrency(exp)).join(', ')}
    Category breakdown:
    ${categoryList || 'No category data'}
    Recent transactions:
    ${expenses.slice(0, 8).map((e) => `${e.category}: ${formatCurrency(e.amount)} on ${new Date(e.date).toDateString()}`).join('\n') || 'No transactions available'}

    Provide:
    1. Spending insights
    2. Budget recommendation
    3. Saving tips
    4. Expense prediction
    Keep response short and structured.`;

        const fallbackText = buildPredictionFallback({ avgExpense, monthlyAverages, categoryBreakdown });
        const aiResult = await generateWithGemini({ prompt, fallbackText, maxRetries: 1 });

        res.status(200).json({
            success: true,
            message: 'Expense prediction generated successfully',
            data: {
                prediction: aiResult.text,
                historicalAverage: avgExpense,
                monthlyHistory: monthlyAverages,
                ai: {
                    source: aiResult.source,
                    warning: aiResult.warning || null,
                },
            },
        });
    } catch (error) {
        console.error('Error generating expense prediction:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating expense prediction',
            error: error.message,
        });
    }
};

/**
 * Get AI Budget Recommendation
 * GET /api/ai/budget
 */
export const getBudgetRecommendation = async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch last 6 months data
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const [expenses, income] = await Promise.all([
            Expense.find({ userId, date: { $gte: sixMonthsAgo } }),
            Income.find({ userId, date: { $gte: sixMonthsAgo } }),
        ]);

        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
        const avgMonthlyIncome = totalIncome / 6;
        const avgMonthlyExpense = totalExpenses / 6;

        const categoryBreakdown = await getCategoryBreakdown(userId);

        const categoryList = Object.entries(categoryBreakdown)
            .map(([cat, amount]) => `${cat}: ${formatCurrency(amount / 6)} (monthly average)`)
            .join('\n');

        const prompt = `You are a financial advisor AI.
Analyze the following financial data.

Income: ${formatCurrency(avgMonthlyIncome)} monthly average
Expenses: ${formatCurrency(avgMonthlyExpense)} monthly average
Category breakdown:
${categoryList || 'No category data'}
Recent transactions:
${expenses
                .slice(0, 8)
                .map((e) => `${e.category}: ${formatCurrency(e.amount)} on ${new Date(e.date).toDateString()}`)
                .join('\n') || 'No transactions available'}

Provide:
1. Spending insights
2. Budget recommendation
3. Saving tips
4. Expense prediction
Keep response short and structured.`;

        const fallbackText = buildBudgetFallback({
            avgMonthlyIncome,
            avgMonthlyExpense,
            avgMonthlySavings: avgMonthlyIncome - avgMonthlyExpense,
        });

        const aiResult = await generateWithGemini({ prompt, fallbackText, maxRetries: 1 });

        res.status(200).json({
            success: true,
            message: 'Budget recommendation generated successfully',
            data: {
                recommendation: aiResult.text,
                financialMetrics: {
                    avgMonthlyIncome,
                    avgMonthlyExpense,
                    avgMonthlySavings: avgMonthlyIncome - avgMonthlyExpense,
                },
                ai: {
                    source: aiResult.source,
                    warning: aiResult.warning || null,
                },
            },
        });
    } catch (error) {
        console.error('Error generating budget recommendation:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating budget recommendation',
            error: error.message,
        });
    }
};

/**
 * Get AI Financial Report
 * GET /api/ai/report
 */
export const getFinancialReport = async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch current month data
        const currentDate = new Date();
        const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

        const [expenses, income] = await Promise.all([
            Expense.find({
                userId,
                date: { $gte: currentMonth, $lt: nextMonth },
            }),
            Income.find({
                userId,
                date: { $gte: currentMonth, $lt: nextMonth },
            }),
        ]);

        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
        const balance = totalIncome - totalExpenses;

        const categoryBreakdown = await getCategoryBreakdown(userId);

        const categoryList = Object.entries(categoryBreakdown)
            .map(([cat, amount]) => `${cat}: ${formatCurrency(amount)}`)
            .join('\n');

        const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

        const prompt = `You are a financial advisor AI.
Analyze the following financial data.

Income: ${formatCurrency(totalIncome)}
Expenses: ${formatCurrency(totalExpenses)}
Category breakdown:
${categoryList || 'No category data'}
Recent transactions:
${[...expenses.slice(0, 5), ...income.slice(0, 5)]
                .map((t) => `${t.category ? 'Expense' : 'Income'} - ${t.category || t.source}: ${formatCurrency(t.amount)} on ${new Date(t.date).toDateString()}`)
                .join('\n') || 'No transactions available'}

Provide:
1. Spending insights
2. Budget recommendation
3. Saving tips
4. Expense prediction
Keep response short and structured.`;

        const fallbackText = buildReportFallback({
            monthName,
            totalIncome,
            totalExpenses,
            balance,
            expenses,
            income,
            categoryBreakdown,
        });

        const aiResult = await generateWithGemini({ prompt, fallbackText, maxRetries: 1 });

        res.status(200).json({
            success: true,
            message: 'Financial report generated successfully',
            data: {
                report: aiResult.text,
                month: monthName,
                summary: {
                    totalIncome,
                    totalExpenses,
                    balance,
                    expenseCount: expenses.length,
                    incomeCount: income.length,
                },
                ai: {
                    source: aiResult.source,
                    warning: aiResult.warning || null,
                },
            },
        });
    } catch (error) {
        console.error('Error generating financial report:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating financial report',
            error: error.message,
        });
    }
};
