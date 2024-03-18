import { Route, Routes } from "react-router-dom";
import Navbar from "../components/layout/navbar/Navbar";
import { routes } from "./routes";
import Login from "../components/pages/login/Login";
import Register from "../components/pages/register/Register";
import ForgotPassword from "../components/pages/forgotPassword/ForgotPassword";
import SucursalContainer from "../components/pages/SucursalContainer.jsx/SucursalContainer";


const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Navbar />}>
        {routes.map(({ id, path, Element }) => (
          <Route key={id} path={path} element={<Element />} />
          
        ))}
      </Route>

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* register  */}
      <Route path="/register" element={<Register />} />
      
      <Route path="/sucursales" component={SucursalContainer}/>

      {/* forgot password  */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

     


      {/* Not found */}
      <Route path="*" element={<h1>Not found</h1>} />


    </Routes>
  );
};

export default AppRouter;