import express from 'express';
import { isUserPresent } from '../middleware/authMiddleware.js';
import { addExpense, deleteExpense, downloadExpenseExcel, getAllExpense } from '../controllers/expense.controller.js';

export const expenseRoutes = express.Router();

expenseRoutes.post("/add", isUserPresent, addExpense);
expenseRoutes.get('/get', isUserPresent, getAllExpense);
expenseRoutes.get('/downloadedexcel', isUserPresent, downloadExpenseExcel);
expenseRoutes.delete('/:id', isUserPresent, deleteExpense);