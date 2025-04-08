import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_KEY, { expiresIn: "10h" });
};

export const registerUser = async (req, res) => {
    const { fullname, email, password, profileImageUrl } = req.body;

    try {
        const exitingUser = await User.findOne({ email });
        if (exitingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            })
        }

        const user = await User.create({
            fullname,
            email,
            password,
            profileImageUrl
        })

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            token,
            message: "User register Successfully"
        })
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({
            success: false,
            message: "Error in register User",
            error: err.message
        })
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user || !(await User.comparePassword(password))) {
            return res.statur(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }    

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            token,
            message: "User LoggedIn successfully"
        })
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({
            success: false,
            message: "Error in login User",
            error: err.message
        })
    }
}

export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({
            success: false,
            message: "Error to get UserInfo",
            error: err.message
        })
    }
}