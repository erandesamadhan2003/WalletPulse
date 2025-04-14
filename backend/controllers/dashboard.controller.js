import { isValidObjectId, Types } from "mongoose";
import { Income } from "../models/Income.js";
import { Expense } from "../models/Expense.js";
import { Budget } from "../models/Setbudget.js"; // Import Budget model


export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        // fetch total income
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // fetch total expense
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // get Income Transactions from last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        const incomeLast60days = last60DaysIncomeTransactions.reduce(
            (sum, txn) => sum + txn.amount,
            0
        );

        // get Expense Transactions from last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        const ExpenseLast30days = last30DaysExpenseTransactions.reduce(
            (sum, txn) => sum + txn.amount,
            0
        );

        // fetch last 5 transactions (income + expense)
        const lastTransaction = [
            ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "Income",
                })
            ),
            ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "Expense",
                })
            ),
        ].sort((a, b) => b.date - a.date);

        // fetch all active budgets based on current date
        const currentDate = new Date();

        const activeBudgets = await Budget.find({
            userId,
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate }
        }).sort({ createdAt: -1 });

        // Final Response
        res.status(200).json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpense: {
                total: ExpenseLast30days,
                transaction: last30DaysExpenseTransactions
            },
            last60DaysIncome: {
                total: incomeLast60days,
                transaction: last60DaysIncomeTransactions
            },
            recentTransactions: lastTransaction,
            activeBudgets // sends array of active budgets
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ 
            message: "Server Error", 
            error: error.message 
        });
    }
};
