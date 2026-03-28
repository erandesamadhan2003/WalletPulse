import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { MdOutlineLightbulb } from "react-icons/md";

/**
 * AIInsights Component
 * Displays AI-generated spending insights and financial advice
 */
export const AIInsights = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatAmount = (value) =>
        Number(value || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    // Fetch spending insights from AI
    const fetchInsights = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(API_PATHS.AI.GET_INSIGHTS);

            if (response.data.success) {
                setInsights(response.data.data);
                toast.success("Insights generated successfully");
            } else {
                toast.error("Failed to generate insights");
            }
        } catch (err) {
            console.error("Error fetching insights:", err);
            setError(err.response?.data?.message || "Error fetching insights");
            toast.error("Error fetching insights");
        } finally {
            setLoading(false);
        }
    };

    // Fetch insights on component mount
    useEffect(() => {
        fetchInsights();
    }, []);

    return (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-amber-100 p-2 text-amber-600">
                        <MdOutlineLightbulb className="text-xl" />
                    </span>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            AI Spending Insights
                        </h2>
                        {insights?.ai?.source && (
                            <p className="mt-1 text-xs font-medium text-slate-500">
                                Source: {insights.ai.source}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={fetchInsights}
                    disabled={loading}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Analyzing..." : "Refresh"}
                </button>
            </div>

            {loading && (
                <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-10">
                    <div className="text-center">
                        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                        <p className="text-sm text-slate-600">
                            Analyzing your spending patterns...
                        </p>
                    </div>
                </div>
            )}

            {error && !loading && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={fetchInsights}
                        className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {insights && !loading && (
                <div className="space-y-4">
                    <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                            Financial Summary
                        </h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <div className="rounded-lg bg-white/80 p-3 ring-1 ring-blue-100">
                                <p className="text-xs text-slate-500">
                                    Total Income
                                </p>
                                <p className="text-xl font-bold text-emerald-600">
                                    $
                                    {formatAmount(
                                        insights.financialSummary?.totalIncome,
                                    )}
                                </p>
                            </div>
                            <div className="rounded-lg bg-white/80 p-3 ring-1 ring-blue-100">
                                <p className="text-xs text-slate-500">
                                    Total Expenses
                                </p>
                                <p className="text-xl font-bold text-rose-600">
                                    $
                                    {formatAmount(
                                        insights.financialSummary
                                            ?.totalExpenses,
                                    )}
                                </p>
                            </div>
                            <div className="rounded-lg bg-white/80 p-3 ring-1 ring-blue-100">
                                <p className="text-xs text-slate-500">
                                    Balance
                                </p>
                                <p
                                    className={`text-xl font-bold ${
                                        insights.financialSummary?.balance >= 0
                                            ? "text-emerald-600"
                                            : "text-rose-600"
                                    }`}
                                >
                                    $
                                    {formatAmount(
                                        insights.financialSummary?.balance,
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <h3 className="mb-3 text-lg font-semibold text-slate-800">
                            AI Analysis
                        </h3>
                        {insights?.ai?.warning && (
                            <p className="mb-3 rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-700">
                                {insights.ai.warning}
                            </p>
                        )}
                        <div className="whitespace-pre-line rounded-lg bg-white p-4 text-sm leading-7 text-slate-700 ring-1 ring-slate-200">
                            {insights.insights}
                        </div>
                    </div>
                </div>
            )}

            {!insights && !loading && !error && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
                    <p className="mb-4 text-sm text-slate-600">
                        No insights available yet
                    </p>
                    <button
                        onClick={fetchInsights}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Generate Insights
                    </button>
                </div>
            )}
        </div>
    );
};
