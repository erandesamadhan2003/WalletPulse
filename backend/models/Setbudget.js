import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalBudget: { type: Number, required: true, },
    amountspend: { type: Number, default:0, },
    startDate: { type: Date, required: true, },
    endDate: { type: Date, required: true, }
}, { timestamps: true });

export const Budget = mongoose.model('Budget', budgetSchema);
