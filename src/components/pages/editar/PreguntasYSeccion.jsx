import React from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const PreguntasYSeccion = ({ secciones, guardarRespuestas, guardarComentario, guardarImagenes }) => {
  return (
    <div>
      {secciones.map((seccion, index) => (
        <div key={index}>
          <Typography variant="h5">{seccion.nombre}</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Pregunta</TableCell>
                  <TableCell align="left">Respuesta</TableCell>
                  <TableCell align="left">Comentario</TableCell>
                  <TableCell align="left">Imagen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {seccion.preguntas.map((pregunta, preguntaIndex) => (
                  <TableRow key={preguntaIndex} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row" align="left">
                      {pregunta}
                    </TableCell>
                    <TableCell align="left">
                      {/* Aquí puedes añadir un componente o lógica para ingresar respuestas */}
                    </TableCell>
                    <TableCell align="left">
                      {/* Aquí puedes añadir un componente o lógica para ingresar comentarios */}
                    </TableCell>
                    <TableCell align="left">
                      {/* Aquí puedes añadir un componente o lógica para cargar imágenes */}
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

export default PreguntasYSeccion;
