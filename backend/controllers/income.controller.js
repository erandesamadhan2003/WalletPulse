import { User } from "../models/User.js";
import { Income } from "../models/Income.js";
import  xlsx  from "xlsx"; 

export const addIncome = async(req, res) => {
    const userId = req.user.id;

    try {
        const {icon, source, amount, date} = req.body;

        const newIncome = new Income({
            userId, icon, source, amount, date:new Date(date)
        });

        await newIncome.save();
        res.status(200).json({
            success: true,
            message: "Income Added Successfully",
            newIncome
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

export const getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({userId}).sort({date: -1});
        res.status(200).json({
            success: true,
            income
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

export const deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Income deleted Successfully"
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

export const downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({userId}).sort({date: -1});

        const data = income.map((item)=>({
            Source: item.source,
            Amount: item.amount,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "income_details.xlsx");
        res.download('income_details.xlsx');
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: err.message,
            message: "Error in download file"
        })
    }
}