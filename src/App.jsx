// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom"; // Importa BrowserRouter
import AuthContextComponent from "./components/context/AuthContext";
import AppRouter from "./router/AppRouter";

const App = () => {
  return (
    <AuthContextComponent>
      <BrowserRouter> {/* Envuelve AppRouter en BrowserRouter */}
        <AppRouter />
      </BrowserRouter>
    </AuthContextComponent>
  );
};

export default App;
