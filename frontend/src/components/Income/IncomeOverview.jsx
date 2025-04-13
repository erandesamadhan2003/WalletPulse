import { useEffect, useState } from "react"
import { prepareIncomeBarChartData } from "../../utils/helper";
import { LuPlus } from "react-icons/lu";
import { CustomBarChart } from "../Charts/CustomBarChart";

export const IncomeOverview = ({ transactions, onAddIncome }) => {
    const [charData, setChatData] = useState([]);
    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions.income);
        setChatData(result);
    }, [transactions])

    console.log(charData)
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <div className="">
                    <h5 className="text-lg">
                        Income Overview
                    </h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your earnings over time and analyze your income trends
                    </p>
                </div>

                <button className="add-btn"
                    onClick={onAddIncome}
                >
                    <LuPlus className="" /> Add Income
                </button>
            </div>

            <div className="mt-10">
                <CustomBarChart data={charData}/>
            </div>
        </div>
    )
} 