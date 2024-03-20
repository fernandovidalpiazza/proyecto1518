import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import SelectorFormulario from "./SelectorFormulario";
import SeccionesYPreguntas from "./SeccionesYPreguntas";
import TituloFormulario from "./TituloFormulario";
import { Modal } from "@mui/material";
import Editar from "./Editar";

const EditarFormulario = () => {
  const [formularios, setFormularios] = useState([]);
  const [formularioSeleccionadoId, setFormularioSeleccionadoId] = useState("");
  const [formularioSeleccionadoNombre, setFormularioSeleccionadoNombre] = useState("");
  const [secciones, setSecciones] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState("");
  const [seccionIndex, setSeccionIndex] = useState(null);
  const [preguntaIndex, setPreguntaIndex] = useState(null);

  useEffect(() => {
    const obtenerFormularios = async () => {
      try {
        const formulariosCollection = collection(db, "formularios");
        const snapshot = await getDocs(formulariosCollection);
        const formulariosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
          secciones: doc.data().secciones,
        }));
        setFormularios(formulariosData);
      } catch (error) {
        console.error("Error al obtener formularios:", error);
      }
    };

    obtenerFormularios();
  }, []);

  const handleSeleccionarFormulario = (e) => {
    const idFormularioSeleccionado = e.target.value;
    const formularioSeleccionado = formularios.find((formulario) => formulario.id === idFormularioSeleccionado);
    setFormularioSeleccionadoId(idFormularioSeleccionado);
    setFormularioSeleccionadoNombre(formularioSeleccionado.nombre);
    setSecciones(formularioSeleccionado.secciones);
  };

  const handleBorrarPregunta = async (seccionIndex, preguntaIndex) => {
    try {
      const formularioRef = doc(db, "formularios", formularioSeleccionadoId);
      const formularioSnap = await getDoc(formularioRef);
      const formularioData = formularioSnap.data();
      const nuevasPreguntas = formularioData.secciones[seccionIndex].preguntas.filter((_, index) => index !== preguntaIndex);
      formularioData.secciones[seccionIndex].preguntas = nuevasPreguntas;
      await updateDoc(formularioRef, formularioData);
      console.log(`Borrando pregunta ${preguntaIndex} de la sección ${seccionIndex}`);
    } catch (error) {
      console.error("Error al borrar pregunta:", error);
    }
  };

  const handleAbrirModalEditar = (seccionIndex, preguntaIndex, pregunta) => {
    setSeccionIndex(seccionIndex);
    setPreguntaIndex(preguntaIndex);
    setPreguntaActual(pregunta);
    setModalAbierto(true);
  };

  const handleCloseModalEditar = () => {
    setModalAbierto(false);
  };

  const handleGuardarCambiosPregunta = async (nuevaPregunta) => {
    try {
      const formularioRef = doc(db, "formularios", formularioSeleccionadoId);
      const formularioSnap = await getDoc(formularioRef);
      const formularioData = formularioSnap.data();
      formularioData.secciones[seccionIndex].preguntas[preguntaIndex] = nuevaPregunta;
      await updateDoc(formularioRef, formularioData);
      console.log(`Guardando cambios en la pregunta ${preguntaIndex} de la sección ${seccionIndex}`);
      handleCloseModalEditar();
    } catch (error) {
      console.error("Error al guardar cambios en la pregunta:", error);
    }
  };

  return (
    <div>
      <TituloFormulario />
      <SelectorFormulario
        formularios={formularios}
        formularioSeleccionadoId={formularioSeleccionadoId}
        handleSeleccionarFormulario={handleSeleccionarFormulario}
      />
      <SeccionesYPreguntas
        secciones={secciones}
        handleBorrarPregunta={handleBorrarPregunta}
        handleAbrirModalEditar={handleAbrirModalEditar}
      />

      {/* Modal para editar pregunta */}
      <Modal
        open={modalAbierto}
        onClose={handleCloseModalEditar}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 16,
          maxWidth: 400,
          width: '100%'
        }}>
          <Editar
            preguntaActual={preguntaActual}
            handleClose={handleCloseModalEditar}
            handleGuardar={handleGuardarCambiosPregunta}
            open={modalAbierto}
          />
        </div>
      </Modal>
    </div>
  );
};

export default EditarFormulario;
