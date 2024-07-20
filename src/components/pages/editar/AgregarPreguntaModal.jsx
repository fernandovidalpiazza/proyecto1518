import React from "react";
import { Typography, TextField, Button, Modal, Box } from "@mui/material";

const AgregarPreguntaModal = ({ open, onClose, textoPregunta, setTextoPregunta, onAgregar }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">Agregar Pregunta</Typography>
        <TextField
          fullWidth
          label="Texto de la Pregunta"
          value={textoPregunta}
          onChange={(e) => setTextoPregunta(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={onAgregar}>
          Agregar Pregunta
        </Button>
      </Box>
    </Modal>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default AgregarPreguntaModal;
