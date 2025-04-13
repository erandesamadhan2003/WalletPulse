import { useEffect, useState } from "react"
import { prepareExpenseBarCharData } from "../../utils/helper";
import { CustomBarChart } from "../Charts/CustomBarChart";

export const Last30DaysExpenses = ({data}) => {
    const [charData, setCharData] = useState    ([]);

    useEffect(() => {
        if (data && data.length > 0) {
          const result = prepareExpenseBarCharData(data);
          setCharData(result);
        }
      }, [data]);

    return (
        <div className="card col-span-1">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Last 30 Days Expenses</h5>
            </div>

            <CustomBarChart data={charData} />
        </div>
    )
}