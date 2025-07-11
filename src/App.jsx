// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom"; // Importa BrowserRouter
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContextComponent from "./components/context/AuthContext";
import AppRouter from "./router/AppRouter";

const App = () => {
  return (
    <AuthContextComponent>
      <BrowserRouter> {/* Envuelve AppRouter en BrowserRouter */}
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </AuthContextComponent>
  );
};

export default App;
