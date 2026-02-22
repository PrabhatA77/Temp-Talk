import React, { Children, createContext, useContext, useEffect, useState } from 'react';
const AuthContext = createContext();
import axios from "axios";
import { Await } from 'react-router-dom';

export const AuthProvider = ({children})=>{
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    //login function
    const login = (userData)=>{
        setUser(userData);
    }

    //logout function
    const logout = async ()=>{
        await axios.post(
            "http://localhost:3000/api/auth/logout",
            {},
            {withCredentials:true}
        )
        setUser(null);
    }

    //check authentication on page load
    const checkAuth = async ()=>{
        try {
            const res = await axios.get(
                "http://localhost:5000/api/auth/me",
                { withCredentials: true }
            );
            setUser(res.data.user);
        } catch (error) {
            setUser(null);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        checkAuth();
    },[]);

    return (
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);