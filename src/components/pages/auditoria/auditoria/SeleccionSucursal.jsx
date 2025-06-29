// components/SeleccionSucursal.js
import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SeleccionSucursal = ({ sucursales, sucursalSeleccionada, onChange }) => (
  <FormControl fullWidth>
    <InputLabel>Ubicación</InputLabel>
    <Select value={sucursalSeleccionada} onChange={onChange}>
      <MenuItem value="">
        <em>Casa Central</em>
      </MenuItem>
      {sucursales.map((sucursal) => (
        <MenuItem key={sucursal.id} value={sucursal.nombre}>
          Sucursal: {sucursal.nombre}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default SeleccionSucursal;