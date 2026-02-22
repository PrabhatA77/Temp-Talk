import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "./Loading.jsx";

const ProtectedRoute = ({children})=>{
    const {user,loading} = useAuth();

    //while checking authentication
    if(loading){
        return <div><Loading/></div>
    }

    //if not logged in
    if(!user){
        return <Navigate to="/login" replace/>
    }

    //if logged in show protected route
    return children;
};

export default ProtectedRoute;