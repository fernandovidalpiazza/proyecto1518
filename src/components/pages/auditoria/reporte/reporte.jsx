// src/components/Reporte.jsx
import React, { useRef } from "react";
import PropTypes from "prop-types";
import ResumenRespuestas from "./ResumenRespuestas";
import EstadisticasChart from "./EstadisticasChart";
import ImagenesTable from "./ImagenesTable";
import FirmaSection from "./FirmaSection";
import GenerarPdf from "./GenerarPdf";
import { Typography, Grid, Box } from "@mui/material";

const Reporte = ({
  empresa,
  sucursal,
  respuestas,
  comentarios = [],
  imagenes = [],
  secciones,
}) => {
  const targetRef = useRef();

  if (!Array.isArray(respuestas) || respuestas.length === 0) {
    return <div>No hay datos de respuestas disponibles.</div>;
  }

  const seccionesArray = Array.isArray(secciones)
    ? secciones
    : Object.values(secciones);

  if (!seccionesArray || !Array.isArray(seccionesArray)) {
    console.error("Secciones no válidas:", secciones);
    return <div>Secciones no válidas.</div>;
  }

  const estadisticas = {
    Conforme: respuestas.flat().filter((res) => res === "Conforme").length,
    "No conforme": respuestas.flat().filter((res) => res === "No conforme")
      .length,
    "Necesita mejora": respuestas
      .flat()
      .filter((res) => res === "Necesita mejora").length,
    "No aplica": respuestas.flat().filter((res) => res === "No aplica").length,
  };

  const estadisticasSinNoAplica = {
    Conforme: respuestas.flat().filter((res) => res === "Conforme").length,
    "No conforme": respuestas.flat().filter((res) => res === "No conforme")
      .length,
    "Necesita mejora": respuestas
      .flat()
      .filter((res) => res === "Necesita mejora").length,
  };

  const totalRespuestas = respuestas.flat().length;

  const todasPreguntasContestadas =
    respuestas.flat().length ===
    seccionesArray.reduce((acc, seccion) => acc + seccion.preguntas.length, 0);

  return (
    <Box className="reporte-container" ref={targetRef} p={3}>
      <Typography variant="h2" gutterBottom>
        Reporte de Auditoría
      </Typography>
      <Typography variant="h4" gutterBottom>
        Datos de la Empresa
      </Typography>
      <Typography variant="h6">Empresa: {empresa}</Typography>
      <Typography variant="h6">Sucursal: {sucursal}</Typography>
      <ResumenRespuestas
        totalRespuestas={totalRespuestas}
        estadisticas={estadisticas}
      />
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <EstadisticasChart
            estadisticas={estadisticas}
            title="Estadísticas Generales"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <EstadisticasChart
            estadisticas={estadisticasSinNoAplica}
            title='Estadísticas (Sin "No aplica")'
          />
        </Grid>
      </Grid>
      <Box mt={3}>
        <ImagenesTable
          secciones={seccionesArray}
          respuestas={respuestas}
          comentarios={comentarios}
          imagenes={imagenes}
        />
      </Box>
      <Box mt={3}>
        <FirmaSection />
      </Box>
      <Box mt={3} className="pdf-button-container">
        {todasPreguntasContestadas ? (
          <GenerarPdf targetRef={targetRef} />
        ) : (
          <Typography variant="body1" color="error">
            Todas las preguntas deben estar contestadas para generar el reporte.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

Reporte.propTypes = {
  empresa: PropTypes.string.isRequired,
  sucursal: PropTypes.string.isRequired,
  respuestas: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  comentarios: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  imagenes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.instanceOf(File))),
  secciones: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      preguntas: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};

export default Reporte;
