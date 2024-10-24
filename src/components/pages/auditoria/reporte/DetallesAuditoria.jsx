import React from "react";
import {
  Typography,
  Box,
  Button,
} from "@mui/material";
import ResumenRespuestas from "./ResumenRespuestas";
import FirmaSection from "./FirmaSection";
import EstadisticasChart from "./EstadisticasChart";

const DetallesAuditoria = ({ reporte, onClose }) => {
  if (!reporte) return null;

  return (
    <Box className="pdf-content">
      <Typography variant="h2" gutterBottom>
        Detalles del Reporte de Auditoría
      </Typography>
      <Typography variant="h4" gutterBottom>
        Empresa: {reporte.empresa?.nombre || "Nombre no disponible"}
      </Typography>
      <Typography variant="h6">
        Sucursal: {reporte.sucursal || "Sucursal no disponible"}
      </Typography>
      <Typography variant="h6">
        Fecha y Hora de Guardado:{" "}
        {reporte.fechaGuardado
          ? new Date(reporte.fechaGuardado.seconds * 1000).toLocaleString()
          : "Fecha no disponible"}
      </Typography>

      <ResumenRespuestas
        respuestas={reporte.respuestas || {}}
        comentarios={reporte.comentarios || {}}
        secciones={reporte.secciones || []}
      />

      <Box className="signature-container" mt={3}>
        <Box flex={1} minWidth="300px" maxWidth="45%">
          <Typography variant="subtitle1" gutterBottom>
            Firma del Auditor
          </Typography>
          <FirmaSection />
        </Box>
      </Box>

      <Box display="flex" flexWrap="wrap" justifyContent="space-between" mt={3}>
        <Box flex={1} minWidth="300px" maxWidth="45%" mb={3}>
          <EstadisticasChart
            estadisticas={reporte.estadisticas || {}}
            title="Estadísticas Generales"
          />
        </Box>
        <Box flex={1} minWidth="300px" maxWidth="45%" mb={3}>
          <EstadisticasChart
            estadisticas={reporte.estadisticasSinNoAplica || {}}
            title='Estadísticas (Sin "No aplica")'
          />
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end">
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Volver
        </Button>
      </Box>
    </Box>
  );
};

export default DetallesAuditoria;
