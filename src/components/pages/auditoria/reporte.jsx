import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const respuestasPosibles = ["Conforme", "No conforme", "Necesita mejora", "No aplica"];

const Reporte = ({ empresa, sucursal, respuestas, comentarios = [], secciones }) => {
  if (!respuestas || respuestas.length === 0) {
    return <div>No hay datos de respuestas disponibles.</div>;
  }

  // Convertir secciones a un arreglo si es un objeto
  const seccionesArray = Array.isArray(secciones) ? secciones : Object.values(secciones);

  // Verificación y manejo de secciones
  if (!seccionesArray || !Array.isArray(seccionesArray)) {
    console.error("Secciones no válidas:", secciones);
    return <div>Secciones no válidas.</div>;
  }

  const totalRespuestas = respuestas.flat().filter(res => respuestasPosibles.includes(res)).length;

  const estadisticas = {
    Conforme: respuestas.flat().filter((res) => res === "Conforme").length,
    "No conforme": respuestas.flat().filter((res) => res === "No conforme").length,
    "Necesita mejora": respuestas.flat().filter((res) => res === "Necesita mejora").length,
    "No aplica": respuestas.flat().filter((res) => res === "No aplica").length,
  };

  const data = Object.entries(estadisticas).map(([key, value]) => ({
    name: key,
    value,
    porcentaje: ((value / totalRespuestas) * 100).toFixed(2),
  }));

  const COLORS = ["#0088FE", "#FF8042", "#FFBB28", "#FF5656"];

  return (
    <div>
      <Typography variant="h2">Reporte de Auditoría</Typography>
      <Typography variant="h3">Datos de la Empresa</Typography>
      <Typography>Empresa: {empresa}</Typography>
      <Typography>Sucursal: {sucursal}</Typography>
      <Typography variant="h3">Resumen de Respuestas</Typography>
      <Typography>Total de respuestas: {totalRespuestas}</Typography>
      {Object.entries(estadisticas).map(([key, value]) => (
        <Typography key={key}>
          {key}: {value}
        </Typography>
      ))}

      <Typography variant="h3">Gráfico de Resultados</Typography>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, porcentaje }) => `${name} (${porcentaje}%)`}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <Typography variant="h3">Preguntas Respondidas</Typography>
      {seccionesArray.map((seccion, seccionIndex) => (
        <div key={seccionIndex}>
          <Typography variant="h4">
            Sección {seccionIndex + 1}: {seccion.nombre}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pregunta</TableCell>
                  <TableCell>Resultado</TableCell>
                  <TableCell>Comentarios</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {seccion.preguntas.map((pregunta, preguntaIndex) => (
                  <TableRow key={preguntaIndex}>
                    <TableCell>{pregunta}</TableCell>
                    <TableCell>
                      {respuestas[seccionIndex]?.[preguntaIndex] || "Sin respuesta"}
                    </TableCell>
                    <TableCell>
                      {comentarios[seccionIndex]?.[preguntaIndex] || "Sin comentario"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </div>
  );
};

export default Reporte;
