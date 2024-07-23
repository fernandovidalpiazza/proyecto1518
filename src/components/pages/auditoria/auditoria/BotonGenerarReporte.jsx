// components/BotonGenerarReporte.js
import React from "react";
import { Button } from "@mui/material";

const BotonGenerarReporte = ({ onClick, deshabilitado }) => (
  <Button
    variant="contained"
    color="primary"
    onClick={onClick}
    disabled={deshabilitado}
  >
    Generar Reporte
  </Button>
);

export default BotonGenerarReporte;
