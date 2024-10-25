import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./../../../../firebaseConfig";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import html2pdf from "html2pdf.js";
import "./ReportesPage.css";
import FirmaSection from "./FirmaSection";
import EstadisticasChart from "./EstadisticasChart";
import ResumenRespuestas from "./ResumenRespuestas";
import FiltrosReportes from "./FiltrosReportes";

const ReportesPage = () => {
  const [reportes, setReportes] = useState([]);
  const [filteredReportes, setFilteredReportes] = useState([]);
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const detalleRef = useRef();

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reportes"));
        const reportesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        reportesData.sort((a, b) => {
          const fechaA = a.fechaGuardado
            ? new Date(a.fechaGuardado.seconds * 1000)
            : new Date(0);
          const fechaB = b.fechaGuardado
            ? new Date(b.fechaGuardado.seconds * 1000)
            : new Date(0);
          return fechaB - fechaA;
        });

        setReportes(reportesData);
        setFilteredReportes(reportesData);
      } catch (error) {
        setError("Error al obtener reportes: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, []);

  useEffect(() => {
    if (selectedEmpresa) {
      setFilteredReportes(
        reportes.filter((reporte) => reporte.empresa.nombre === selectedEmpresa)
      );
    } else {
      setFilteredReportes(reportes);
    }
  }, [selectedEmpresa, reportes]);

  const handleSelectReporte = (reporte) => {
    setSelectedReporte(reporte);
  };

  const handleCloseDetalles = () => {
    setSelectedReporte(null);
  };

  const handleDownloadPDF = () => {
    const element = detalleRef.current;

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: "detalle_reporte.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { 
        unit: "in", 
        format: "letter", 
        orientation: "portrait",
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'], // Evita que los elementos como tablas y gráficos se corten
      },
    };

    html2pdf().from(element).set(opt).save();
  };

  const handleChangeEmpresa = (event) => {
    setSelectedEmpresa(event.target.value);
  };

  if (loading) return <Typography>Cargando reportes...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  // Obtén la lista única de nombres de empresa
  const empresas = [...new Set(reportes.map((reporte) => reporte.empresa.nombre))];

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
          <Typography variant="h6">
            Sucursal: {selectedReporte.sucursal ?? "Sucursal no disponible"}
          </Typography>
          <Typography variant="h6">
            Fecha y Hora de Guardado:{" "}
            {selectedReporte.fechaGuardado
              ? new Date(
                  selectedReporte.fechaGuardado.seconds * 1000
                ).toLocaleString()
              : "Fecha no disponible"}
          </Typography>

          <ResumenRespuestas
            respuestas={selectedReporte.respuestas ?? {}}
            comentarios={selectedReporte.comentarios ?? {}}
            secciones={selectedReporte.secciones ?? []}
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
            <Box flex={1} minWidth="300px" maxWidth="45%" mb={3} className="page-break-avoid">
              <EstadisticasChart
                estadisticas={selectedReporte.estadisticas ?? {}}
                title="Estadísticas Generales"
              />
            </Box>
            <Box flex={1} minWidth="300px" maxWidth="45%" mb={3} className="page-break-avoid">
              <EstadisticasChart
                estadisticas={selectedReporte.estadisticasSinNoAplica ?? {}}
                title='Estadísticas (Sin "No aplica")'
              />
            </Box>
          </Box>

          <Box mb={3} className="page-break-avoid">
            <TableContainer component={Paper}>
              <Table className="pdf-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Formulario</TableCell>
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
                        <TableCell>{selectedReporte.formulario.nombre}</TableCell>
                        <TableCell>{seccion.nombre}</TableCell>
                        <TableCell>{pregunta}</TableCell>
                        <TableCell>
                          {selectedReporte.respuestas[idx] ?? "Respuesta no disponible"}
                        </TableCell>
                        <TableCell>
                          {selectedReporte.comentarios[idx] ?? "Comentario no disponible"}
                        </TableCell>
                        <TableCell>
                          {selectedReporte.imagenes && selectedReporte.imagenes[idx] ? (
                            <img
                              src={selectedReporte.imagenes[idx]}
                              alt="Imagen"
                              style={{ width: "100px" }}
                            />
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

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadPDF}
            >
              Descargar PDF
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseDetalles}
              style={{ marginLeft: "10px" }}
            >
              Volver
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <FiltrosReportes
            empresas={empresas.map((nombre) => ({ nombre }))}
            empresaSeleccionada={selectedEmpresa}
            onChangeEmpresa={handleChangeEmpresa}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Empresa</TableCell>
                  <TableCell>Sucursal</TableCell>
                  <TableCell>Formulario</TableCell>
                  <TableCell>Fecha de Guardado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReportes.map((reporte) => (
                  <TableRow key={reporte.id}>
                    <TableCell>{reporte.empresa.nombre}</TableCell>
                    <TableCell>{reporte.sucursal}</TableCell>
                    <TableCell>{reporte.formulario.nombre}</TableCell>
                    <TableCell>
                      {reporte.fechaGuardado
                        ? new Date(reporte.fechaGuardado.seconds * 1000).toLocaleString()
                        : "Fecha no disponible"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSelectReporte(reporte)}
                      >
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default ReportesPage;
