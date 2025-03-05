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
  apiKey: "AIzaSyDnFFf4ng5xLlunXz7I7SMCLRRiS8NmCfo",
  authDomain: "auditoria-e11d8.firebaseapp.com",
  projectId: "auditoria-e11d8",
  storageBucket: "auditoria-e11d8.firebasestorage.app",
  messagingSenderId: "804516378420",
  appId: "1:804516378420:web:909002c1fbd442fbfc9761",
  measurementId: "G-PV1TLC0RC1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Inicializa el almacenamiento

// inicio de sesión
export const onSignIn = async ({ email, password }) => {
  try {
    console.log("Intentando iniciar sesión...");
    const res = await signInWithEmailAndPassword(auth, email, password);
    console.log("Inicio de sesión exitoso:", res);
    return res; // Si lo deseas, puedes devolver el resultado
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error; // Lanza el error para que pueda ser capturado en el componente Login
  }
};

// cierre de sesión
export const logout = () => {
  signOut(auth)
    .then(() => {
      console.log("Usuario cerró sesión exitosamente.");
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
      // Maneja el error apropiadamente
    });
};

// registro
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

// olvidar contraseña
export const forgotPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export { db, storage }; // Exporta el almacenamiento