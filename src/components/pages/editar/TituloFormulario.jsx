// Archivo TituloFormulario.jsx

import React from "react";
import { Typography } from "@mui/material";

const TituloFormulario = ({ formularioSeleccionadoNombre }) => {
  return (
    <Typography variant="h4" align="center" gutterBottom>
      {formularioSeleccionadoNombre && `Formulario Seleccionado: ${formularioSeleccionadoNombre}`}
    </Typography>
  );
};

export default TituloFormulario;
