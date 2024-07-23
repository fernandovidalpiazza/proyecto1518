import React, { useState, useEffect } from "react";
import { Button, Grid, Modal, TextField, Typography, Box } from "@mui/material";

const respuestasPosibles = ["Conforme", "No conforme", "Necesita mejora", "No aplica"];

const PreguntasYSeccion = ({ secciones: seccionesObj = {}, guardarRespuestas, guardarComentario, guardarImagenes }) => {
  const [respuestas, setRespuestas] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [comentario, setComentario] = useState("");
  const [currentSeccionIndex, setCurrentSeccionIndex] = useState(null);
  const [currentPreguntaIndex, setCurrentPreguntaIndex] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [imagenes, setImagenes] = useState([]); // Estado para las imágenes

  const secciones = Object.values(seccionesObj);

  useEffect(() => {
    if (!initialized && secciones.length > 0) {
      const newRespuestas = secciones.map(seccion => Array(seccion.preguntas.length).fill(''));
      setRespuestas(newRespuestas);

      const newComentarios = secciones.map(seccion => Array(seccion.preguntas.length).fill(''));
      setComentarios(newComentarios);

      const newImagenes = secciones.map(seccion => Array(seccion.preguntas.length).fill(null)); // Inicializar imágenes
      setImagenes(newImagenes);

      setInitialized(true);
    }
  }, [initialized, secciones]);

  const handleRespuestaChange = (seccionIndex, preguntaIndex, value) => {
    const nuevasRespuestas = respuestas.map((resp, index) =>
      index === seccionIndex ? [...resp.slice(0, preguntaIndex), value, ...resp.slice(preguntaIndex + 1)] : resp
    );
    setRespuestas(nuevasRespuestas);
    guardarRespuestas(nuevasRespuestas);
  };

  const handleComentarioChange = (event) => {
    setComentario(event.target.value);
  };

  const handleGuardarComentario = () => {
    if (currentSeccionIndex !== null && currentPreguntaIndex !== null) {
      const nuevosComentarios = comentarios.map((coment, index) =>
        index === currentSeccionIndex ? [...coment.slice(0, currentPreguntaIndex), comentario, ...coment.slice(currentPreguntaIndex + 1)] : coment
      );
      setComentarios(nuevosComentarios);
      guardarComentario(nuevosComentarios); // Guardar todos los comentarios
      setModalAbierto(false);
      setComentario("");
    }
  };

  const handleOpenModal = (seccionIndex, preguntaIndex) => {
    setCurrentSeccionIndex(seccionIndex);
    setCurrentPreguntaIndex(preguntaIndex);
    setComentario(comentarios[seccionIndex][preguntaIndex] || "");
    setModalAbierto(true);
  };

  const handleCloseModal = () => {
    setModalAbierto(false);
    setComentario("");
  };

  const handleFileChange = (seccionIndex, preguntaIndex, event) => {
    const file = event.target.files[0];
    const nuevasImagenes = imagenes.map((img, index) =>
      index === seccionIndex ? [...img.slice(0, preguntaIndex), file, ...img.slice(preguntaIndex + 1)] : img
    );
    setImagenes(nuevasImagenes);
    guardarImagenes(nuevasImagenes);
  };

  if (!Array.isArray(secciones)) {
    return <div>Error: Las secciones no están en el formato correcto.</div>;
  }

  return (
    <div>
      {secciones.map((seccion, seccionIndex) => (
        <div key={seccionIndex}>
          <Typography variant="h4">{seccion.nombre}</Typography>
          <Grid container spacing={2}>
            {seccion.preguntas.map((pregunta, preguntaIndex) => (
              <Grid item xs={12} key={preguntaIndex}>
                <Typography variant="body1">{pregunta}</Typography>
                <Grid container spacing={1}>
                  {respuestasPosibles.map((respuesta, index) => (
                    <Grid item key={index}>
                      <Button
                        variant={respuestas[seccionIndex]?.[preguntaIndex] === respuesta ? "contained" : "outlined"}
                        onClick={() => handleRespuestaChange(seccionIndex, preguntaIndex, respuesta)}
                        disabled={modalAbierto} // Desactiva el botón si el modal está abierto
                      >
                        {respuesta}
                      </Button>
                    </Grid>
                  ))}
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenModal(seccionIndex, preguntaIndex)}
                    >
                      Comentario
                    </Button>
                  </Grid>
                  {/* Botón para cargar imagen */}
                  <Grid item>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id={`upload-button-${seccionIndex}-${preguntaIndex}`}
                      type="file"
                      onChange={(e) => handleFileChange(seccionIndex, preguntaIndex, e)}
                    />
                    <label htmlFor={`upload-button-${seccionIndex}-${preguntaIndex}`}>
                      <Button variant="outlined" component="span">
                        Cargar Foto
                      </Button>
                    </label>
                  </Grid>
                  {/* Mostrar la imagen subida */}
                  <Grid item>
                    {imagenes[seccionIndex]?.[preguntaIndex] && (
                      <img
                        src={URL.createObjectURL(imagenes[seccionIndex][preguntaIndex])}
                        alt={`Imagen de la pregunta ${preguntaIndex}`}
                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                      />
                    )}
                  </Grid>
                  {/* Mostrar el comentario asociado a esta pregunta */}
                  <Grid item>
                    <Typography>
                      {comentarios[seccionIndex]?.[preguntaIndex] || "Sin comentario"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}

      <Modal open={modalAbierto} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24 }}>
          <Typography variant="h6">Agregar Comentario</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={comentario}
            onChange={handleComentarioChange}
          />
          <Button onClick={handleGuardarComentario} variant="contained" color="primary" sx={{ mt: 2 }}>
            Guardar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default PreguntasYSeccion;
