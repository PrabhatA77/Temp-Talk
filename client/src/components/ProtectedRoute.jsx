import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "./Loading.jsx";
import nprogress from "nprogress";
import { useEffect } from "react";

const ProtectedRoute = ({children})=>{
    const {user,loading} = useAuth();
    
    useEffect(()=>{
        if(loading){
          nprogress.start();
        }
        else{
          nprogress.done();
        }
    
        return ()=>{
          nprogress.done();
        };
      },[loading]);
    
    //while checking authentication
    if (loading) {
    return ( <div className="min-h-screen bg-[#091615]"></div>);
  }

    //if not logged in
    if(!user){
        return <Navigate to="/login" replace/>
    }

    //if logged in show protected route
    return children;
};

export default ProtectedRoute;