import express from 'express';
import {signup, verifyEmail, login, logout, resendOtp, forgotPassword, resetPassword} from '../controllers/authController.js';
import { forgotPasswordLimiter, loginLimiter, otpLimiter, signupLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/signup',signupLimiter,signup);
router.post('/login',loginLimiter,login);
router.post('/logout',logout);

router.post('/resend-otp',otpLimiter,resendOtp);
router.post('/verify-email',otpLimiter,verifyEmail);

router.post('/forgot-password',forgotPasswordLimiter,forgotPassword);
router.post('/reset-password/:token',resetPassword);

export default router;