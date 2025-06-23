import { Request, Response } from 'express';
import  User  from '../models/user-model'; 
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
            return;
        }

        const user = await User.findOne({ email });
        if (user) {
            res.status(401).json({
                message: "Try different email",
                success: false,
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}