import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore"; // Agregar getDoc a los imports
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { EditAttributesOutlined } from "@mui/icons-material";

const EditarFormulario = () => {
  const [formularios, setFormularios] = useState([]);
  const [formularioSeleccionadoId, setFormularioSeleccionadoId] = useState("");
  const [formularioSeleccionadoNombre, setFormularioSeleccionadoNombre] = useState("");
  const [secciones, setSecciones] = useState([]);

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
      // Construir la referencia al documento específico que deseas actualizar
      const formularioRef = doc(db, "formularios", formularioSeleccionadoId);
  
      // Obtener el formulario actual
      const formularioSnap = await getDoc(formularioRef);
      const formularioData = formularioSnap.data();
      
      // Modificar el array de preguntas localmente
      const nuevasPreguntas = formularioData.secciones[seccionIndex].preguntas.filter((_, index) => index !== preguntaIndex);
      formularioData.secciones[seccionIndex].preguntas = nuevasPreguntas;
  
      // Actualizar el documento en Firebase con el nuevo array de preguntas
      await updateDoc(formularioRef, formularioData);
  
      console.log(`Borrando pregunta ${preguntaIndex} de la sección ${seccionIndex}`);
    } catch (error) {
      console.error("Error al borrar pregunta:", error);
    }
  };

  return (
    <div>
      <Box mb={4}>
        <FormControl fullWidth>
          <InputLabel id="select-formulario-label">Seleccionar formulario</InputLabel>
          <Select
            labelId="select-formulario-label"
            id="select-formulario"
            value={formularioSeleccionadoId}
            label="Seleccionar formulario"
            onChange={handleSeleccionarFormulario}
          >
            <MenuItem value="">
              <em>Seleccione un formulario</em>
            </MenuItem>
            {formularios.map((formulario) => (
              <MenuItem key={formulario.id} value={formulario.id}>
                {formulario.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Typography variant="h4" align="center" gutterBottom>
        {formularioSeleccionadoNombre && `Formulario Seleccionado: ${formularioSeleccionadoNombre}`}
      </Typography>
      <div>
        <h3>Secciones y Preguntas</h3>
        {secciones.map((seccion, seccionIndex) => (
          <div key={seccionIndex}>
            <h4>
              Sección {seccionIndex + 1}: {seccion.nombre}
            </h4>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pregunta</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seccion.preguntas.map((pregunta, preguntaIndex) => (
                    <TableRow key={preguntaIndex}>
                      <TableCell>{pregunta}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleBorrarPregunta(seccionIndex, preguntaIndex)}>Borrar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditarFormulario;
