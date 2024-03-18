import React, { useState, useEffect } from "react";
import { Button, TextField, Grid, Typography, Box, MenuItem } from "@mui/material";
import { db } from "../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";

const SucursalForm = ({ agregarSucursal }) => {
  const [empresas, setEmpresas] = useState([]);
  const [sucursal, setSucursal] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    empresa: "", // Usar el nombre de la empresa como ID
  });

  useEffect(() => {
    const obtenerEmpresas = async () => {
      try {
        const empresasSnapshot = await getDocs(collection(db, "empresas"));
        const nombresEmpresas = [];
        empresasSnapshot.forEach((doc) => {
          nombresEmpresas.push(doc.data().nombre);
        });
        setEmpresas(nombresEmpresas);
      } catch (error) {
        console.error("Error al obtener nombres de empresas:", error);
      }
    };

    obtenerEmpresas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSucursal((prevSucursal) => ({
      ...prevSucursal,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarSucursal(sucursal);
    setSucursal({
      nombre: "",
      direccion: "",
      telefono: "",
      empresa: "", // Mantener el nombre de la empresa como ID
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Agregar Sucursal
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="nombre"
              name="nombre"
              label="Nombre de la Sucursal"
              fullWidth
              value={sucursal.nombre}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="direccion"
              name="direccion"
              label="Dirección"
              fullWidth
              value={sucursal.direccion}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="telefono"
              name="telefono"
              label="Teléfono"
              fullWidth
              value={sucursal.telefono}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="empresa"
              name="empresa"
              select
              label="Empresa"
              fullWidth
              value={sucursal.empresa}
              onChange={handleChange}
            >
              {empresas.map((empresa) => (
                <MenuItem key={empresa} value={empresa}>
                  {empresa}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary">
          Agregar
        </Button>
      </form>
    </Box>
  );
};

export default SucursalForm;
