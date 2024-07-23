// components/SeleccionEmpresa.js
import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SeleccionEmpresa = ({ empresas, empresaSeleccionada, onChange }) => (
  <FormControl fullWidth>
    <InputLabel>Empresa</InputLabel>
    <Select value={empresaSeleccionada} onChange={onChange}>
      <MenuItem value="">
        <em>Seleccione una empresa</em>
      </MenuItem>
      {empresas.map((empresa) => (
        <MenuItem key={empresa.id} value={empresa.nombre}>
          {empresa.nombre}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default SeleccionEmpresa;
