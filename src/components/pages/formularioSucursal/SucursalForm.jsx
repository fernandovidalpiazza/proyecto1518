import React, { useState, useEffect } from "react";
import { Button, TextField, Grid, Typography, Box, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
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
        const empresasData = [];
        empresasSnapshot.forEach((doc) => {
          empresasData.push({
            id: doc.id,
            nombre: doc.data().nombre
          });
        });
        setEmpresas(empresasData);
      } catch (error) {
        console.error("Error al obtener empresas:", error);
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
      empresa: "",
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Agregar Sucursal
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="nombre"
              label="Nombre de la Sucursal"
              fullWidth
              value={sucursal.nombre}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="direccion"
              label="Dirección"
              fullWidth
              value={sucursal.direccion}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="telefono"
              label="Teléfono"
              fullWidth
              value={sucursal.telefono}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Empresa</InputLabel>
              <Select
                name="empresa"
                value={sucursal.empresa}
                onChange={handleChange}
                label="Empresa"
              >
                <MenuItem value="">
                  <em>Seleccione una empresa</em>
                </MenuItem>
                {empresas.map((empresa) => (
                  <MenuItem key={empresa.id} value={empresa.nombre}>
                    {empresa.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Agregar Sucursal
        </Button>
      </form>
    </Box>
  );
};

export default SucursalForm;
