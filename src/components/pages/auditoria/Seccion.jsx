import React, { useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import Comentario from "./Comentario";

const respuestasPosibles = ["Conforme", "No conforme", "Necesita mejora", "No aplica"];

const Seccion = ({ seccion, handleRespuestaChange, handleComentarioChange }) => {
  const [showComentario, setShowComentario] = useState(Array(seccion.preguntas.length).fill(false));

  const toggleComentario = (index) => {
    const newShowComentario = [...showComentario];
    newShowComentario[index] = !newShowComentario[index];
    setShowComentario(newShowComentario);
  };

  return (
    <div>
      <Typography variant="h4">{seccion.nombre}</Typography>
      {seccion.preguntas.map((pregunta, preguntaIndex) => (
        <Grid item xs={12} key={preguntaIndex}>
          <Typography variant="body1">{pregunta}</Typography>
          <Grid container spacing={1}>
            {respuestasPosibles.map((respuesta, index) => (
              <Grid item key={index}>
                <Button
                  variant={seccion.respuestas[preguntaIndex] === respuesta ? "contained" : "outlined"}
                  color={seccion.respuestas[preguntaIndex] === respuesta ? "primary" : "default"}
                  onClick={() => handleRespuestaChange(preguntaIndex, respuesta)}
                >
                  {respuesta}
                </Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => toggleComentario(preguntaIndex)}
              >
                Comentario
              </Button>
            </Grid>
            {showComentario[preguntaIndex] && (
              <Comentario onSave={(comentario) => handleComentarioChange(preguntaIndex, comentario)} />
            )}
          </Grid>
        </Grid>
      ))}
    </div>
  );
};

export default Seccion;
