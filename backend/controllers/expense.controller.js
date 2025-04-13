import { Expense } from "../models/Expense.js";
import { Income } from "../models/Income.js";
import  xlsx  from "xlsx"; 

export const addExpense = async(req, res) => {
    const userId = req.user.id;

    try {
        const {icon, category, amount, date} = req.body;

        const newExpense = new Expense({
            userId, icon, category, amount, date:new Date(date)
        });

        await newExpense.save();
        res.status(200).json({
            success: true,
            message: "Income Added Successfully",
            newExpense
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

export const getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({date: -1});
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
            success:false,
            error: err.message,
            message: "Server Error"
        })
    }
}

export const downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({date: -1});

        const data = expense.map((item)=>({
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