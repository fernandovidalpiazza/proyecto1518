import React from "react";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const PreguntasYSeccion = ({ secciones }) => {
  return (
    <div>
      <h3>Secciones y Preguntas</h3>
      {secciones.map((seccion, seccionIndex) => (
        <div key={seccionIndex}>
          <h4>
            Sección {seccionIndex + 1}: {seccion.nombre}
          </h4>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pregunta</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {seccion.preguntas.map((pregunta, preguntaIndex) => (
                  <TableRow key={preguntaIndex}>
                    <TableCell>{pregunta}</TableCell>
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
