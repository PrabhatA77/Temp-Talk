import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        email:{type:String,required:true,unique:true,trim:true},
        // password should not be required google users wont have
        password:{type:String,minlength:6},
        provider:{type:String,enum:["local","google"],default:"local"},
        googleId:{type:String},
        isVerified:{type:Boolean,default:false},
        profilePic:{type:String,default:""},
        lastLogin:{type:Date,default:Date.now},
        bio:{type:String,default:""},
        verificationToken:String,
        verificationTokenExpiresAt:Date,
        resetPasswordToken:String,
        resetPasswordTokenExpiresAt:Date
    },
    {timestamps:true}
);

const User = mongoose.model("User",userSchema);
export default User;