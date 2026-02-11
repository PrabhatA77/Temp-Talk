import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/authRoutes.js"

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:process.env.FRONTEND_URI,
    credentials:true
}));

app.set("trust proxy",1);

app.use('/api/auth',authRoutes);

const port = process.env.port || 3000;
app.listen(port,()=>{
    console.log('Server is running on PORT:',port)
});