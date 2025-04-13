import { BarChart, Bar, XAxis, ResponsiveContainer, CartesianGrid, YAxis, Tooltip, Cell } from "recharts"

const getBarColor = (index) => {
    return index % 2 === 0 ? "#875cf5" : "#cfbefb";
}

const CustomTooltip = ({active, payload}) => {
    if(active && payload && payload.length){
        return (
            <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                <p className="text-xs font-semibold text-purple-800 mb-1">
                    {payload[0].payload.category}
                </p>
                <div className="text-sm text-gray-600">
                    Amount: <span className="text-sm font-medium text-gray-900">{payload[0].payload.amount}</span>
                </div>
            </div>
        )

        return null;
    }
}
export const CustomBarChart = ({ data }) => {
    return (
        <div className="bg-white mt-6">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke="none" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
                    <Tooltip content={CustomTooltip} />
                    <Bar
                        dataKey="amount"
                        fill="#FF8042"
                        radius={[10, 10, 0, 0]}
                        activeDot={{ r: 8, fill: "yellow" }}
                        activeStyle={{ fill: "green" }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={getBarColor(index)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>

    )
}