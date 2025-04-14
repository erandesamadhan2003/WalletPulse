import { Expense } from "../models/Expense.js";
import { Income } from "../models/Income.js";
import xlsx from "xlsx";
import { Budget } from '../models/Setbudget.js';

export const addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;
        const expenseDate = new Date(date);
        const numericAmount = Number(amount);
        // Create the new expense
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: expenseDate,
        });

        await newExpense.save();

        // Find all active budgets for the date of the expense
        const budgets = await Budget.find({
            userId,
            startDate: { $lte: expenseDate },
            endDate: { $gte: expenseDate }
        });

        // Update amountspend in all active budgets
        const updatedBudgets = [];

        for (const budget of budgets) {
            budget.amountspend += numericAmount;
            await budget.save();
            updatedBudgets.push(budget);
        }


        res.status(200).json({
            success: true,
            message: "Expense Added Successfully",
            newExpense,
            budgetsUpdated: updatedBudgets // return updated budget list
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


export const getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            expense
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message,
            message: "Server Error"
        })
    }
}

export const deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Expense deleted Successfully"
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message,
            message: "Server Error"
        })
    }
}

export const downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        const data = expense.map((item) => ({
            category: item.category,
            Amount: item.amount,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, "expense_details.xlsx");
        res.download('expense_details.xlsx');
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: err.message,
            message: "Error in download file"
        })
    }
}

export const setBudget = async (req, res) => {
    try {
        const userId = req.user.id;
        const { totalBudget, startDate, endDate } = req.body;

        // Count the number of existing budgets for the user
        const existingBudgetCount = await Budget.countDocuments({ userId });

        if (existingBudgetCount >= 3) {
            return res.status(400).json({
                success: false,
                message: 'Only 3 budgets are allowed per user'
            });
        }

        // Create a new budget document
        const newBudget = new Budget({
            userId,
            totalBudget,
            startDate,
            endDate
        });

        // Save it to the database
        await newBudget.save();

        return res.status(201).json({
            success: true,
            message: 'Budget created successfully',
            data: newBudget
        });

    } catch (error) {
        console.error("Error setting budget:", error);
        return res.status(500).json({
            success: false,
            message: 'Failed to set budget',
            error: error.message
        });
    }
};


export const deleteBudget = async (req, res) => {
    try {
        const budgetId = req.params.id;
        const userId = req.user.id;

        const deleted = await Budget.findOneAndDelete({ _id: budgetId, userId });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Budget not found" });
        }

        return res.status(200).json({ success: true, message: "Budget deleted successfully" });
    } catch (error) {
        console.error("Error deleting budget:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

