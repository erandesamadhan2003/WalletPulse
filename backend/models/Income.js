import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    icon: {type: String},
    source: {type: String, required: true}, //Example: salary, FreeLance
    amount: {type: Number, required: true},
    date: {type: Date, default: Date.now}
}, {timestamps: true});

export const Income = mongoose.model("Income", IncomeSchema);