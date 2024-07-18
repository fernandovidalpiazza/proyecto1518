import React, { useState } from "react";
import { Button, Grid, TextField } from "@mui/material";

const Comentario = ({ onSave }) => {
  const [comentario, setComentario] = useState('');

  const handleComentarioChange = (event) => {
    setComentario(event.target.value);
  };

  const handleGuardarComentario = () => {
    onSave(comentario);
    setComentario(''); // Limpiamos el campo de comentario después de guardar
  };

  return (
    <Grid item xs={12}>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Comentario"
        value={comentario}
        onChange={handleComentarioChange}
      />
      <Button variant="contained" color="primary" onClick={handleGuardarComentario}>
        Guardar Comentario
      </Button>
    </Grid>
  );
};

export default Comentario;
