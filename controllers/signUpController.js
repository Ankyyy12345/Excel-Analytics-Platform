import User from "../models/signup.js";
import bcrypt from 'bcryptjs'

export const handleSignUp = async (req, res)=>{
    const {username, email, password,} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({
            error: "All fields are required"
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    try{
        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
        })
        res.status(201).json({
            message: "user created successfully", user
        })
    }catch(error){
           console.error("Signup Error:", error.message)
           res.status(500).json({
            error: "Failed to create User"
           });
    }
};

