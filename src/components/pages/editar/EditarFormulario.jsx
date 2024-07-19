import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import EditarSeccionYPreguntas from "./EditarSeccionYPreguntas";

const EditarFormulario = () => {
  const [formularios, setFormularios] = useState([]);
  const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);

  useEffect(() => {
    const obtenerFormularios = async () => {
      try {
        const formulariosCollection = collection(db, "formularios");
        const res = await getDocs(formulariosCollection);
        const newArr = res.docs.map((formulario) => ({
          ...formulario.data(),
          id: formulario.id
        }));
        setFormularios(newArr);
      } catch (error) {
        console.error("Error al obtener formularios:", error);
      }
    };

    obtenerFormularios();
  }, []);

  const handleChangeFormulario = async (event) => {
    const formularioId = event.target.value;
    const formularioDoc = await getDoc(doc(db, "formularios", formularioId));
    const formularioData = formularioDoc.data();
    setFormularioSeleccionado({ ...formularioData, id: formularioId });
  };

  return (
    <div>
      <Typography variant="h4">Selecciona un formulario para editar</Typography>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="select-formulario-label">Formulario</InputLabel>
        <Select
          labelId="select-formulario-label"
          id="select-formulario"
          value={formularioSeleccionado ? formularioSeleccionado.id : ""}
          onChange={handleChangeFormulario}
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
          <EditarSeccionYPreguntas
            formularioSeleccionado={formularioSeleccionado}
            setFormularioSeleccionado={setFormularioSeleccionado}
          />
        )}
      </div>
    </div>
  );
};

export default EditarFormulario;
