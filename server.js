import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from "cors"
import signupRoute from './router/signupRoute.js'
import loginRoute from './router/loginRouter.js'
import uploadRoute from './router/uploadRoute.js'


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json())
app.use("/uploads", express.static("uploads"))

app.use("/signup", signupRoute)
app.use('/login', loginRoute)
app.use('/upload', uploadRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=> console.log(`server is running ${PORT}`))