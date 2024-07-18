import React from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const EliminarPregunta = ({ preguntaSeleccionada, formularioSeleccionado, setPreguntas, setPreguntaSeleccionada, setModalEditarPreguntaAbierto }) => {
  const handleEliminarPregunta = async () => {
    try {
      if (preguntaSeleccionada) {
        const { seccionId, index } = preguntaSeleccionada;
        const seccionIndex = formularioSeleccionado.secciones.findIndex((sec) => sec.nombre === seccionId);
        const preguntasActualizadas = [...formularioSeleccionado.secciones[seccionIndex].preguntas];
        preguntasActualizadas.splice(index, 1);

        const formularioRef = doc(db, "formularios", formularioSeleccionado.id);
        await updateDoc(formularioRef, {
          [`secciones.${seccionIndex}.preguntas`]: preguntasActualizadas,
        });

        setPreguntas(prevPreguntas => prevPreguntas.filter((pregunta) => pregunta !== preguntaSeleccionada));
        setPreguntaSeleccionada(null);
        setModalEditarPreguntaAbierto(false);
      }
    } catch (error) {
      console.error("Error al eliminar pregunta:", error);
    }
  };

  return (
    <button onClick={handleEliminarPregunta}>Eliminar Pregunta</button>
  );
};

export default EliminarPregunta;
