import React,{useState} from 'react';
import google from "../assets/google.png";
import {Eye,EyeOff} from "lucide-react";
import {motion,AnimatePresence} from "framer-motion";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

const SignupPage = () => {

    const [isLogin,setIsLogin] = useState(false);
    const [showPassword,setShowPassword] = useState(false);

    const {login} = useAuth();

    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse)=>{
        try {
            const token = credentialResponse.credential;
            //send token to backend
            const res = await axios.post(
                "http://localhost:5000/api/auth/google-login",
                {token},
                {withCredentials:true}
            );

            login(res.data.user);
            console.log("Google Login Success : ", res.data)

            navigate("/");//redirect to landing page
        } catch (error) {
            console.error("Google login Failed : ", error.response?.data);
        }
    }

  return (
    <div className='flex justify-center items-center min-h-screen'>
        <div className='border-2 border-emerald-500 min-h-96 p-8 flex flex-col justify-center items-center gap-3 bg-linear-to-b from-[#1F5731] to-[#091615] rounded-3xl'>
            <motion.div 
                className='font-semibold text-emerald-400 text-3xl md:text-4xl p-8'
                initial={{opacity:0,y:-10}}
                animate={{opacity:1,y:0}}
                transition={{duration:0.4}}
            >
                {isLogin?"Welcome Back":"Create an account"}
            </motion.div>
            
            {/* google signup */}
            <div className='w-full flex justify-center'>
                <GoogleLogin 
                    onSuccess={handleGoogleSuccess}
                    onError={()=>{
                        console.log("Google login failed");
                    }}
                    theme='filled_black'
                    shape='pill'
                    size='large'
                />
            </div>
            
            {/* division line */}
            <div className='w-full h-px bg-gray-400'></div>

            {/* normal signup */}
            <form className='space-y-4 text-white w-full'>
                {/* name */}
                <AnimatePresence>
                {!isLogin && (<motion.div
                    key="nameField"
                    initial={{opacity:0,y:-20}}
                    animate={{opacity:1,y:0}}
                    exit={{opacity:0,y:-20}}
                    transition={{duration:0.4}}
                    >
                    <label className='block text-sm mb-1'>Full Name</label>
                    <input 
                        type="text" 
                        placeholder='Enter your name'
                        className='w-full px-4 py-2 pr-10 border border-emerald-500/30 bg-[#0d1412] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 text-white transition'    
                        />
                </motion.div>
                )}
                </AnimatePresence>
                {/* email */}
                <motion.div
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    transition={{duration:0.4}}
                >
                    <label className='block text-sm mb-1'>Email</label>
                    <input 
                        type="email" 
                        placeholder='Enter your email'
                        className='w-full px-4 py-2 pr-10 border border-emerald-500/30 bg-[#0d1412] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 text-white transition'    
                    />
                </motion.div>
                {/* password */}
                <motion.div 
                    className='relative'
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    transition={{duration:0.4}}
                >
                    <label className='block text-sm mb-1 text-white'>Password</label>
                    <input 
                        type={showPassword?"text":"password"} 
                        placeholder='Enter password'
                        className='w-full px-4 py-2 pr-10 border border-emerald-500/30 bg-[#0d1412] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 text-white transition'    
                    />
                    {/* toggle button */}
                    <button
                        type='button'
                        onClick={()=>setShowPassword(!showPassword)}
                        className='absolute right-3 top-9 text-gray-400 hover:text-emerald-400 transition'
                    >{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button>
                </motion.div>

                {/* signup button */}
                <motion.button
                    type='submit'
                    whileHover={{scale:1.05}}
                    whileTap={{scale:0.95}}
                    className='w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition duration-300 cursor-pointer'
                >
                    {isLogin ? "Login" : "Sign Up" }
                </motion.button>
            </form>

            {/* already have account */}
            <p className='text-center text-sm text-gray-600 mt-6'>
                {isLogin? "Don't have an account?" : "Already have an account?"}{" "}
                <motion.button
                    type='button' 
                    onClick={()=>setIsLogin(!isLogin)}
                    className='text-green-600 font-medium hover:underline'
                >
                    {isLogin ? "Sign Up" : "Login"}
                </motion.button>
            </p>
        </div>
    </div>
  )
}

export default SignupPage