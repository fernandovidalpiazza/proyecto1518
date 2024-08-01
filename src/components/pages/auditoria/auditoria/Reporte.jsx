import React from "react";
import PropTypes from "prop-types";
import ResumenRespuestas from "./ResumenRespuestas";
import EstadisticasChart from "./EstadisticasPreguntas";
import ImagenesTable from "./ImagenesTable";
import { Typography, Grid, Box } from "@mui/material";

const Reporte = ({
  empresa,
  sucursal,
  respuestas,
  comentarios = [],
  imagenes = [],
  secciones,
}) => {
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
    <Box className="reporte-container" p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h2" gutterBottom>
          Reporte de Auditoría de Higiene y Seguridad
        </Typography>
        <img src={empresa.logo} alt="Logo de la empresa" style={{ height: '60px' }} />
      </Box>
      <Typography variant="h4" gutterBottom>
        Datos de la Empresa
      </Typography>
      <Typography variant="h6">Empresa: {empresa.nombre}</Typography>
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
      {/* Eliminamos FirmaSection y GenerarPdf */}
    </Box>
  );
};

Reporte.propTypes = {
  empresa: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
  }).isRequired,
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
