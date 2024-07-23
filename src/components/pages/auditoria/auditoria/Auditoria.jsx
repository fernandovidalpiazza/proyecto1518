import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import SeleccionEmpresa from "./SeleccionEmpresa";
import SeleccionSucursal from "./SeleccionSucursal";
import SeleccionFormulario from "./SeleccionFormulario";
import PreguntasYSeccion from "../../auditoria/PreguntasYSeccion";
import Reporte from "./../reporte/reporte";
import BotonGenerarReporte from "./BotonGenerarReporte";
import { Typography, Grid, Alert } from "@mui/material";

const Auditoria = () => {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");
  const [formularioSeleccionadoId, setFormularioSeleccionadoId] = useState("");
  const [secciones, setSecciones] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [errores, setErrores] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [formularios, setFormularios] = useState([]);

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

  const handleEmpresaChange = (e) => {
    setEmpresaSeleccionada(e.target.value);
    setSucursalSeleccionada("");
  };

  const handleSucursalChange = (e) => {
    setSucursalSeleccionada(e.target.value);
  };

  const handleSeleccionarFormulario = (e) => {
    const idFormularioSeleccionado = e.target.value;
    const formularioSeleccionado = formularios.find((formulario) => formulario.id === idFormularioSeleccionado);

    if (!formularioSeleccionado || !formularioSeleccionado.secciones) {
      setSecciones([]);
      setRespuestas([]);
      setComentarios([]);
      return;
    }

    const seccionesArray = Array.isArray(formularioSeleccionado.secciones)
      ? formularioSeleccionado.secciones
      : Object.values(formularioSeleccionado.secciones);

    setFormularioSeleccionadoId(idFormularioSeleccionado);
    setSecciones(seccionesArray);
    setRespuestas(seccionesArray.map(seccion => Array(seccion.preguntas.length).fill('')));
    setComentarios(seccionesArray.map(seccion => Array(seccion.preguntas.length).fill('')));
    setImagenes(seccionesArray.map(seccion => Array(seccion.preguntas.length).fill(null)));
  };

  const handleGuardarRespuestas = (nuevasRespuestas) => {
    setRespuestas(nuevasRespuestas);
  };

  const handleGuardarComentario = (nuevosComentarios) => {
    setComentarios(nuevosComentarios);
  };

  const handleGuardarImagenes = (nuevasImagenes) => {
    setImagenes(nuevasImagenes);
  };

  const todasLasPreguntasContestadas = () => {
    return respuestas.every(seccionRespuestas => 
      seccionRespuestas.every(respuesta => respuesta !== '')
    );
  };

  const generarReporte = () => {
    if (todasLasPreguntasContestadas()) {
      setMostrarReporte(true);
      setErrores([]); // Clear errors if generating report
    } else {
      setErrores(["Por favor, responda todas las preguntas antes de generar el reporte."]);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Seleccionar Empresa y Sucursal
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <SeleccionEmpresa
            empresas={empresas}
            empresaSeleccionada={empresaSeleccionada}
            onChange={handleEmpresaChange}
          />
        </Grid>
        {empresaSeleccionada && (
          <Grid item xs={12} sm={6}>
            <SeleccionSucursal
              sucursales={sucursales}
              sucursalSeleccionada={sucursalSeleccionada}
              onChange={handleSucursalChange}
            />
          </Grid>
        )}
      </Grid>

      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} sm={6}>
          <SeleccionFormulario
            formularios={formularios}
            formularioSeleccionadoId={formularioSeleccionadoId}
            onChange={handleSeleccionarFormulario}
          />
        </Grid>
      </Grid>

      {formularioSeleccionadoId && (
        <PreguntasYSeccion
          secciones={secciones}
          guardarRespuestas={handleGuardarRespuestas}
          guardarComentario={handleGuardarComentario}
          guardarImagenes={handleGuardarImagenes}
        />
      )}

      <BotonGenerarReporte
        onClick={generarReporte}
        deshabilitado={!todasLasPreguntasContestadas()}
      />

      {errores.length > 0 && (
        <Alert severity="error">
          {errores.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}

      {mostrarReporte && (
        <Reporte 
          empresa={empresaSeleccionada} 
          sucursal={sucursalSeleccionada} 
          respuestas={respuestas} 
          comentarios={comentarios}
          imagenes={imagenes}
          secciones={secciones} 
        />
      )}
    </div>
  );
};

export default Auditoria;
