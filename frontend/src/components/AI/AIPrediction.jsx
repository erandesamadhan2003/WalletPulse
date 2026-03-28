import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { MdShowChart } from "react-icons/md";

/**
 * AIPrediction Component
 * Displays AI-predicted next month expenses
 */
export const AIPrediction = () => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatAmount = (value) =>
        Number(value || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    // Fetch expense prediction from AI
    const fetchPrediction = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(
                API_PATHS.AI.GET_PREDICTION,
            );

            if (response.data.success) {
                setPrediction(response.data.data);
                toast.success("Prediction generated successfully");
            } else {
                toast.error("Failed to generate prediction");
            }
        } catch (err) {
            console.error("Error fetching prediction:", err);
            setError(
                err.response?.data?.message || "Error fetching prediction",
            );
            toast.error("Error fetching prediction");
        } finally {
            setLoading(false);
        }
    };

    // Fetch prediction on component mount
    useEffect(() => {
        fetchPrediction();
    }, []);

    const monthlyHistory = prediction?.monthlyHistory || [];
    const chartMax = Math.max(...monthlyHistory, 1);

    return (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-violet-100 p-2 text-violet-600">
                        <MdShowChart className="text-xl" />
                    </span>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            AI Expense Prediction
                        </h2>
                        {prediction?.ai?.source && (
                            <p className="mt-1 text-xs font-medium text-slate-500">
                                Source: {prediction.ai.source}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={fetchPrediction}
                    disabled={loading}
                    className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Predicting..." : "Refresh"}
                </button>
            </div>

            {loading && (
                <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-10">
                    <div className="text-center">
                        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-violet-600" />
                        <p className="text-sm text-slate-600">
                            Analyzing expense trends...
                        </p>
                    </div>
                </div>
            )}

            {error && !loading && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={fetchPrediction}
                        className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {prediction && !loading && (
                <div className="space-y-4">
                    {monthlyHistory.length > 0 && (
                        <div className="rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-4">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">
                                Historical Monthly Expenses
                            </h3>
                            <div className="rounded-lg bg-white p-4 ring-1 ring-violet-100">
                                <div className="flex h-36 items-end gap-3">
                                    {monthlyHistory.map((month, idx) => {
                                        const barHeight = Math.max(
                                            16,
                                            (month / chartMax) * 120,
                                        );

                                        return (
                                            <div
                                                key={idx}
                                                className="flex min-w-0 flex-1 flex-col items-center"
                                            >
                                                <div
                                                    className="w-full max-w-20 rounded-t-lg bg-gradient-to-t from-violet-600 to-fuchsia-500"
                                                    style={{
                                                        height: `${barHeight}px`,
                                                    }}
                                                />
                                                <p className="mt-2 text-[11px] text-slate-500">
                                                    M{idx + 1}
                                                </p>
                                                <p className="text-xs font-medium text-slate-700">
                                                    $
                                                    {month >= 1000
                                                        ? `${(
                                                              month / 1000
                                                          ).toFixed(1)}k`
                                                        : month}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <p className="mt-3 text-sm text-slate-600">
                                Average: $
                                {formatAmount(prediction.historicalAverage)}
                            </p>
                        </div>
                    )}

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <h3 className="mb-3 text-lg font-semibold text-slate-800">
                            Prediction Analysis
                        </h3>
                        {prediction?.ai?.warning && (
                            <p className="mb-3 rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-700">
                                {prediction.ai.warning}
                            </p>
                        )}
                        <div className="whitespace-pre-line rounded-lg bg-white p-4 text-sm leading-7 text-slate-700 ring-1 ring-slate-200">
                            {prediction.prediction}
                        </div>
                    </div>
                </div>
            )}

            {!prediction && !loading && !error && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
                    <p className="mb-4 text-sm text-slate-600">
                        No prediction available yet
                    </p>
                    <button
                        onClick={fetchPrediction}
                        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
                    >
                        Generate Prediction
                    </button>
                </div>
            )}
        </div>
    );
};
