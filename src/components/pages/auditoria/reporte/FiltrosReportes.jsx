import React from 'react';
import { Box, TextField, Button } from '@mui/material';

const FiltrosReportes = ({ empresas, empresaSeleccionada, fecha, onEmpresaChange, onFechaChange, onFiltrar }) => {
  return (
    <Box mb={3} display="flex" justifyContent="space-between">
      <TextField
        select
        label="Seleccionar Empresa"
        value={empresaSeleccionada}
        onChange={onEmpresaChange}
        SelectProps={{
          native: true,
        }}
        variant="outlined"
        margin="normal"
      >
        <option value="">Todas las empresas</option>
        {empresas.map((empresa) => (
          <option key={empresa.nombre} value={empresa.nombre}>
            {empresa.nombre}
          </option>
        ))}
      </TextField>
      <TextField
        label="Fecha de Guardado"
        type="date"
        value={fecha}
        onChange={onFechaChange}
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={onFiltrar} style={{ alignSelf: 'center', marginTop: '16px' }}>
        Filtrar
      </Button>
    </Box>
  );
};

export default FiltrosReportes;
