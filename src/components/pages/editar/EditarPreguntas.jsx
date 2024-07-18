import React, { useEffect, useState } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Modal, Box, TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import EliminarPregunta from "./EliminarPregunta";

const EditarPreguntas = ({ formularioSeleccionado }) => {
  const [preguntas, setPreguntas] = useState([]);
  const [modalEditarPreguntaAbierto, setModalEditarPreguntaAbierto] = useState(false);
  const [nuevoTextoPregunta, setNuevoTextoPregunta] = useState("");
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);

  useEffect(() => {
    if (formularioSeleccionado && typeof formularioSeleccionado.secciones === 'object') {
      const seccionesArray = Object.values(formularioSeleccionado.secciones);
      const preguntasData = seccionesArray.flatMap((seccion) =>
        seccion.preguntas.map((pregunta, index) => ({
          seccionId: seccion.nombre,
          index,
          texto: pregunta
        }))
      );
      setPreguntas(preguntasData);
    } else {
      console.error("formularioSeleccionado.secciones no es un objeto válido:", formularioSeleccionado);
      setPreguntas([]);
    }
  }, [formularioSeleccionado]);;

  const handleSeleccionarPregunta = (pregunta) => {
    setPreguntaSeleccionada(pregunta);
    setNuevoTextoPregunta(pregunta.texto);
    setModalEditarPreguntaAbierto(true);
  };

 
  const handleGuardarCambiosPregunta = async () => {
    try {
      const { seccionId, index } = preguntaSeleccionada;
      let seccionesArray = [];
      if (Array.isArray(formularioSeleccionado.secciones)) {
        seccionesArray = formularioSeleccionado.secciones;
      } else if (typeof formularioSeleccionado.secciones === 'object') {
        seccionesArray = Object.values(formularioSeleccionado.secciones);
      } else {
        console.error("El campo 'secciones' no es un array válido:", formularioSeleccionado.secciones);
        return;
      }
      const seccionIndex = seccionesArray.findIndex((sec) => sec.nombre === seccionId);
      if (seccionIndex === -1) {
        console.error("No se encontró la sección con el nombre:", seccionId);
        return;
      }
      const preguntasActualizadas = [...seccionesArray[seccionIndex].preguntas];
      preguntasActualizadas[index] = nuevoTextoPregunta;
  
      const formularioRef = doc(db, "formularios", formularioSeleccionado.id);
      await updateDoc(formularioRef, {
        [`secciones.${seccionIndex}.preguntas`]: preguntasActualizadas,
      });
  
      const preguntasActualizadasState = preguntas.map((pregunta) =>
        pregunta === preguntaSeleccionada ? { ...pregunta, texto: nuevoTextoPregunta } : pregunta
      );
      setPreguntas(preguntasActualizadasState);
      setModalEditarPreguntaAbierto(false);
    } catch (error) {
      console.error("Error al guardar cambios en la pregunta:", error);
    }
  };
  return (
    <div>
      <Typography variant="h5">Editar Preguntas</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Pregunta</TableCell>
              <TableCell align="left">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preguntas.map((pregunta, index) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row" align="left">
                  {pregunta.texto}
                </TableCell>
                <TableCell align="left">
                  <IconButton onClick={() => handleSeleccionarPregunta(pregunta)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleEliminarPregunta(pregunta)}>
                    <DeleteForeverIcon color="error" />
                    <EliminarPregunta/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalEditarPreguntaAbierto}
        onClose={() => setModalEditarPreguntaAbierto(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 4, minWidth: 400 }}>
          <Typography variant="h6">Editar Texto de la Pregunta</Typography>
          <TextField
            label="Nuevo Texto"
            value={nuevoTextoPregunta}
            onChange={(e) => setNuevoTextoPregunta(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleGuardarCambiosPregunta}>Guardar Cambios</Button>
        </Box>
      </Modal>
      
    </div>
  );
};

export default EditarPreguntas;
