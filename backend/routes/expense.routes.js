import express from 'express';
import { isUserPresent } from '../middleware/authMiddleware.js';
import { addExpense, deleteBudget, deleteExpense, downloadExpenseExcel, getAllExpense, setBudget } from '../controllers/expense.controller.js';

export const expenseRoutes = express.Router();

expenseRoutes.post("/add", isUserPresent, addExpense);
expenseRoutes.get('/get', isUserPresent, getAllExpense);
expenseRoutes.get('/downloadedexcel', isUserPresent, downloadExpenseExcel);
expenseRoutes.delete('/delete/:id', isUserPresent, deleteExpense);
expenseRoutes.post('/setbudget', isUserPresent, setBudget);
expenseRoutes.delete('/budget/:id', isUserPresent, deleteBudget);
