import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, Box, Typography } from "@mui/material";

const SeleccionEmpresa = ({ empresas, empresaSeleccionada, onChange }) => {
  const [empresaSeleccionadaLocal, setEmpresaSeleccionadaLocal] = useState(empresaSeleccionada);

  useEffect(() => {
    setEmpresaSeleccionadaLocal(empresaSeleccionada);
  }, [empresaSeleccionada]);

  const handleChange = (event) => {
    const selectedEmpresa = empresas.find((empresa) => empresa.nombre === event.target.value);
    setEmpresaSeleccionadaLocal(selectedEmpresa);
    onChange(selectedEmpresa);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Empresa</InputLabel>
      <Select
        value={empresaSeleccionadaLocal ? empresaSeleccionadaLocal.nombre : ""}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>Seleccione una empresa</em>
        </MenuItem>
        {empresas.map((empresa) => (
          <MenuItem key={empresa.nombre} value={empresa.nombre}>
            <Box display="flex" alignItems="center">
              {empresa.logo && empresa.logo.trim() !== "" ? (
                <img
                  src={empresa.logo}
                  alt={`${empresa.nombre} logo`}
                  style={{ width: "50px", height: "auto", marginRight: "10px" }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                    marginRight: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "#666"
                  }}
                >
                  {empresa.nombre.charAt(0).toUpperCase()}
                </Box>
              )}
              <Typography variant="body1">{empresa.nombre}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SeleccionEmpresa;
