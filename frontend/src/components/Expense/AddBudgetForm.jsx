import { useState } from "react"
import { Input } from "../Inputs/Input";

export const AddBudgetForm = ({ onAddBudget }) => {
    const [budget, setbudget] = useState({
        amount: 0,
        startDate: "",
        endDate: ""
    });

    const handleChange = (key, value) => setbudget({ ...budget, [key]: value });
    return (
        <div>
            <Input
                value={budget.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder=""
                type="number"
            />
            <Input
                value={budget.startDate}
                onChange={({ target }) => handleChange("startDate", target.value)}
                label="StartDate"
                placeholder=""
                type="date"
            />

            <Input
                value={budget.endDate}
                onChange={({ target }) => handleChange("endDate", target.value)}
                label="endDate"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="add-btn add-btn-fill"
                    onClick={() => onAddBudget(budget)}
                >
                    Add budget
                </button>
            </div>
        </div>
    )
}