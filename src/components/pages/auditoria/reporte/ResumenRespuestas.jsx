import React from "react";
import { Typography, Box, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

const ResumenRespuestas = ({ respuestas = {}, comentarios = {}, secciones = [] }) => {
  // Asegúrate de que respuestas, comentarios y secciones sean objetos válidos
  const respuestasObj = respuestas || {};
  const comentariosObj = comentarios || {};

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Resumen de Respuestas
      </Typography>

      {secciones.length === 0 ? (
        <Typography variant="body1">No hay respuestas o comentarios disponibles.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sección</TableCell>
              <TableCell>Pregunta</TableCell>
              <TableCell>Respuesta</TableCell>
              <TableCell>Comentario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {secciones.map((seccion) =>
              seccion.preguntas.map((pregunta, index) => (
                <TableRow key={`${seccion.nombre}-${index}`}>
                  <TableCell>{seccion.nombre}</TableCell>
                  <TableCell>{pregunta.texto}</TableCell>
                  <TableCell>{respuestasObj[seccion.nombre] ? respuestasObj[seccion.nombre][index] || "" : ""}</TableCell>
                  <TableCell>{comentariosObj[seccion.nombre] ? comentariosObj[seccion.nombre][index] || "" : ""}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default ResumenRespuestas;
