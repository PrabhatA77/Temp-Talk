import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from './Loading.jsx';
const PublicRoute = ({children}) => {
    const {user,loading} = useAuth();

    //wait until auth check finishes
    if(loading){
        return <div><Loading/></div>
    }

    //if user already logged in 
    if(user){
        return <Navigate to='/' replace/>
    }

    //if not logged in
    return children;
}

export default PublicRoute;