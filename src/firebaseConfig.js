// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importa getStorage

const firebaseConfig = {
  apiKey: "AIzaSyD7pmD_EVRf0dJcocynpaXAdu3tveycrzg",
  authDomain: "auditoria-f9fc4.firebaseapp.com",
  projectId: "auditoria-f9fc4",
  storageBucket: "auditoria-f9fc4.appspot.com",
  messagingSenderId: "156800340171",
  appId: "1:156800340171:web:fbe017105fd68b0f114b4e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializa la autenticación
const db = getFirestore(app);
const storage = getStorage(app); // Inicializa el almacenamiento

// Función de inicio de sesión
export const onSignIn = async ({ email, password }) => {
  try {
    console.log("Intentando iniciar sesión...");
    const res = await signInWithEmailAndPassword(auth, email, password);
    console.log("Inicio de sesión exitoso:", res);
    return res;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

// Función de cierre de sesión
export const logout = () => {
  signOut(auth)
    .then(() => {
      console.log("Usuario cerró sesión exitosamente.");
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
};

// Función de registro
export const signUp = async ({ email, password }) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Registro exitoso:", res);
    toast.success("Registro exitoso!", {
      position: "top-left",
      autoClose: 3000,
    });
    return res;
  } catch (error) {
    console.error("Error al registrarse:", error);
    if (error.code === "auth/email-already-in-use") {
      toast.error("El correo electrónico ya está en uso.", {
        position: "top-left",
        autoClose: 5000,
      });
    } else {
      toast.error("Error al registrar. Por favor, inténtalo de nuevo.", {
        position: "top-left",
        autoClose: 5000,
      });
    }
    throw error;
  }
};

// Función para restablecer contraseña
export const forgotPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

// Exporta auth, db, y storage
export { auth, db, storage };
