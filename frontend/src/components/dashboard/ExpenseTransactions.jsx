import { LuArrowBigRight } from "react-icons/lu"
import { TransactionInfoCard } from "../card/TransactionInfoCard"
import moment from "moment"

export const ExpenseTransactions = ({transactions, onSeeMore}) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Expense</h5>
                <button className="card-btn" onClick={onSeeMore}>
                    See All <LuArrowBigRight className="text-base"/>
                </button>
            </div>

            <div className="mt-6">
                {transactions?.slice(0,5)?.map((expense) => (
                    <TransactionInfoCard 
                        key={expense._id}
                        title={expense.category}
                        icon={expense.icon}
                        date={moment(expense.data).format("Do MMM YYYY")}
                        amount={expense.amount}
                        hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    )
}