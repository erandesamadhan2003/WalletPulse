import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'WalletPulse';

const connectDB = async () => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('walletPulse');
         console.log("MongoDB connected Successfully");
    } catch (error) {
        console.log("MongoDB connection error:", error.message);
    }
};
  
export default connectDB;
