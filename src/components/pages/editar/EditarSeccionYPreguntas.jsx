import React, { useState } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Modal, Box, TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const EditarSeccionYPreguntas = ({ formularioSeleccionado, setFormularioSeleccionado }) => {
  const [modalEditarSeccionAbierto, setModalEditarSeccionAbierto] = useState(false);
  const [modalEditarPreguntaAbierto, setModalEditarPreguntaAbierto] = useState(false);
  const [nuevoNombreSeccion, setNuevoNombreSeccion] = useState("");
  const [nuevoTextoPregunta, setNuevoTextoPregunta] = useState("");
  const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);

  const handleSeleccionarSeccion = (seccion) => {
    setSeccionSeleccionada(seccion);
    setNuevoNombreSeccion(seccion.nombre);
    setModalEditarSeccionAbierto(true);
  };

  const handleSeleccionarPregunta = (pregunta, seccionId, index) => {
    setPreguntaSeleccionada({ texto: pregunta, seccionId, index });
    setNuevoTextoPregunta(pregunta);
    setModalEditarPreguntaAbierto(true);
  };

  const handleGuardarCambiosSeccion = async () => {
    try {
      const seccionIndex = Object.keys(formularioSeleccionado.secciones).find(key => formularioSeleccionado.secciones[key].nombre === seccionSeleccionada.nombre);

      if (seccionIndex === undefined) {
        console.error("No se encontró la sección con el nombre:", seccionSeleccionada.nombre);
        return;
      }

      const formularioRef = doc(db, "formularios", formularioSeleccionado.id);
      await updateDoc(formularioRef, {
        [`secciones.${seccionIndex}.nombre`]: nuevoNombreSeccion,
      });

      const formularioActualizado = {
        ...formularioSeleccionado,
        secciones: {
          ...formularioSeleccionado.secciones,
          [seccionIndex]: {
            ...formularioSeleccionado.secciones[seccionIndex],
            nombre: nuevoNombreSeccion,
          },
        },
      };

      setFormularioSeleccionado(formularioActualizado);
      setModalEditarSeccionAbierto(false);
    } catch (error) {
      console.error("Error al guardar cambios en la sección:", error);
    }
  };

  const handleGuardarCambiosPregunta = async () => {
    try {
      const { seccionId, index } = preguntaSeleccionada;
      const seccionIndex = Object.keys(formularioSeleccionado.secciones).find(key => formularioSeleccionado.secciones[key].nombre === seccionId);

      if (seccionIndex === undefined) {
        console.error("No se encontró la sección con el nombre:", seccionId);
        return;
      }

      const preguntasActualizadas = [...formularioSeleccionado.secciones[seccionIndex].preguntas];
      preguntasActualizadas[index] = nuevoTextoPregunta;

      const formularioRef = doc(db, "formularios", formularioSeleccionado.id);
      await updateDoc(formularioRef, {
        [`secciones.${seccionIndex}.preguntas`]: preguntasActualizadas,
      });

      const formularioActualizado = {
        ...formularioSeleccionado,
        secciones: {
          ...formularioSeleccionado.secciones,
          [seccionIndex]: {
            ...formularioSeleccionado.secciones[seccionIndex],
            preguntas: preguntasActualizadas,
          },
        },
      };

      setFormularioSeleccionado(formularioActualizado);
      setModalEditarPreguntaAbierto(false);
    } catch (error) {
      console.error("Error al guardar cambios en la pregunta:", error);
    }
  };

  const handleEliminarPregunta = async (index, seccionId) => {
    try {
      const seccionIndex = Object.keys(formularioSeleccionado.secciones).find(key => formularioSeleccionado.secciones[key].nombre === seccionId);

      if (seccionIndex === undefined) {
        console.error("No se encontró la sección con el nombre:", seccionId);
        return;
      }

      const preguntasActualizadas = formularioSeleccionado.secciones[seccionIndex].preguntas.filter(
        (preg, idx) => idx !== index
      );

      const formularioRef = doc(db, "formularios", formularioSeleccionado.id);
      await updateDoc(formularioRef, {
        [`secciones.${seccionIndex}.preguntas`]: preguntasActualizadas,
      });

      const formularioActualizado = {
        ...formularioSeleccionado,
        secciones: {
          ...formularioSeleccionado.secciones,
          [seccionIndex]: {
            ...formularioSeleccionado.secciones[seccionIndex],
            preguntas: preguntasActualizadas,
          },
        },
      };

      setFormularioSeleccionado(formularioActualizado);
    } catch (error) {
      console.error("Error al eliminar pregunta:", error);
    }
  };

  return (
    <div>
      {Object.values(formularioSeleccionado.secciones).map((seccion, seccionIndex) => (
        <div key={seccionIndex}>
          <Typography variant="h5">{seccion.nombre}</Typography>
          <IconButton onClick={() => handleSeleccionarSeccion(seccion)}>
            <EditIcon color="primary" />
          </IconButton>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Pregunta</TableCell>
                  <TableCell align="left">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {seccion.preguntas.map((pregunta, preguntaIndex) => (
                  <TableRow key={preguntaIndex} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row" align="left">
                      {pregunta}
                    </TableCell>
                    <TableCell align="left">
                      <IconButton onClick={() => handleSeleccionarPregunta(pregunta, seccion.nombre, preguntaIndex)}>
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleEliminarPregunta(preguntaIndex, seccion.nombre)}>
                        <DeleteForeverIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}

      <Modal
        open={modalEditarSeccionAbierto}
        onClose={() => setModalEditarSeccionAbierto(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 4, minWidth: 400 }}>
          <Typography variant="h6">Editar Nombre de la Sección</Typography>
          <TextField
            label="Nuevo Nombre"
            value={nuevoNombreSeccion}
            onChange={(e) => setNuevoNombreSeccion(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleGuardarCambiosSeccion}>Guardar Cambios</Button>
        </Box>
      </Modal>

      <Modal
        open={modalEditarPreguntaAbierto}
        onClose={() => setModalEditarPreguntaAbierto(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 4, minWidth: 400 }}>
          <Typography variant="h6">Editar Pregunta</Typography>
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

export default EditarSeccionYPreguntas;
