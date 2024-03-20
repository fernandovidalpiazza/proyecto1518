// CapturarSeccionesYPreguntas.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const CapturarSeccionesYPreguntas = ({ formularioId, onCapturarSeccionesYPreguntas }) => {
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
        const preguntasCollection = collection(db, "preguntas");
        const q = query(preguntasCollection, where("formularioId", "==", formularioId));
        const snapshot = await getDocs(q);
        const preguntasData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setPreguntas(preguntasData);
        // Llamamos a la función proporcionada por la prop onCapturarSeccionesYPreguntas
        onCapturarSeccionesYPreguntas(preguntasData);
      } catch (error) {
        console.error("Error al obtener preguntas:", error);
      }
    };

    obtenerPreguntas();
  }, [formularioId, onCapturarSeccionesYPreguntas]);

  return null; // No necesitamos un renderizado en este componente, simplemente obtiene y envía los datos al componente padre
};

export default CapturarSeccionesYPreguntas;
