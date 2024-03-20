import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import PreguntasTable from "./PreguntasTable";

const Auditoria = () => {
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
        const preguntasSnapshot = await getDocs(collection(db, "preguntas"));
        const listaPreguntas = preguntasSnapshot.docs.map((doc) => doc.data().texto);
        setPreguntas(listaPreguntas);
      } catch (error) {
        console.error("Error al obtener preguntas:", error);
      }
    };

    obtenerPreguntas();
  }, []);

  return (
    <div>
      <h1>ChekList</h1>
      <PreguntasTable preguntas={preguntas} />
    </div>
  );
};

export default Auditoria;
