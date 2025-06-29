import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SeleccionFormulario = ({ formularios, formularioSeleccionadoId, onChange, disabled = false }) => (
  <FormControl fullWidth disabled={disabled}>
    <InputLabel>Formulario</InputLabel>
    <Select value={formularioSeleccionadoId} onChange={onChange}>
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
);

export default SeleccionFormulario;
