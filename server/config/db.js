import mongoose from "mongoose";

//funtion to connect to mongo db
export const connectDB = async ()=>{
    try {
        //try connecting to mongo db using connection string
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB Connected Successfully");
    } catch (error) {
        console.error("Mongo Connection Failed",error.message);
    }
}

