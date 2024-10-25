import { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

const AuthContextComponent = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    const storedIsLogged = JSON.parse(localStorage.getItem("isLogged"));

    if (storedUser && storedIsLogged) {
      setUser(storedUser);
      setIsLogged(storedIsLogged);
    }
  }, []);

  const handleLogin = (userLogged) => {
    setUser(userLogged);
    setIsLogged(true);
    localStorage.setItem("userInfo", JSON.stringify(userLogged));
    localStorage.setItem("isLogged", JSON.stringify(true));
  };

  const logoutContext = () => {
    setUser(null);
    setIsLogged(false);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("isLogged");
  };

  const data = {
    user,
    isLogged,
    handleLogin,
    logoutContext,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export default AuthContextComponent; // Asegúrate de que esta línea esté presente