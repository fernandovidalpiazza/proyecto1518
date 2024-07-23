// components/SeleccionSucursal.js
import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SeleccionSucursal = ({ sucursales, sucursalSeleccionada, onChange }) => (
  <FormControl fullWidth>
    <InputLabel>Sucursal</InputLabel>
    <Select value={sucursalSeleccionada} onChange={onChange}>
      <MenuItem value="">
        <em>Seleccione una sucursal</em>
      </MenuItem>
      {sucursales.map((sucursal) => (
        <MenuItem key={sucursal.id} value={sucursal.nombre}>
          {sucursal.nombre}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default SeleccionSucursal;
