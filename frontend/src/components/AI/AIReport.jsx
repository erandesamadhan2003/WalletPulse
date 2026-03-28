import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { MdOutlineArticle } from "react-icons/md";

/**
 * AIReport Component
 * Displays AI-generated monthly financial report
 */
export const AIReport = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatAmount = (value) =>
        Number(value || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    // Fetch financial report from AI
    const fetchReport = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(API_PATHS.AI.GET_REPORT);

            if (response.data.success) {
                setReport(response.data.data);
                toast.success("Financial report generated");
            } else {
                toast.error("Failed to generate report");
            }
        } catch (err) {
            console.error("Error fetching report:", err);
            setError(err.response?.data?.message || "Error fetching report");
            toast.error("Error fetching report");
        } finally {
            setLoading(false);
        }
    };

    // Fetch report on component mount
    useEffect(() => {
        fetchReport();
    }, []);

    return (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
                        <MdOutlineArticle className="text-xl" />
                    </span>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            AI Financial Report
                        </h2>
                        {report?.ai?.source && (
                            <p className="mt-1 text-xs font-medium text-slate-500">
                                Source: {report.ai.source}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={fetchReport}
                    disabled={loading}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Generating..." : "Refresh"}
                </button>
            </div>

            {loading && (
                <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-10">
                    <div className="text-center">
                        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
                        <p className="text-sm text-slate-600">
                            Generating financial report...
                        </p>
                    </div>
                </div>
            )}

            {error && !loading && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={fetchReport}
                        className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {report && !loading && (
                <div className="space-y-4">
                    {report.summary && (
                        <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                                {report.month} Summary
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="rounded-lg bg-white p-3 ring-1 ring-indigo-100">
                                    <p className="text-xs text-slate-500">
                                        Income
                                    </p>
                                    <p className="text-xl font-bold text-emerald-600">
                                        $
                                        {formatAmount(
                                            report.summary.totalIncome,
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-3 ring-1 ring-indigo-100">
                                    <p className="text-xs text-slate-500">
                                        Expenses
                                    </p>
                                    <p className="text-xl font-bold text-rose-600">
                                        $
                                        {formatAmount(
                                            report.summary.totalExpenses,
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-3 ring-1 ring-indigo-100">
                                    <p className="text-xs text-slate-500">
                                        Balance
                                    </p>
                                    <p
                                        className={`text-xl font-bold ${
                                            report.summary.balance >= 0
                                                ? "text-emerald-600"
                                                : "text-rose-600"
                                        }`}
                                    >
                                        ${formatAmount(report.summary.balance)}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-3 ring-1 ring-indigo-100">
                                    <p className="text-xs text-slate-500">
                                        Transactions
                                    </p>
                                    <p className="text-xl font-bold text-indigo-600">
                                        {report.summary.expenseCount +
                                            report.summary.incomeCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <h3 className="mb-3 text-lg font-semibold text-slate-800">
                            Detailed Analysis
                        </h3>
                        {report?.ai?.warning && (
                            <p className="mb-3 rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-700">
                                {report.ai.warning}
                            </p>
                        )}
                        <div className="whitespace-pre-line rounded-lg bg-white p-4 text-sm leading-7 text-slate-700 ring-1 ring-slate-200">
                            {report.report}
                        </div>
                    </div>
                </div>
            )}

            {!report && !loading && !error && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
                    <p className="mb-4 text-sm text-slate-600">
                        No report available yet
                    </p>
                    <button
                        onClick={fetchReport}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                        Generate Report
                    </button>
                </div>
            )}
        </div>
    );
};
