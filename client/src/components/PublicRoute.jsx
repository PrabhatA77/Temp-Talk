import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import nprogress from 'nprogress';

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) {
            nprogress.start();
        }
        else {
            nprogress.done();
        }

        return () => {
            nprogress.done();
        };
    }, [loading]);

    //while checking authentication
    if (loading) {
        return (<div className="min-h-screen bg-[#091615]"></div>);
    }


    //if user already logged in 
    if (user) {
        return <Navigate to='/' replace />
    }

    //if not logged in
    return children;
}

export default PublicRoute;