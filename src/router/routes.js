import Home from "../components/pages/home/Home";
import usuarios from "../components/pages/usuarios/Usuarios";
import EstablecimientosContainer from "../components/pages/establecimiento/EstablecimientosContainer";
import SucursalContainer from "../components/pages/SucursalContainer.jsx/SucursalContainer";

export const routes = [
  {
    id: "home",
    path: "/",
    Element: Home,
  },
  {
    id: "User",
    path: "/User",
    Element: usuarios,
  },
  {
    id: "establecimiento",
    path: "/establecimiento",
    Element: EstablecimientosContainer,
  },
  {
    id: "sucursal",
    path: "/sucursales",
    Element: SucursalContainer,
  }
];
