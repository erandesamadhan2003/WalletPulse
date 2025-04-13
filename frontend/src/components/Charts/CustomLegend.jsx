export const CustomLegend = ({ payload }) => {
    return (
        <div className="flex flex-wrap justify-between gap-2 mt-4">
            {payload.map((entry, index) => (
                <div
                    key={`legend-${index}`} 
                    className="flex items-center space-x-2" >
                    <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-gray-700 font-medium">
                        {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};
