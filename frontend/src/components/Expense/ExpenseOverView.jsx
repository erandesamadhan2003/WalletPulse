import { useEffect, useState } from "react"
import { prepareExpenseLineCharData } from "../../utils/helper";
import { LuPlus } from "react-icons/lu";
import { CustomLineChart } from "../Charts/CustomLineChart";

export const ExpenseOverView = ({ transactions, onExpenseIncome }) => {
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        const result = prepareExpenseLineCharData(transactions.expense);
        setChartData(result);
    }, [transactions])

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <div className="">
                    <h5 className="text-lg">
                        ExpenseOverview
                    </h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your spending over time and gain insights your money goes
                    </p>
                </div>

                <button className="add-btn"
                    onClick={onExpenseIncome}
                >
                    <LuPlus className="" /> Add Expense
                </button>
            </div>

            <div className="mt-10">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    )
}