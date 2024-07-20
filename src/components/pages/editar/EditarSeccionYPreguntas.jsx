import React, { useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Box,
  TextField,
  Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { doc, updateDoc, deleteField, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const EditarSeccionYPreguntas = ({ formularioSeleccionado, setFormularioSeleccionado }) => {
  const [modalEditarFormularioAbierto, setModalEditarFormularioAbierto] = useState(false);
  const [modalEditarSeccionAbierto, setModalEditarSeccionAbierto] = useState(false);
  const [modalEditarPreguntaAbierto, setModalEditarPreguntaAbierto] = useState(false);
  const [modalAgregarPreguntaAbierto, setModalAgregarPreguntaAbierto] = useState(false);
  const [nuevoNombreFormulario, setNuevoNombreFormulario] = useState("");
  const [nuevoNombreSeccion, setNuevoNombreSeccion] = useState("");
  const [nuevoTextoPregunta, setNuevoTextoPregunta] = useState("");
  const [nuevaPregunta, setNuevaPregunta] = useState("");
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

  const handleGuardarCambiosFormulario = async () => {
    try {
      if (!nuevoNombreFormulario) {
        console.error("Nombre del formulario no proporcionado.");
        return;
      }

      const formularioRef = doc(db, "formularios", formularioSeleccionado.id);
      await updateDoc(formularioRef, {
        nombre: nuevoNombreFormulario
      });

      const formularioActualizado = {
        ...formularioSeleccionado,
        nombre: nuevoNombreFormulario
      };

      setFormularioSeleccionado(formularioActualizado);
      setModalEditarFormularioAbierto(false);
    } catch (error) {
      console.error("Error al guardar cambios en el formulario:", error);
    }
  };

  const handleGuardarCambiosSeccion = async () => {
    try {
      if (!seccionSeleccionada) {
        console.error("Sección no seleccionada.");
        return;
      }

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
      if (!preguntaSeleccionada || !seccionSeleccionada) {
        console.error("Pregunta o sección no seleccionada.");
        return;
      }

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
      if (!seccionId) {
        console.error("ID de sección no proporcionado.");
        return;
      }

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

  const handleEliminarSeccion = async (nombreSeccion) => {
    try {
      if (!nombreSeccion) {
        console.error("Nombre de sección no proporcionado.");
        return;
      }

      const seccionIndex = Object.keys(formularioSeleccionado.secciones).find(key => formularioSeleccionado.secciones[key].nombre === nombreSeccion);

      if (seccionIndex === undefined) {
        console.error("No se encontró la sección con el nombre:", nombreSeccion);
        return;
      }

      const formularioRef = doc(db, "formularios", formularioSeleccionado.id);
      await updateDoc(formularioRef, {
        [`secciones.${seccionIndex}`]: deleteField()
      });

      const formularioActualizado = {
        ...formularioSeleccionado,
        secciones: Object.keys(formularioSeleccionado.secciones).reduce((acc, key) => {
          if (key !== seccionIndex) {
            acc[key] = formularioSeleccionado.secciones[key];
          }
          return acc;
        }, {})
      };

      setFormularioSeleccionado(formularioActualizado);
    } catch (error) {
      console.error("Error al eliminar sección:", error);
    }
  };

  const handleEliminarFormulario = async () => {
    try {
      const formularioRef = doc(db, "formularios", formularioSeleccionado.id);
      await deleteDoc(formularioRef);

      setFormularioSeleccionado(null);
    } catch (error) {
      console.error("Error al eliminar formulario:", error);
    }
  };

  const handleAgregarPregunta = async () => {
    try {
      if (!seccionSeleccionada || !nuevaPregunta) {
        console.error("Sección no seleccionada o nueva pregunta vacía.");
        return;
      }

      const seccionIndex = Object.keys(formularioSeleccionado.secciones).find(key => formularioSeleccionado.secciones[key].nombre === seccionSeleccionada.nombre);

      if (seccionIndex === undefined) {
        console.error("No se encontró la sección con el nombre:", seccionSeleccionada.nombre);
        return;
      }

      const preguntasActualizadas = [
        ...formularioSeleccionado.secciones[seccionIndex].preguntas,
        nuevaPregunta
      ];

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
      setModalAgregarPreguntaAbierto(false);
      setNuevaPregunta("");
    } catch (error) {
      console.error("Error al agregar pregunta:", error);
    }
  };

  return (
    <div>
      {/* Sección para editar el formulario */}
      <Button onClick={() => setModalEditarFormularioAbierto(true)}>
        Editar Formulario
      </Button>

      {/* Botón para eliminar el formulario */}
      <Button
        variant="contained"
        color="error"
        onClick={() => handleEliminarFormulario(formularioSeleccionado.id)}
      >
        Eliminar Formulario
        <DeleteForeverIcon />
      </Button>

      <Typography variant="h4">{formularioSeleccionado.nombre}</Typography>
      
      {/* Aquí puedes añadir más secciones y preguntas */}
      {Object.values(formularioSeleccionado.secciones).map((seccion, seccionIndex) => (
        <div key={seccionIndex}>
          <Typography variant="h5">{seccion.nombre}</Typography>
          <IconButton onClick={() => handleSeleccionarSeccion(seccion)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleEliminarSeccion(seccion.nombre)}>
            <DeleteForeverIcon color="error" />
          </IconButton>
          <IconButton onClick={() => {
            setSeccionSeleccionada(seccion);
            setModalAgregarPreguntaAbierto(true);
          }}>
            <AddIcon color="primary" />
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
                {seccion.preguntas && seccion.preguntas.map((pregunta, preguntaIndex) => (
                  <TableRow key={preguntaIndex} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell align="left">{pregunta}</TableCell>
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
        open={modalEditarFormularioAbierto}
        onClose={() => setModalEditarFormularioAbierto(false)}
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6">Editar Formulario</Typography>
          <TextField
            fullWidth
            label="Nombre del Formulario"
            value={nuevoNombreFormulario}
            onChange={(e) => setNuevoNombreFormulario(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleGuardarCambiosFormulario}>
            Guardar Cambios
          </Button>
        </Box>
      </Modal>

      <Modal
        open={modalEditarSeccionAbierto}
        onClose={() => setModalEditarSeccionAbierto(false)}
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6">Editar Sección</Typography>
          <TextField
            fullWidth
            label="Nombre de la Sección"
            value={nuevoNombreSeccion}
            onChange={(e) => setNuevoNombreSeccion(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleGuardarCambiosSeccion}>
            Guardar Cambios
          </Button>
        </Box>
      </Modal>

      <Modal
        open={modalEditarPreguntaAbierto}
        onClose={() => setModalEditarPreguntaAbierto(false)}
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6">Editar Pregunta</Typography>
          <TextField
            fullWidth
            label="Texto de la Pregunta"
            value={nuevoTextoPregunta}
            onChange={(e) => setNuevoTextoPregunta(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleGuardarCambiosPregunta}>
            Guardar Cambios
          </Button>
        </Box>
      </Modal>

      <Modal
        open={modalAgregarPreguntaAbierto}
        onClose={() => setModalAgregarPreguntaAbierto(false)}
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6">Agregar Pregunta</Typography>
          <TextField
            fullWidth
            label="Texto de la Pregunta"
            value={nuevaPregunta}
            onChange={(e) => setNuevaPregunta(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleAgregarPregunta}>
            Agregar Pregunta
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default EditarSeccionYPreguntas;