import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper, Button } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "./../../../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Register the components needed for ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reporte = ({ empresa, sucursal, respuestas, comentarios, imagenes, secciones }) => {
  const generarEstadisticas = () => {
    // Generate statistics from responses
    const conforme = respuestas.flat().filter((r) => r === "Conforme").length;
    const noConforme = respuestas.flat().filter((r) => r === "No Conforme").length;
    const necesitaMejora = respuestas.flat().filter((r) => r === "Necesita Mejora").length;
    const noAplica = respuestas.flat().filter((r) => r === "No Aplica").length;

    return {
      labels: ["Conforme", "No Conforme", "Necesita Mejora", "No Aplica"],
      datasets: [
        {
          label: "Respuestas",
          data: [conforme, noConforme, necesitaMejora, noAplica],
          backgroundColor: ["#4caf50", "#f44336", "#ff9800", "#9e9e9e"],
        },
      ],
    };
  };

  const datosEstadisticos = generarEstadisticas();

  const uploadImage = async (file) => {
    const storageRef = ref(storage, 'imagenes/' + file.name);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const guardarReporte = async () => {
    try {
      // Convert images to URLs
      const imagenesURLs = await Promise.all(imagenes.map(async (imagen) => await uploadImage(imagen)));

      const reporte = {
        empresa,
        sucursal,
        respuestas: respuestas.flat(), // Ensure this is in the correct format
        comentarios: comentarios.flat(), // Ensure this is in the correct format
        imagenes: imagenesURLs, // Save only the image URLs
        secciones,
        estadisticas: generarEstadisticas(),
        fechaGuardado: new Date(),
      };

      await addDoc(collection(db, "reportes"), reporte);
      alert("Reporte guardado exitosamente");
    } catch (error) {
      console.error("Error al guardar el reporte:", error);
      alert("Error al guardar el reporte");
    }
  };

  return (
    <Paper style={{ padding: "16px", marginTop: "16px" }}>
      <Typography variant="h4" gutterBottom>
        Informe de Auditoría
      </Typography>

      <Typography variant="h6" gutterBottom>
        Empresa: {empresa.nombre}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Sucursal: {sucursal}
      </Typography>

      {empresa.logo && (
        <Box mt={2} mb={4}>
          <img
            src={empresa.logo}
            alt={`Logo de ${empresa.nombre}`}
            style={{ width: "100px", height: "auto" }}
          />
        </Box>
      )}

      <Typography variant="h5" gutterBottom>
        Estadísticas de Respuestas
      </Typography>
      <Bar data={datosEstadisticos} />

      <Typography variant="h5" gutterBottom mt={4}>
        Preguntas y Respuestas
      </Typography>
      {secciones.map((seccion, indexSeccion) => (
        <Box key={indexSeccion} mb={4}>
          <Typography variant="h6" gutterBottom>
            Sección: {seccion.nombre}
          </Typography>
          <List>
            {seccion.preguntas.map((pregunta, indexPregunta) => (
              <React.Fragment key={indexPregunta}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`Pregunta: ${pregunta}`}
                    secondary={`Respuesta: ${respuestas[indexSeccion][indexPregunta] || "No disponible"}`}
                  />
                </ListItem>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    secondary={`Comentario: ${comentarios[indexSeccion][indexPregunta] || "No disponible"}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      ))}

      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button variant="contained" onClick={guardarReporte}>
          Guardar en la DB
        </Button>
      </Box>
    </Paper>
  );
};

Reporte.propTypes = {
  empresa: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    logo: PropTypes.string,
  }).isRequired,
  sucursal: PropTypes.string.isRequired,
  respuestas: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  comentarios: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  imagenes: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
  secciones: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      preguntas: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};

export default Reporte;
