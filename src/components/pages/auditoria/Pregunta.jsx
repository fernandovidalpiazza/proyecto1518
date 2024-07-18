import React from "react";
import { Button, Grid, TextField } from "@mui/material";

const respuestasPosibles = ["Conforme", "No conforme", "Necesita mejora", "No aplica"];

const Pregunta = ({ pregunta, respuestas, handleRespuestaChange, comentario, handleComentarioChange, handleGuardarComentario }) => (
  <Grid item xs={12}>
    <p>{pregunta}</p>
    <Grid container spacing={1}>
      {respuestasPosibles.map((respuesta, index) => (
        <Grid item key={index}>
          <Button
            variant={respuestas === respuesta ? "contained" : "outlined"}
            onClick={() => handleRespuestaChange(respuesta)}
          >
            {respuesta}
          </Button>
        </Grid>
      ))}
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Comentario"
          value={comentario}
          onChange={(e) => handleComentarioChange(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleGuardarComentario}>
          Guardar Comentario
        </Button>
      </Grid>
    </Grid>
  </Grid>
);

export default Pregunta;
