import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    icon: {type: String},
    category: {type: String, required: true},
    amount: {type: Number, required: true},
    date: {type: Date, default: Date.now}
}, {timestamps: true})

export const Expense = mongoose.model("Expense", ExpenseSchema);