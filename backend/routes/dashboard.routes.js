import express from 'express';
import { getDashboardData } from '../controllers/dashboard.controller.js';
import { isUserPresent } from '../middleware/authMiddleware.js';

export const dashboardRoutes = express.Router();

dashboardRoutes.get('/', isUserPresent,getDashboardData);