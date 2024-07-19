
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import {
  Grid,
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

const colors = {
  "Conforme": "#82ca9d",
  "No conforme": "#ff4d4d",
  "Necesita mejora": "#ffcc00",
  "No aplica": "#00bcd4",
};

const Reporte = ({ empresa, sucursal, respuestas, comentarios = [], imagenes = [], secciones }) => {
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

  // Estadísticas generales incluyendo "No aplica"
  const estadisticas = {
    Conforme: respuestas.flat().filter((res) => res === "Conforme").length,
    "No conforme": respuestas.flat().filter((res) => res === "No conforme").length,
    "Necesita mejora": respuestas.flat().filter((res) => res === "Necesita mejora").length,
    "No aplica": respuestas.flat().filter((res) => res === "No aplica").length,
  };

  // Estadísticas excluyendo "No aplica"
  const estadisticasSinNoAplica = {
    Conforme: respuestas.flat().filter((res) => res === "Conforme").length,
    "No conforme": respuestas.flat().filter((res) => res === "No conforme").length,
    "Necesita mejora": respuestas.flat().filter((res) => res === "Necesita mejora").length,
  };

  // Calcular el total de respuestas
  const totalRespuestas = respuestas.flat().length;

  // Función para calcular el porcentaje
  const calcularPorcentaje = (valor, total) => ((valor / total) * 100).toFixed(2);

  return (
    <div>
      {/* Cabecera */}
      <Typography variant="h2" gutterBottom>
        Reporte de Auditoría
      </Typography>
      <Typography variant="h4" gutterBottom>
        Datos de la Empresa
      </Typography>
      <Typography variant="h6">Empresa: {empresa}</Typography>
      <Typography variant="h6">Sucursal: {sucursal}</Typography>
      <Typography variant="h4" gutterBottom>
        Resumen de Respuestas
      </Typography>
      <Typography variant="body1">
        Total de respuestas: {totalRespuestas}
      </Typography>
      {Object.entries(estadisticas).map(([key, value]) => (
        <Typography key={key} variant="body1">
          {key}: {value}
        </Typography>
      ))}

      <Grid container spacing={2}>
        {/* Columna para gráficos */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Estadísticas Generales
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.keys(estadisticas).map(key => ({ name: key, value: estadisticas[key] }))}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
              >
                {Object.keys(estadisticas).map((key, index) => (
                  <Cell key={`cell-${index}`} fill={colors[key] || "#8884d8"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Estadísticas (Sin "No aplica")
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.keys(estadisticasSinNoAplica).map(key => ({ name: key, value: estadisticasSinNoAplica[key] }))}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
              >
                {Object.keys(estadisticasSinNoAplica).map((key, index) => (
                  <Cell key={`cell-${index}`} fill={colors[key] || "#8884d8"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        {/* Columna para tabla de resumen */}
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sección</TableCell>
                  <TableCell>Pregunta</TableCell>
                  <TableCell>Respuesta</TableCell>
                  <TableCell>Comentario</TableCell>
                  <TableCell>Imagen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {seccionesArray.map((seccion, seccionIndex) =>
                  seccion.preguntas.map((pregunta, preguntaIndex) => (
                    <TableRow key={`${seccionIndex}-${preguntaIndex}`}>
                      <TableCell>{seccion.nombre}</TableCell>
                      <TableCell>{pregunta}</TableCell>
                      <TableCell>{respuestas[seccionIndex]?.[preguntaIndex] || "No respondido"}</TableCell>
                      <TableCell>{comentarios[seccionIndex]?.[preguntaIndex] || "Sin comentario"}</TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {imagenes[seccionIndex]?.[preguntaIndex] && (
                            <>
                              <img
                                src={URL.createObjectURL(imagenes[seccionIndex][preguntaIndex])}
                                alt={`Imagen de la pregunta ${preguntaIndex}`}
                                style={{ maxWidth: '500px', maxHeight: '1000px', marginBottom: '8px' }}
                              />
                              <Typography variant="caption">Imagen de la pregunta {preguntaIndex + 1}</Typography>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default Reporte;
