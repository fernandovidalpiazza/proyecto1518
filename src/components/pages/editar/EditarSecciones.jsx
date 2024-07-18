import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const EditarPreguntas = ({ preguntas, setPreguntas, modalEditarPreguntaAbierto, setModalEditarPreguntaAbierto, nuevoTextoPregunta, setNuevoTextoPregunta, preguntaSeleccionada, setPreguntaSeleccionada, handleGuardarCambiosPregunta, handleEliminarPregunta }) => {

  const handleSeleccionarPregunta = (pregunta) => {
    setPreguntaSeleccionada(pregunta);
    setNuevoTextoPregunta(pregunta.texto);
    setModalEditarPreguntaAbierto(true);
  };

  return (
    <div>
      <Typography variant="h5">Editar Preguntas</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Pregunta</TableCell>
              <TableCell align="left">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preguntas.map((pregunta, index) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row" align="left">
                  {pregunta.texto}
                </TableCell>
                <TableCell align="left">
                  <IconButton onClick={() => handleSeleccionarPregunta(pregunta)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleEliminarPregunta(pregunta)}>
                    <DeleteForeverIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalEditarPreguntaAbierto}
        onClose={() => setModalEditarPreguntaAbierto(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={style}>
          <Typography variant="h6">Editar Texto de la Pregunta</Typography>
          <TextField
            label="Nuevo Texto"
            value={nuevoTextoPregunta}
            onChange={(e) => setNuevoTextoPregunta(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleGuardarCambiosPregunta}>Guardar Cambios</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default EditarPreguntas;
