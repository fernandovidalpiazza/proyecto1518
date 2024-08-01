import React, { useState } from 'react';
import { Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './../../../../firebaseConfig';
import ResumenRespuestas from './ResumenRespuestas';
import EstadisticasChart from './EstadisticasChart';

const VistaYEdicionInforme = ({ datosIniciales }) => {
  const [datos, setDatos] = useState(datosIniciales);

  const handleSaveToDB = async () => {
    try {
      await addDoc(collection(db, 'reportes'), datos);
      alert('Informe guardado en la base de datos');
    } catch (error) {
      console.error('Error al guardar el informe:', error);
      alert('Error al guardar el informe');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h2" gutterBottom>
        Vista y Edición de Informe
      </Typography>
      <Typography variant="h4" gutterBottom>
        Empresa: {datos.empresa.nombre ?? "Nombre no disponible"}
      </Typography>
      <Typography variant="h6">Sucursal: {datos.sucursal ?? "Sucursal no disponible"}</Typography>

      <ResumenRespuestas
        totalRespuestas={datos.totalRespuestas ?? 0}
        estadisticas={datos.estadisticas ?? {}}
      />

      <Box display="flex" flexWrap="wrap" justifyContent="space-between" mt={3}>
        <Box flex={1} minWidth="300px" maxWidth="45%" mb={3}>
          <EstadisticasChart
            estadisticas={datos.estadisticas ?? {}}
            title="Estadísticas Generales"
          />
        </Box>
        <Box flex={1} minWidth="300px" maxWidth="45%" mb={3}>
          <EstadisticasChart
            estadisticas={datos.estadisticasSinNoAplica ?? {}}
            title='Estadísticas (Sin "No aplica")'
          />
        </Box>
      </Box>

      <Box mb={3}>
        <TableContainer component={Paper}>
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
              {datos.secciones.flatMap((seccion, index) =>
                seccion.preguntas.map((pregunta, idx) => (
                  <TableRow key={`${index}-${idx}`}>
                    <TableCell>{seccion.nombre}</TableCell>
                    <TableCell>{pregunta}</TableCell>
                    <TableCell>{datos.respuestas[idx] ?? "Respuesta no disponible"}</TableCell>
                    <TableCell>{datos.comentarios[idx] ?? "Comentario no disponible"}</TableCell>
                    <TableCell>
                      {datos.imagenes[idx] ? (
                        <img src={datos.imagenes[idx]} alt={`Imagen ${idx}`} style={{ width: '100px', height: 'auto' }} />
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

      <Button variant="contained" onClick={handleSaveToDB}>
        Guardar en DB
      </Button>
    </Box>
  );
};

export default VistaYEdicionInforme;
