import React from "react";
import PropTypes from "prop-types";
import ResumenRespuestas from "./ResumenRespuestas";
import EstadisticasChart from "./EstadisticasPreguntas";
import ImagenesTable from "./ImagenesTable";
import { Typography, Grid, Box, Button } from "@mui/material";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./../../../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Reporte = ({
  empresa,
  sucursal,
  respuestas,
  comentarios = [],
  imagenes = [],
  secciones,
}) => {
  const navigate = useNavigate();

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

  const guardarReporte = async () => {
    try {
      const reporte = {
        empresa,
        sucursal,
        respuestas: respuestas.flat(), // Simplificar a array plano
        comentarios: comentarios.flat(), // Simplificar a array plano
        imagenes: imagenes.flat(), // Simplificar a array plano
        secciones: seccionesArray,
        estadisticas,
        estadisticasSinNoAplica,
        totalRespuestas,
        fechaGuardado: Timestamp.fromDate(new Date()), // Usar Timestamp de Firestore
      };

      await addDoc(collection(db, "reportes"), reporte);
      alert("Reporte guardado exitosamente");
    } catch (error) {
      console.error("Error al guardar el reporte:", error);
      alert("Error al guardar el reporte");
    }
  };

  const handleVolver = () => {
    navigate(-1); // Navega a la página anterior
  };

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
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button variant="contained" onClick={handleVolver}>
          Volver
        </Button>
        <Button variant="contained" onClick={guardarReporte}>
          Guardar en la DB
        </Button>
      </Box>
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
