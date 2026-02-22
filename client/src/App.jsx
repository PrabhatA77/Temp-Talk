import React from "react";
import LandingPage from "../src/pages/LandingPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Loading  from "./components/Loading.jsx";
import {  Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
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
