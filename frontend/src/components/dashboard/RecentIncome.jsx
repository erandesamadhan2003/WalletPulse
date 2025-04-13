import { LuArrowRight } from "react-icons/lu"
import { TransactionInfoCard } from "../card/TransactionInfoCard"
import moment from "moment"

export const RecentIncome = ({transactions, onSeeMore}) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Income of last 60 Days</h5>

                <button className="card-btn" onClick={onSeeMore}>
                    See All <LuArrowRight className="text-base" />
                </button>
            </div>

            <div className="mt-6">
                {transactions?.slice(0, 5)?.map((item) => (
                    <TransactionInfoCard
                        key={item._id}
                        title={item.source}
                        icon={item.icon}
                        date={moment(item.date).format("Do MMM YYYY")}
                        amount={item.amount}
                        type="Income"
                        hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    )
}