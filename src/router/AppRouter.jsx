// AppRouter.jsx
import { Route, Routes,Navigate  } from "react-router-dom";
import Home from "../components/pages/home/Home";
import Login from "../components/pages/login/Login";
import Register from "../components/pages/register/Register";
import ForgotPassword from "../components/pages/forgotPassword/ForgotPassword";
import React, { useContext } from 'react'
import { AuthContext } from "../components/context/AuthContext";


const AppRouter = () => {
  const { isLogged } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/dashboard"
        element={isLogged ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<h1>404: Not Found</h1>} />
    </Routes>
  );
};

export default AppRouter;