import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import SeleccionEmpresa from "./SeleccionEmpresa";
import SeleccionSucursal from "./SeleccionSucursal";
import SeleccionFormulario from "./SeleccionFormulario";
import PreguntasYSeccion from "../../auditoria/PreguntasYSeccion";
import Reporte from "./../reporte/reporte";
import BotonGenerarReporte from "./BotonGenerarReporte";
import { Typography, Grid, Alert, Box, Button } from "@mui/material";

const Auditoria = () => {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
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
  const [auditoriaGenerada, setAuditoriaGenerada] = useState(false);

  useEffect(() => {
    const obtenerEmpresas = async () => {
      try {
        const empresasCollection = collection(db, "empresas");
        const snapshot = await getDocs(empresasCollection);
        const empresasData = snapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
          logo: doc.data().logo,
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
          const q = query(sucursalesCollection, where("empresa", "==", empresaSeleccionada.nombre));
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

  useEffect(() => {
    if (formularioSeleccionadoId) {
      const formularioSeleccionado = formularios.find((formulario) => formulario.id === formularioSeleccionadoId);
      
      if (!formularioSeleccionado || !formularioSeleccionado.secciones) {
        setSecciones([]);
        setRespuestas([]);
        setComentarios([]);
        setImagenes([]);
        return;
      }

      const seccionesArray = Array.isArray(formularioSeleccionado.secciones)
        ? formularioSeleccionado.secciones
        : Object.values(formularioSeleccionado.secciones);

      setSecciones(seccionesArray);
      setRespuestas(seccionesArray.map(seccion => Array(seccion.preguntas.length).fill('')));
      setComentarios(seccionesArray.map(seccion => Array(seccion.preguntas.length).fill('')));
      setImagenes(seccionesArray.map(seccion => Array(seccion.preguntas.length).fill(null)));
    }
  }, [formularioSeleccionadoId, formularios]);

  useEffect(() => {
    if (empresaSeleccionada) {
      setSucursalSeleccionada("");
    }
  }, [empresaSeleccionada]);

  const handleEmpresaChange = (selectedEmpresa) => {
    setEmpresaSeleccionada(selectedEmpresa);
    setSucursalSeleccionada(""); // Reset sucursal when empresa changes
    setFormularioSeleccionadoId(""); // Reset formulario when empresa changes
  };

  const handleSucursalChange = (e) => {
    setSucursalSeleccionada(e.target.value);
  };

  const handleSeleccionarFormulario = (e) => {
    setFormularioSeleccionadoId(e.target.value);
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
      setAuditoriaGenerada(true); // Mark as auditoria generada
    } else {
      setErrores(["Por favor, responda todas las preguntas antes de generar el reporte."]);
    }
  };

  const generarNuevaAuditoria = () => {
    setEmpresaSeleccionada(null);
    setSucursalSeleccionada("");
    setFormularioSeleccionadoId("");
    setSecciones([]);
    setRespuestas([]);
    setComentarios([]);
    setImagenes([]);
    setMostrarReporte(false);
    setAuditoriaGenerada(false);
  };

  return (
    <div>
      {!auditoriaGenerada ? (
        <>
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

          {empresaSeleccionada && (
            <Box mt={2} display="flex" alignItems="center">
              <Typography variant="h6" mr={2}>Logo de la empresa seleccionada:</Typography>
              <img
                src={empresaSeleccionada.logo}
                alt={`Logo de ${empresaSeleccionada.nombre}`}
                style={{ width: "100px", height: "auto" }}
              />
            </Box>
          )}

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
        </>
      ) : (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" gutterBottom>
            Auditoría Generada
          </Typography>
          <Button variant="contained" color="primary" onClick={generarNuevaAuditoria}>
            Generar Nueva Auditoría
          </Button>
        </Box>
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
