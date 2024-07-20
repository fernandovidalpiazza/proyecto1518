import React from "react";
import { List, ListItem, ListItemText, Button, Divider } from "@mui/material";

const ListaDeSecciones = ({
  secciones,
  onSeleccionarSeccion,
  onEliminarSeccion,
  onAgregarPregunta,
  onSeleccionarPregunta,
  onEliminarPregunta,
}) => {
  return (
    <List>
      {secciones.map((seccion) => (
        <div key={seccion.id}>
          <ListItem>
            <ListItemText primary={seccion.nombre} />
            <Button onClick={() => onSeleccionarSeccion(seccion.id)}>Editar Sección</Button>
            <Button onClick={() => onEliminarSeccion(seccion.id)}>Eliminar Sección</Button>
            <Button onClick={() => onAgregarPregunta(seccion.id)}>Agregar Pregunta</Button>
          </ListItem>
          {seccion.preguntas.map((pregunta) => (
            <ListItem key={pregunta.id} sx={{ pl: 4 }}>
              <ListItemText primary={pregunta.texto} />
              <Button onClick={() => onSeleccionarPregunta(pregunta.id)}>Editar Pregunta</Button>
              <Button onClick={() => onEliminarPregunta(pregunta.id)}>Eliminar Pregunta</Button>
            </ListItem>
          ))}
          <Divider />
        </div>
      ))}
    </List>
  );
};

export default ListaDeSecciones;
