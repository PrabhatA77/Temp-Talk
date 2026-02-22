import {OAuth2Client} from "google-auth-library";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateOtp } from "../utils/generateOtp.js";
import { otpEmailTemplate } from "../utils/emailTemplate.js";
import {
  sendMail,
  sendForgotpasswordEmail,
  sendWelcomeEmail,
} from "../utils/sendEmail.js";
import User from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req,res)=>{
  try {
    
    const {token} = req.body;
    if(!token){
      return res.status(400).json({message:"Google token is Required"});
    }

    //verify token with google 
    const ticket = await client.verifyIdToken({idToken:token,
      audience:process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub:googleId,
      email,
      name,
      picture,
      email_verified
    } = payload;

    if(!email_verified){
      return res.status(400).json({message:"Google email not verified"});
    }

    //check if user exists
    let user = await User.findOne({email});

    if(!user){
      //create new google user
      user = await User.create({
        name,
        email,
        googleId,
        provider:"google",
        profilePic:picture,
        isVerified:true,
      });
    }
    else{
      //if user exists but registered locally 
      if(user.provider === "local"){
        user.googleId = googleId;
        user.provider = "google";
        user.profilePic = picture || user.profilePic;
        await user.save();
      }
    }

    //generate jwt
    const jwtToken = jwt.sign(
      {is:user._id},
      process.env.JWT_SECRET,
      {expiresIn:"7d"}
    );

    res.cookie("token",jwtToken,{
      httpOnly:true,
      secure:false,
      sameSite:"strict",
      maxAge:7*24*60*60*1000,
    });

    user.lastLogin = Date.now();
    await user.save();

    return res.status(200).json({
      message:"Google login successful",
      token:jwtToken,
      user:{
        is:user._id,
        name:user.name,
        email:user.email,
        profilePic:user.profilePic,
      },
    });

  } catch (error) {
    console.error("Google login error : " ,error.message);
    return res.status(500).json({message:"Google authentication failed"});
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //check if user exist
    let user = await User.findOne({ email });
    if (user) {
      //if user is registered with google
      if (user.provider === "google") {
        return res.status(400).json({
          message:
            "This email is registered with Google. Please login using Google.",
        });
      }

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
      provider: "local",
      isVerified: false,
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

    return res
      .status(200)
      .json({ message: "Email verified successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.provider === "google") {
      return res
        .status(400)
        .json({ message: "Google accounts do not require OTP verification" });
    }

    const newCode = generateOtp();
    user.verificationToken = newCode;
    user.verificationTokenExpiresAt = Date.now() + 10 * 60 * 60 * 1000;

    await user.save();

    const emailMessage = otpEmailTemplate(newCode);
    await sendMail(user.email, "Your new OTP code", emailMessage);

    return res.status(200).json({ message: "Reset Otp send successfully" });
  } catch (error) {
    console.error("resend otp error : ", error.message);
    return res.status(500).json({ message: "server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill the all the feilds" });
    }

    //find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //block google users from password login
    if (user.provider === "google") {
      return res.status(400).json({
        message:
          "This account is registered with Google. Please login using Google.",
      });
    }

    //check password exists
    if (!user.password) {
      return res.status(400).json({ message: "Password login not avilable" });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    //create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.lastLogin = Date.now();
    await user.save();

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "Logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please enter valid email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.provider === "google") {
      return res.status(400).json({
        message: "Password reset not available for Google accounts",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    sendForgotpasswordEmail(user.email, user.name, resetUrl);

    return res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error("forgot password error : ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "All fields required" });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or Expired Token" });
    }

    if (user.provider === "google") {
      return res.status(400).json({
        message: "Password reset not allowed for Google accounts",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);

    user.password = newPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;

    await user.save();

    return res.status(200).json({ message: "Password Reset Successful" });
  } catch (error) {
    console.error("reset password error : ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req,res)=>{
  try {
    const token = req.cookies.token;
    if(!token){
      return res.status(401).json({message:"Not authenticated"})
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if(!user){
      return res.status(401).json({message:"User not found"});
    }

    return res.status(200).json({user});
  } catch (error) {
    console.log("Getting user info error : ",error.message);
    return res.status(500).json({message:"Invalid token"})
  }
}
