import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import connectDB from './config/db.js';
import { authRoutes } from './routes/auth.routes.js';

dotenv.config();

connectDB();
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization'],
}));

app.use(express.json());

app.use('/auth', authRoutes);

// Server uploads folder
app.use("uploads", express.static(path.join(__dirname,"uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on the port ${PORT}`));