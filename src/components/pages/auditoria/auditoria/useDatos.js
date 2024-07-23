// hooks/useDatos.js
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export const useDatos = (empresaSeleccionada) => {
  const [empresas, setEmpresas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [formularios, setFormularios] = useState([]);

  useEffect(() => {
    const obtenerEmpresas = async () => {
      const empresasCollection = collection(db, "empresas");
      const snapshot = await getDocs(empresasCollection);
      const empresasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre,
      }));
      setEmpresas(empresasData);
    };

    obtenerEmpresas();
  }, []);

  useEffect(() => {
    const obtenerSucursales = async () => {
      if (empresaSeleccionada) {
        const sucursalesCollection = collection(db, "sucursales");
        const q = query(sucursalesCollection, where("empresa", "==", empresaSeleccionada));
        const snapshot = await getDocs(q);
        const sucursalesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
        }));
        setSucursales(sucursalesData);
      } else {
        setSucursales([]);
      }
    };

    obtenerSucursales();
  }, [empresaSeleccionada]);

  useEffect(() => {
    const obtenerFormularios = async () => {
      const formulariosCollection = collection(db, "formularios");
      const snapshot = await getDocs(formulariosCollection);
      const formulariosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre,
        secciones: doc.data().secciones,
      }));
      setFormularios(formulariosData);
    };

    obtenerFormularios();
  }, []);

  return { empresas, sucursales, formularios };
};
