import express from 'express';
import { isUserPresent } from '../middleware/authMiddleware.js';
import {
    getSpendingInsights,
    getExpensePrediction,
    getBudgetRecommendation,
    getFinancialReport,
} from '../controllers/ai.controller.js';

export const aiRoutes = express.Router();

// All AI routes are protected with authentication
aiRoutes.get('/insights', isUserPresent, getSpendingInsights);
aiRoutes.get('/prediction', isUserPresent, getExpensePrediction);
aiRoutes.get('/budget', isUserPresent, getBudgetRecommendation);
aiRoutes.get('/report', isUserPresent, getFinancialReport);
