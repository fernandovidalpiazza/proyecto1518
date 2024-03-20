import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";

const Formulario = () => {
  const [nombreFormulario, setNombreFormulario] = useState("");
  const [secciones, setSecciones] = useState([{ nombre: "", preguntas: "" }]);

  const handleChangeNombre = (event) => {
    setNombreFormulario(event.target.value);
  };

  const handleChangeSeccionNombre = (index, event) => {
    const nuevasSecciones = [...secciones];
    nuevasSecciones[index].nombre = event.target.value;
    setSecciones(nuevasSecciones);
  };

  const handleChangePreguntas = (index, event) => {
    const nuevasSecciones = [...secciones];
    nuevasSecciones[index].preguntas = event.target.value;
    setSecciones(nuevasSecciones);
  };

  const handleAgregarSeccion = () => {
    setSecciones([...secciones, { nombre: "", preguntas: "" }]);
  };

  const handleEliminarSeccion = (index) => {
    const nuevasSecciones = [...secciones];
    nuevasSecciones.splice(index, 1); // Eliminar la sección en el índice especificado
    setSecciones(nuevasSecciones);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Lógica para enviar el formulario
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Crear Nuevo Formulario
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          required
          id="nombreFormulario"
          name="nombreFormulario"
          label="Nombre del Formulario"
          fullWidth
          value={nombreFormulario}
          onChange={handleChangeNombre}
        />
        {secciones.map((seccion, index) => (
          <Box key={index} mt={2}>
            <Typography variant="subtitle1">Sección {index + 1}</Typography>
            <TextField
              required
              id={`nombreSeccion${index}`}
              name={`nombreSeccion${index}`}
              label="Nombre de la Sección"
              fullWidth
              value={seccion.nombre}
              onChange={(event) => handleChangeSeccionNombre(index, event)}
            />
            <TextField
              required
              id={`preguntas${index}`}
              name={`preguntas${index}`}
              label="Preguntas (Ingrese una por línea)"
              multiline
              fullWidth
              rows={5}
              value={seccion.preguntas}
              onChange={(event) => handleChangePreguntas(index, event)}
            />
            <Button variant="contained" color="error" onClick={() => handleEliminarSeccion(index)}>
              Eliminar Sección
            </Button>
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={handleAgregarSeccion}>
          Agregar Sección
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Cargar Formulario a la Base de Datos
        </Button>
      </form>
    </Box>
  );
};

export default Formulario;
