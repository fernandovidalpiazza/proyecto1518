import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper } from "@mui/material";
//import { Bar } from "react-chartjs-2";
//import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar los componentes necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reporte = ({ empresa, sucursal, respuestas, comentarios, secciones }) => {
  const generarEstadisticas = () => {
    // Lógica para generar estadísticas a partir de las respuestas
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
                    secondary={`Respuesta: ${respuestas[indexSeccion][indexPregunta]}`}
                  />
                </ListItem>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    secondary={`Comentario: ${comentarios[indexSeccion][indexPregunta]}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      ))}
    </Paper>
  );
};

export default Reporte;
