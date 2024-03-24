import React, { useState } from "react";
import { Modal, TextField, Button } from "@mui/material";

const Editar = ({ preguntaActual, handleClose, handleGuardar, open }) => {
  // Estado para almacenar la pregunta editada
  const [nuevaPregunta, setNuevaPregunta] = useState(preguntaActual);

  // Función para manejar cambios en el campo de texto
  const handleChange = (event) => {
    // Actualizar el estado con el valor del campo de texto
    setNuevaPregunta(event.target.value);
  };

  // Función para guardar los cambios y cerrar el modal
  const handleGuardarCambios = () => {
    // Llamar a la función de guardar con la nueva pregunta
    handleGuardar(nuevaPregunta);
    // Cerrar el modal
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
          {/* Componente TextField controlado por el estado nuevaPregunta */}
          <TextField
            id="pregunta"
            label="Pregunta"
            value={nuevaPregunta}
            onChange={handleChange} // Manejar cambios en el campo de texto
            fullWidth
          />
          {/* Botones para guardar cambios y cancelar */}
          <Button onClick={handleGuardarCambios} variant="contained" color="primary" style={{ marginRight: 8 }}>Guardar</Button>
          <Button onClick={handleClose} variant="outlined" color="primary">Cancelar</Button>
        </div>
      </div>
    </Modal>
  );
};

export default Editar;
