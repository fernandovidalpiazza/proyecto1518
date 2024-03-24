import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import PreguntasYSeccion from "./PreguntasYSeccion";

const Auditoria = () => {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [sucursales, setSucursales] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [formularioSeleccionadoId, setFormularioSeleccionadoId] = useState("");
  const [formularioSeleccionadoNombre, setFormularioSeleccionadoNombre] = useState("");
  const [secciones, setSecciones] = useState([]);

  useEffect(() => {
    const obtenerEmpresas = async () => {
      try {
        const empresasCollection = collection(db, "empresas");
        const snapshot = await getDocs(empresasCollection);
        const empresasData = snapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
        }));
        setEmpresas(empresasData);
      } catch (error) {
        console.error("Error al obtener empresas:", error);
      }
    };

    obtenerEmpresas();
  }, []);

  useEffect(() => {
    const obtenerSucursales = async () => {
      if (empresaSeleccionada) {
        try {
          const sucursalesCollection = collection(db, "sucursales");
          const q = query(sucursalesCollection, where("empresa", "==", empresaSeleccionada));
          const snapshot = await getDocs(q);
          const sucursalesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre,
          }));
          setSucursales(sucursalesData);
        } catch (error) {
          console.error("Error al obtener sucursales:", error);
        }
      } else {
        setSucursales([]);
      }
    };

    obtenerSucursales();
  }, [empresaSeleccionada]);

  const handleEmpresaChange = (e) => {
    setEmpresaSeleccionada(e.target.value);
  };

  useEffect(() => {
    const obtenerFormularios = async () => {
      try {
        const formulariosCollection = collection(db, "formularios");
        const snapshot = await getDocs(formulariosCollection);
        const formulariosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
          secciones: doc.data().secciones,
        }));
        setFormularios(formulariosData);
      } catch (error) {
        console.error("Error al obtener formularios:", error);
      }
    };

    obtenerFormularios();
  }, []);

  const handleSeleccionarFormulario = (e) => {
    const idFormularioSeleccionado = e.target.value;
    const formularioSeleccionado = formularios.find((formulario) => formulario.id === idFormularioSeleccionado);
    setFormularioSeleccionadoId(idFormularioSeleccionado);
    setFormularioSeleccionadoNombre(formularioSeleccionado.nombre);
    setSecciones(formularioSeleccionado.secciones);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Seleccionar Empresa y Sucursal
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Empresa</InputLabel>
            <Select value={empresaSeleccionada} onChange={handleEmpresaChange}>
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
        {empresaSeleccionada && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sucursal</InputLabel>
              <Select>
                <MenuItem value="">
                  <em>Seleccione una sucursal</em>
                </MenuItem>
                {sucursales.map((sucursal) => (
                  <MenuItem key={sucursal.id} value={sucursal.nombre}>
                    {sucursal.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Formulario</InputLabel>
            <Select value={formularioSeleccionadoId} onChange={handleSeleccionarFormulario}>
              <MenuItem value="">
                <em>Seleccione un formulario</em>
              </MenuItem>
              {formularios.map((formulario) => (
                <MenuItem key={formulario.id} value={formulario.id}>
                  {formulario.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {formularioSeleccionadoId && <PreguntasYSeccion secciones={secciones} />}
    </div>
    
  );
};

export default Auditoria;
