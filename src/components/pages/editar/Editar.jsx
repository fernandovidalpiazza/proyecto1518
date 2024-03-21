import React, { useState } from "react";
import { Modal, TextField, Button } from "@mui/material";

const Editar = ({ preguntaActual, handleClose, handleGuardar, open }) => {
  const [nuevaPregunta, setNuevaPregunta] = useState(preguntaActual);

  const handleChange = (e) => {
    setNuevaPregunta(e.target.value);
  };

  const handleGuardarCambios = () => {
    handleGuardar(nuevaPregunta);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        maxWidth: 400,
        width: '100%'
      }}>
        <div>
          <h2 id="modal-title">Editar Pregunta</h2>
          <TextField
            id="pregunta"
            label="Pregunta"
            value={nuevaPregunta}
            onChange={handleChange}
            fullWidth
          />
          <Button onClick={handleGuardarCambios} variant="contained" color="primary" style={{ marginRight: 8 }}>Guardar</Button>
          <Button onClick={handleClose} variant="outlined" color="primary">Cancelar</Button>
        </div>
      </div>
    </Modal>
  );
};

export default Editar;
