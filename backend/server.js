import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { authRoutes } from './routes/auth.routes.js';
import { incomeRoutes } from './routes/income.routes.js';
import { expenseRoutes } from './routes/expense.routes.js';
import { dashboardRoutes } from './routes/dashboard.routes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/income', incomeRoutes);
app.use('/api/v1/expense', expenseRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Static folder for uploads

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on the port ${PORT}`));
