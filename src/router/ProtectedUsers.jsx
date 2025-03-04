// src/router/ProtectedUsers.js
import { useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedUsers = () => {
  const { isLogged } = useContext(AuthContext); // Obtener el estado de autenticación

  return isLogged ? <Outlet /> : <Navigate to="/login" />; // Si está autenticado, permite el acceso; si no, redirige al login
};

export default ProtectedUsers;
