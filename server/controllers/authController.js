import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateOtp } from "../utils/generateOtp.js";
import { otpEmailTemplate } from "../utils/emailTemplate.js";
import { sendMail,sendWelcomeEmail } from "../utils/sendEmail.js";
import User from "../models/User.js";


export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //check if user exist
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationCode = generateOtp();

    //create user
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken: verificationCode,
      verificationTokenExpiresAt: Date.now() + 1 * 60 * 60 * 1000,
    });

    const emailHtml = otpEmailTemplate(verificationCode);
    await sendMail(email, "Email Verification Otp", emailHtml);

    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    if (!code) {
      return res.status(400).json({ message: "verification code is required" });
    }

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }


    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({ message: "Email verified successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const resendOtp = async (req,res) =>{
  try {
    const user = await User.findOne({email:req.body.email});

    if(!user){
      return res.status(404).json({message:"User not found"})
    }

    const newCode = generateOtp();
    user.verificationToken = newCode;
    user.verificationTokenExpiresAt = Date.now() + 10*60*60*1000;

    await user.save();

    const emailMessage = otpEmailTemplate(newCode);
    await sendMail(user.email,"Your new OTP code",emailMessage);

    return res.status(200).json({message:"Reset Otp send successfully"})
  } catch (error) {
    console.error("resend otp error : ",error.message);
    return res.status(500).json({message:"server error"});
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email  || !password) {
      return res
        .status(400)
        .json({message: "Please fill the all the feilds" });
    }

    //find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if(!user.isVerified){
        return res.status(403).json({message:'Please verify your email first'});
    }

    //create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie('token',token,{
        httpOnly : true,
        secure:false,
        sameSite:'strict',
        maxAge:7*24*60*60*1000,
    })

    user.lastLogin = Date.now();
    await user.save();

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message:'Logged in successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({message:'Logged out successfully'});
};