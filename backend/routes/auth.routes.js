import express from 'express'
import { getUserInfo, loginUser, registerUser } from '../controllers/auth.controller.js'
import { isUserPresent } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';


export const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/getuser", isUserPresent, getUserInfo);

Router.post('/upload-image', upload.single("image"), (req,res) => {
    if(!req.file) {
        return res.status(400).json({
            success: false,
            message: "No File Uploaded"
        });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;


})