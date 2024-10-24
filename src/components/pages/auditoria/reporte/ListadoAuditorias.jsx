import React, { useEffect, useState } from "react";
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

const ListadoAuditorias = ({ onSelect, empresaSeleccionada }) => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (error) {
        setError("Error al obtener reportes: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, []);

  if (loading) return <Typography>Cargando reportes...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  // Filtrar los reportes si hay una empresa seleccionada
  const reportesFiltrados = empresaSeleccionada
    ? reportes.filter((reporte) => reporte.empresa?.nombre === empresaSeleccionada)
    : reportes;

  return (
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
          {reportesFiltrados.map((reporte) => (
            <TableRow key={reporte.id}>
              <TableCell>{reporte.empresa?.nombre || "Nombre no disponible"}</TableCell>
              <TableCell>{reporte.sucursal || "Sucursal no disponible"}</TableCell>
              <TableCell>{reporte.formulario.nombre || "Sucursal no disponible"}</TableCell>
              <TableCell>
                {reporte.fechaGuardado
                  ? new Date(reporte.fechaGuardado.seconds * 1000).toLocaleString()
                  : "Fecha no disponible"}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onSelect(reporte)}
                >
                  Ver Detalles
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListadoAuditorias;
