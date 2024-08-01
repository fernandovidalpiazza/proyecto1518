import React from "react";
import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";

const ImagenesTable = ({ secciones, imagenes }) => {
  if (!Array.isArray(imagenes) || imagenes.length === 0) {
    return <Typography>No hay imágenes disponibles.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sección</TableCell>
            <TableCell>Pregunta</TableCell>
            <TableCell>Imagen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {imagenes.map((imagenUrl, index) => (
            <TableRow key={index}>
              <TableCell>{secciones[index]?.nombre ?? "Nombre de sección no disponible"}</TableCell>
               <TableCell>{respuestas[sectionIndex]?.[preguntaIndex] || "No disponible"}</TableCell>
              <TableCell>
                <Box>
                  <img src={imagenUrl} alt={`Imagen ${index}`} style={{ width: '100px', height: 'auto' }} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ImagenesTable.propTypes = {
  secciones: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string, // Cambiado a no requerido
    })
  ).isRequired,
  imagenes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ImagenesTable;
