import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Box,
  Modal,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import FormularioForm from "./FormularioForm"; // Asumiendo que tienes un componente para agregar/editar formularios

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const FormularioList = ({ formularios, setIsChange }) => {
  const [open, setOpen] = useState(false);
  const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);

  const deleteFormulario = async (id) => {
    try {
      await deleteDoc(doc(db, "formularios", id));
      setIsChange(true);
    } catch (error) {
      console.error("Error al eliminar formulario:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (formulario) => {
    setFormularioSeleccionado(formulario);
    setOpen(true);
  };

  return (
    <div>
      <Button variant="contained" onClick={() => handleOpen(null)}>
        Agregar nuevo
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Formulario</TableCell>
              <TableCell align="left">Sección</TableCell>
              <TableCell align="left">Pregunta</TableCell>
              <TableCell align="left">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formularios.map((formulario) => (
              <TableRow key={formulario.id}>
                <TableCell align="left">{formulario.nombre}</TableCell>
                <TableCell align="left">{formulario.seccion}</TableCell>
                <TableCell align="left">{formulario.pregunta}</TableCell>
                <TableCell align="left">
                  <IconButton onClick={() => handleOpen(formulario)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => deleteFormulario(formulario.id)}>
                    <DeleteForeverIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormularioForm
            handleClose={handleClose}
            setIsChange={setIsChange}
            formularioSeleccionado={formularioSeleccionado}
            setFormularioSeleccionado={setFormularioSeleccionado}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default FormularioList;
