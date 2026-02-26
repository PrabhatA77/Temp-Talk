import React,{useEffect} from "react";
import nprogress from "nprogress";
import LandingPage from "../src/pages/LandingPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Loading  from "./components/Loading.jsx";
import {  Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";

const App = () => {
  const { loading } = useAuth();

  useEffect(()=>{
    if(loading){
      nprogress.start(); // start the bar when authcontext is loading
    }
    else{
      nprogress.done(); // stop the bar when authcontext is finished
    }

    //ensure the bar stops if the component unmounts unexpectedly
    return ()=>{
      nprogress.done();
    };
  },[loading]);

  if (loading) {
    return ( <div className="min-h-screen bg-[#091615]"></div>);
  }

  return (
      <Routes>
        <Route path="/login" element={<PublicRoute><SignupPage/></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage/></PublicRoute>} />

        {/* <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }
        /> */}

        <Route path="/" element={<LandingPage />} />
      </Routes>
  );
};

export default App;
