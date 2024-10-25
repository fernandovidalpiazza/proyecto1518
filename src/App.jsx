// App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AuthContextComponent from './components/context/AuthContext'; // Importación correcta
import AppRouter from './router/AppRouter';

const App = () => {
  return (
    <AuthContextComponent>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthContextComponent>
  );
};

export default App;
