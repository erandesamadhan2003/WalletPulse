import { useEffect, useState } from "react"
import { CustomPieChart } from "../Charts/CustomPieChart";

export const RecentIncomeWithChart = ({data, totalIncome}) => {
    const [charData, setCharData] = useState([]);

    const COLORS = ["#875CF5","#FA2C37","#FF6900","#4f39f6"]
    const prepareCharData = () => {
        const dataArr = data.map((item)=>({
            name: item?.source,
            amount: item?.amount
        }))
        setCharData(dataArr);
    };

    useEffect(()=>{
        prepareCharData();
    },[data])
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="">Last 60 Days income</h5>
            </div>

            <CustomPieChart 
                data={charData}
                label="Total Income"
                totalAmount={`$${totalIncome}`}
                showTextAnchor
                colors={COLORS}
            />
        </div>
    )
}