import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import EditarPreguntas from "./EditarPreguntas";
import { FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";

const EditarFormulario = () => {
  const [formularios, setFormularios] = useState([]);
  const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);
  const [preguntasFormulario, setPreguntasFormulario] = useState([]);

  const obtenerFormularios = async () => {
    try {
      const formulariosCollection = collection(db, "formularios");
      const res = await getDocs(formulariosCollection);
      const newArr = res.docs.map((formulario) => {
        return { ...formulario.data(), id: formulario.id };
      });
      setFormularios(newArr);
    } catch (error) {
      console.error("Error al obtener formularios:", error);
    }
  };

  useEffect(() => {
    obtenerFormularios();
  }, []);

  useEffect(() => {
    const obtenerPreguntasFormulario = async () => {
      if (formularioSeleccionado) {
        try {
          const formularioRef = doc(db, "formularios", formularioSeleccionado.id);
          const formularioDoc = await getDoc(formularioRef);
          const formularioData = formularioDoc.data();
          if (formularioData && formularioData.secciones) {
            const preguntasData = Object.values(formularioData.secciones).flatMap((seccion) =>
              seccion.preguntas.map((pregunta, index) => ({
                seccionId: seccion.nombre,
                index,
                texto: pregunta
              }))
            );
            setPreguntasFormulario(preguntasData);
          } else {
            setPreguntasFormulario([]);
          }
        } catch (error) {
          console.error("Error al obtener preguntas del formulario:", error);
        }
      }
    };

    obtenerPreguntasFormulario();
  }, [formularioSeleccionado]);

  const handleChangeFormulario = (event) => {
    const formularioId = event.target.value;
    const formularioSeleccionado = formularios.find((formulario) => formulario.id === formularioId);
    setFormularioSeleccionado(formularioSeleccionado);
  };

  return (
    <div>
      <Typography variant="h4">Selecciona un formulario</Typography>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="select-formulario-label">Formulario</InputLabel>
        <Select
          labelId="select-formulario-label"
          id="select-formulario"
          value={formularioSeleccionado ? formularioSeleccionado.id : ""}
          onChange={handleChangeFormulario}
          onOpen={obtenerFormularios}
          label="Formulario"
        >
          {formularios.map((formulario) => (
            <MenuItem key={formulario.id} value={formulario.id}>
              {formulario.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div>
        {formularioSeleccionado && (
          <EditarPreguntas
            preguntas={preguntasFormulario}
            setPreguntas={setPreguntasFormulario}
            formularios={formularios}
            setFormularios={setFormularios}
            formularioSeleccionado={formularioSeleccionado}
            setFormularioSeleccionado={setFormularioSeleccionado}
          />
        )}
      </div>
    </div>
  );
};

export default EditarFormulario;
