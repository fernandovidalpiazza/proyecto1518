import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./../../../../firebaseConfig";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";
import ResumenRespuestas from "./ResumenRespuestas";
import EstadisticasChart from "./EstadisticasChart";
import FirmaSection from "./FirmaSection";
import html2pdf from 'html2pdf.js';
import './ReportesPage.css';

const ReportesPage = () => {
  const [reportes, setReportes] = useState([]);
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const detalleRef = useRef();

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reportes"));
        const reportesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setReportes(reportesData);
      } catch (error) {
        setError("Error al obtener reportes: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, []);

  const handleSelectReporte = (reporte) => {
    setSelectedReporte(reporte);
  };

  const handleCloseDetalles = () => {
    setSelectedReporte(null);
  };

  const handleDownloadPDF = () => {
    const element = detalleRef.current;

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5], // Margen de 0.5 pulgadas en todos los lados
      filename: 'detalle_reporte.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  if (loading) return <Typography>Cargando reportes...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box className="reportes-container" p={3}>
      {selectedReporte ? (
        <Box ref={detalleRef} className="pdf-content">
          <Typography variant="h2" gutterBottom>
            Detalles del Reporte de Auditoría
          </Typography>
          <Typography variant="h4" gutterBottom>
            Empresa: {selectedReporte.empresa?.nombre ?? "Nombre no disponible"}
          </Typography>
          <Typography variant="h6">Sucursal: {selectedReporte.sucursal ?? "Sucursal no disponible"}</Typography>
          <Typography variant="h6">
            Fecha y Hora de Guardado: {selectedReporte.fechaGuardado ? new Date(selectedReporte.fechaGuardado.seconds * 1000).toLocaleString() : "Fecha no disponible"}
          </Typography>

          <ResumenRespuestas
            totalRespuestas={selectedReporte.totalRespuestas ?? 0}
            estadisticas={selectedReporte.estadisticas ?? {}}
          />

          <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-end" mt={1} width="auto">
            <Box flex={1} minWidth="100px" maxWidth="90%" mb={3}>
              <FirmaSection />
            </Box>
          </Box>

          <Box display="flex" flexWrap="wrap" justifyContent="space-between" mt={3}>
            <Box flex={1} minWidth="300px" maxWidth="45%" mb={3}>
              <EstadisticasChart
                estadisticas={selectedReporte.estadisticas ?? {}}
                title="Estadísticas Generales"
              />
            </Box>
            <Box flex={1} minWidth="300px" maxWidth="45%" mb={3}>
              <EstadisticasChart
                estadisticas={selectedReporte.estadisticasSinNoAplica ?? {}}
                title='Estadísticas (Sin "No aplica")'
              />
            </Box>
          </Box>

          <Box mb={3}>
            <TableContainer component={Paper}>
              <Table className="pdf-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Empresa</TableCell>
                    <TableCell>Logo</TableCell>
                    <TableCell>Sección</TableCell>
                    <TableCell>Pregunta</TableCell>
                    <TableCell>Respuesta</TableCell>
                    <TableCell>Comentario</TableCell>
                    <TableCell>Imagen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedReporte.secciones.flatMap((seccion, index) =>
                    seccion.preguntas.map((pregunta, idx) => (
                      <TableRow key={`${selectedReporte.id}-${index}-${idx}`}>
                        <TableCell>{selectedReporte.empresa.nombre}</TableCell>
                        <TableCell>
                          <img src={selectedReporte.empresa.logo} alt="Logo" style={{ width: '50px', height: '50px' }} />
                        </TableCell>
                        <TableCell>{seccion.nombre}</TableCell>
                        <TableCell>{pregunta}</TableCell>
                        <TableCell>{selectedReporte.respuestas[idx] ?? "Respuesta no disponible"}</TableCell>
                        <TableCell>{selectedReporte.comentarios[idx] ?? "Comentario no disponible"}</TableCell>
                        <TableCell>
                          {selectedReporte.imagenes[idx] ? (
                            <img src={selectedReporte.imagenes[idx]} alt={`Imagen ${idx}`} style={{ width: '100px', height: 'auto' }} />
                          ) : (
                            "Imagen no disponible"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button variant="contained" onClick={handleCloseDetalles}>
              Cerrar
            </Button>
            <Button variant="contained" onClick={handleDownloadPDF}>
              Descargar PDF
            </Button>
          </Box>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Empresa</TableCell>
                <TableCell>Sucursal</TableCell>
                <TableCell>Fecha y Hora</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportes.map((reporte) => (
                <TableRow key={reporte.id}>
                  <TableCell>{reporte.empresa?.nombre ?? "Nombre no disponible"}</TableCell>
                  <TableCell>{reporte.sucursal ?? "Sucursal no disponible"}</TableCell>
                  <TableCell>
                    {reporte.fechaGuardado ? new Date(reporte.fechaGuardado.seconds * 1000).toLocaleString() : "Fecha no disponible"}
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleSelectReporte(reporte)}>
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ReportesPage;
