import express from 'express';
import { isUserPresent } from '../middleware/authMiddleware.js';
import { addIncome, deleteIncome, downloadIncomeExcel, getAllIncome } from '../controllers/income.controller.js';

export const incomeRoutes = express.Router();

incomeRoutes.post("/add", isUserPresent, addIncome);
incomeRoutes.get('/get', isUserPresent, getAllIncome);
incomeRoutes.get('/downloadedexcel', isUserPresent, downloadIncomeExcel);
incomeRoutes.delete('/:id', isUserPresent, deleteIncome);