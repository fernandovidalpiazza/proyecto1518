import React, { useState } from "react";
import { Button, Modal, TextField } from "@mui/material";

const SeccionesYPreguntas = ({ secciones, handleBorrarPregunta, handleAbrirModalEditar }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [seccionIndex, setSeccionIndex] = useState(null);
  const [preguntaIndex, setPreguntaIndex] = useState(null);
  const [preguntaActual, setPreguntaActual] = useState("");

  const handleOpenModal = (seccionIndex, preguntaIndex, pregunta) => {
    setSeccionIndex(seccionIndex);
    setPreguntaIndex(preguntaIndex);
    setPreguntaActual(pregunta);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleGuardarCambios = () => {
    // Aquí puedes implementar la lógica para guardar los cambios en la pregunta
    // Puedes acceder a la pregunta actual con la variable preguntaActual
    // y a los índices de sección y pregunta con seccionIndex y preguntaIndex respectivamente
    console.log("Guardando cambios en la pregunta:", preguntaActual);
    handleCloseModal();
  };

  return (
    <div>
      <h3>Secciones y Preguntas</h3>
      {secciones.map((seccion, seccionIndex) => (
        <div key={seccionIndex}>
          <h4>
            Sección {seccionIndex + 1}: {seccion.nombre}
          </h4>
          <table>
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {seccion.preguntas.map((pregunta, preguntaIndex) => (
                <tr key={preguntaIndex}>
                  <td>{pregunta}</td>
                  <td>
                    <Button onClick={() => handleBorrarPregunta(seccionIndex, preguntaIndex)}>Borrar</Button>
                    <Button onClick={() => handleOpenModal(seccionIndex, preguntaIndex, pregunta)}>Editar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      
      {/* Modal para editar pregunta */}
      <Modal open={modalOpen} onClose={handleCloseModal} aria-labelledby="modal-title" aria-describedby="modal-description">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 16,
            maxWidth: 400,
            width: '100%'
          }}>
            <h2 id="modal-title">Editar Pregunta</h2>
            <TextField
              id="pregunta-actual"
              label="Pregunta Actual"
              variant="outlined"
              fullWidth
              value={preguntaActual}
              disabled
              style={{ marginBottom: 16 }}
            />
            {/* Aquí puedes agregar los campos para editar la pregunta si es necesario */}
            <Button onClick={handleGuardarCambios}>Guardar Cambios</Button>
            <Button onClick={handleCloseModal}>Cerrar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SeccionesYPreguntas;
