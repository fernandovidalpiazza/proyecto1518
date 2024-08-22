// EnvioMail.jsx
import React, { useState } from "react";
import emailjs from "emailjs-com";
import { Button, TextField, Typography, Box } from "@mui/material";
import { useRef } from "react";

const EnvioMail = ({ pdfBlob, handleClose }) => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Reporte de Auditoría");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const formRef = useRef();

  const handleSendEmail = (event) => {
    event.preventDefault();
    setSending(true);

    // Crear un objeto FormData y añadir el PDF como archivo
    const formData = new FormData();
    formData.append("pdf", pdfBlob, "reporte_auditoria.pdf");

    emailjs
      .sendForm("service_k2b91hi", "your_template_id", formRef.current, "your_user_id")
      .then(
        (result) => {
          alert("Correo enviado con éxito!");
          handleClose();
        },
        (error) => {
          alert("Error al enviar el correo: " + error.text);
        }
      )
      .finally(() => {
        setSending(false);
      });
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Enviar Reporte por Correo Electrónico
      </Typography>
      <form ref={formRef} onSubmit={handleSendEmail}>
        <TextField
          label="Correo Electrónico"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Asunto"
          type="text"
          fullWidth
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Mensaje"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={sending}
        >
          {sending ? "Enviando..." : "Enviar Correo"}
        </Button>
      </form>
    </Box>
  );
};

export default EnvioMail;
