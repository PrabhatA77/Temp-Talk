import rateLimit from "express-rate-limit";

export const signupLimiter = rateLimit({
    windowMs:15*60*1000,//15 minutes
    max:5, //5 attempts per 15 minutes
    message:"Too many attempts. Try again after 15 minutes"
});

export const loginLimiter = rateLimit({
    windowMs:15*60*1000,//15 minutes
    max:5, //5 attempts per 15 minutes
    message:"Too many attempts. Try again after 15 minutes"
});

export const otpLimiter = rateLimit({
    windowMs:10*60*1000,//10 minutes
    max:3, //5 attempts per 10 minutes
    message:"Too many attempts. Try again after 10 minutes"
});

export const forgotPasswordLimiter = rateLimit({
    windowMs:15*60*1000,//15 minutes
    max:3, //5 attempts per 15 minutes
    message:"Too many attempts. Try again after 15 minutes"
});

