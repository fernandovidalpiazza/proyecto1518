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
  Button,
} from "@mui/material";
import PreguntasYSeccion from "./PreguntasYSeccion";
import Reporte from "../auditoria/reporte";

const Auditoria = () => {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [sucursales, setSucursales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");
  const [formularios, setFormularios] = useState([]);
  const [formularioSeleccionadoId, setFormularioSeleccionadoId] = useState("");
  const [formularioSeleccionadoNombre, setFormularioSeleccionadoNombre] = useState("");
  const [secciones, setSecciones] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [mostrarReporte, setMostrarReporte] = useState(false);

  useEffect(() => {
    const obtenerEmpresas = async () => {
      const empresasCollection = collection(db, "empresas");
      const snapshot = await getDocs(empresasCollection);
      const empresasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre,
      }));
      setEmpresas(empresasData);
    };

    obtenerEmpresas();
  }, []);

  useEffect(() => {
    const obtenerSucursales = async () => {
      if (empresaSeleccionada) {
        const sucursalesCollection = collection(db, "sucursales");
        const q = query(sucursalesCollection, where("empresa", "==", empresaSeleccionada));
        const snapshot = await getDocs(q);
        const sucursalesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
        }));
        setSucursales(sucursalesData);
      } else {
        setSucursales([]);
      }
    };

    obtenerSucursales();
  }, [empresaSeleccionada]);

  const handleEmpresaChange = (e) => {
    setEmpresaSeleccionada(e.target.value);
    setSucursalSeleccionada("");
  };

  const handleSucursalChange = (e) => {
    setSucursalSeleccionada(e.target.value);
  };

  useEffect(() => {
    const obtenerFormularios = async () => {
      const formulariosCollection = collection(db, "formularios");
      const snapshot = await getDocs(formulariosCollection);
      const formulariosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre,
        secciones: doc.data().secciones,
      }));
      setFormularios(formulariosData);
    };

    obtenerFormularios();
  }, []);

  const handleSeleccionarFormulario = (e) => {
    const idFormularioSeleccionado = e.target.value;
    const formularioSeleccionado = formularios.find((formulario) => formulario.id === idFormularioSeleccionado);

    if (!formularioSeleccionado || !formularioSeleccionado.secciones) {
      console.error("El formulario seleccionado no tiene secciones válidas:", formularioSeleccionado);
      setSecciones([]);
      setRespuestas([]);
      setComentarios([]);
      return;
    }

    const seccionesArray = Array.isArray(formularioSeleccionado.secciones)
      ? formularioSeleccionado.secciones
      : Object.values(formularioSeleccionado.secciones);

    setFormularioSeleccionadoId(idFormularioSeleccionado);
    setFormularioSeleccionadoNombre(formularioSeleccionado.nombre);
    setSecciones(seccionesArray);
    setRespuestas(seccionesArray.map(seccion => Array(seccion.preguntas.length).fill('')));
    setComentarios(seccionesArray.map(seccion => Array(seccion.preguntas.length).fill('')));
  };

  const handleGuardarRespuestas = (nuevasRespuestas) => {
    setRespuestas(nuevasRespuestas);
  };

  const handleGuardarComentario = (comentario, seccionIndex, preguntaIndex) => {
    const nuevasRespuestas = [...respuestas];

    // Asegurarse de que nuevasRespuestas[seccionIndex] existe
    if (!nuevasRespuestas[seccionIndex]) {
      nuevasRespuestas[seccionIndex] = [];
    }

    nuevasRespuestas[seccionIndex][preguntaIndex] = comentario;
    setRespuestas(nuevasRespuestas);
  };

  const generarReporte = () => {
    setMostrarReporte(true);
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
              <Select value={sucursalSeleccionada} onChange={handleSucursalChange}>
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

      {formularioSeleccionadoId && (
        <PreguntasYSeccion
          secciones={secciones}
          guardarRespuestas={handleGuardarRespuestas}
          guardarComentario={handleGuardarComentario}
        />
      )}

      <Button variant="contained" color="primary" onClick={generarReporte} disabled={!formularioSeleccionadoId}>
        Generar Reporte
      </Button>

      {mostrarReporte && (
        <Reporte 
          empresa={empresaSeleccionada} 
          sucursal={sucursalSeleccionada} 
          respuestas={respuestas} 
          secciones={secciones} 
        />
      )}
    </div>
  );
};

export default Auditoria;
