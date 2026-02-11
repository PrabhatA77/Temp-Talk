import sgMail from "@sendgrid/mail";
import { passwordResetTemplate, welcomeEmail } from "./emailTemplate.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fromEmail = process.env.SENDGRID_FROM_EMAIL;

export const sendMail = async (to,subject,html)=>{
    try {
        const msg = {
            to ,
            from: fromEmail,
            subject,
            html,
        }
        
        await sgMail.send(msg);
        console.log("Email sent to : " ,msg.to);        
    } catch (error) {
        console.error("Email error:", error.message);
    }
} 

export const sendWelcomeEmail = async (toEmail,name)=>{
    return sendMail(
        toEmail,
        "Welcome to Temp-Talk",
        welcomeEmail(name)
    )
}

export const sendForgotpasswordEmail = async (toEmail,name,resetLink)=>{
    return sendMail(
        toEmail,
        "Password Reset",
        passwordResetTemplate(name,resetLink)
    )
}