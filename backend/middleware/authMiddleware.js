import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const isUserPresent = async (req, res) => {
    let token = req.headers.authorization?.split(" ")[1];

    if(!token) return res.status(401).json({message: "Not authorized, no token"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({message: "Not authorized, in middleware no token", error: error.message});
    }
}