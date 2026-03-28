import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { MdOutlineSavings } from "react-icons/md";

/**
 * AIBudget Component
 * Displays AI-recommended monthly budget allocation
 */
export const AIBudget = () => {
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatAmount = (value) =>
        Number(value || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    // Fetch budget recommendation from AI
    const fetchBudget = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(API_PATHS.AI.GET_BUDGET);

            if (response.data.success) {
                setBudget(response.data.data);
                toast.success("Budget recommendation generated");
            } else {
                toast.error("Failed to generate budget recommendation");
            }
        } catch (err) {
            console.error("Error fetching budget:", err);
            setError(err.response?.data?.message || "Error fetching budget");
            toast.error("Error fetching budget");
        } finally {
            setLoading(false);
        }
    };

    // Fetch budget on component mount
    useEffect(() => {
        fetchBudget();
    }, []);

    return (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                        <MdOutlineSavings className="text-xl" />
                    </span>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            AI Budget Recommendation
                        </h2>
                        {budget?.ai?.source && (
                            <p className="mt-1 text-xs font-medium text-slate-500">
                                Source: {budget.ai.source}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={fetchBudget}
                    disabled={loading}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Calculating..." : "Refresh"}
                </button>
            </div>

            {loading && (
                <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-10">
                    <div className="text-center">
                        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
                        <p className="text-sm text-slate-600">
                            Calculating optimal budget...
                        </p>
                    </div>
                </div>
            )}

            {error && !loading && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={fetchBudget}
                        className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {budget && !loading && (
                <div className="space-y-4">
                    <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                            Financial Metrics
                        </h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <div className="rounded-lg bg-white/80 p-3 ring-1 ring-emerald-100">
                                <p className="text-xs text-slate-500">
                                    Avg Monthly Income
                                </p>
                                <p className="text-xl font-bold text-emerald-600">
                                    $
                                    {formatAmount(
                                        budget.financialMetrics
                                            ?.avgMonthlyIncome,
                                    )}
                                </p>
                            </div>
                            <div className="rounded-lg bg-white/80 p-3 ring-1 ring-emerald-100">
                                <p className="text-xs text-slate-500">
                                    Avg Monthly Expense
                                </p>
                                <p className="text-xl font-bold text-rose-600">
                                    $
                                    {formatAmount(
                                        budget.financialMetrics
                                            ?.avgMonthlyExpense,
                                    )}
                                </p>
                            </div>
                            <div className="rounded-lg bg-white/80 p-3 ring-1 ring-emerald-100">
                                <p className="text-xs text-slate-500">
                                    Avg Monthly Savings
                                </p>
                                <p className="text-xl font-bold text-indigo-600">
                                    $
                                    {formatAmount(
                                        budget.financialMetrics
                                            ?.avgMonthlySavings,
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <h3 className="mb-3 text-lg font-semibold text-slate-800">
                            Budget Recommendation
                        </h3>
                        {budget?.ai?.warning && (
                            <p className="mb-3 rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-700">
                                {budget.ai.warning}
                            </p>
                        )}
                        <div className="whitespace-pre-line rounded-lg bg-white p-4 text-sm leading-7 text-slate-700 ring-1 ring-slate-200">
                            {budget.recommendation}
                        </div>
                    </div>
                </div>
            )}

            {!budget && !loading && !error && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
                    <p className="mb-4 text-sm text-slate-600">
                        No budget recommendation available yet
                    </p>
                    <button
                        onClick={fetchBudget}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                        Generate Recommendation
                    </button>
                </div>
            )}
        </div>
    );
};
