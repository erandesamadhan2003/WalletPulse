import { LuDownload } from "react-icons/lu"
import moment from "moment"
import { TransactionInfoCard } from "../card/TransactionInfoCard"

export const ExpenseList = ({ transactions, onDelete, onDownload }) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Expense Category</h5>

                <button className="card-btn" onClick={onDownload}>
                    <LuDownload className="text-base" /> Download
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {transactions.expense?.map((expense) => (
                    <TransactionInfoCard
                        key={expense._id}
                        title={expense.category}
                        icon={expense.icon}
                        date={moment(expense.date).format("Do MMM YYYY")}
                        amount={expense.amount}
                        type="Expense"
                        onDelete={() => onDelete(expense._id)}
                    />
                ))}
            </div>
        </div>

    )
}