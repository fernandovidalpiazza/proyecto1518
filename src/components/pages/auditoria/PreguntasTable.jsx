import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const PreguntasTable = ({ preguntas }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">Preguntas</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {preguntas.map((pregunta, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography>{pregunta}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PreguntasTable;
