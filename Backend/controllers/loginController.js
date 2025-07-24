import User from "../models/signup.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const handleLogin = async(req, res) =>{
    const {email, password} = req.body;

    if(!email){
        return res.status(400).json({
            error: "Email and Password both required"
        });
    }
     try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                error: "User not found"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({
                error: "Password Mismatch"
            });
        }

        const token = jwt.sign(
            {userId: user._id, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn : '7d'}
        );

        res.status(200).json({
            message: "Login User Successfully",
            token,
            user:{
                username: user.username,
                email: user.email,
                role: user.role,
                id: user._id,
            },
        })
     } catch(error){
        console.error("Login Error:", error.message);
        res.status(500).json({
            error: "Login Failed"
        });
     }
     
};