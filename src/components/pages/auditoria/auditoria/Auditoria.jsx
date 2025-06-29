import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import SeleccionEmpresa from "./SeleccionEmpresa";
import SeleccionSucursal from "./SeleccionSucursal";
import SeleccionFormulario from "./SeleccionFormulario";
import PreguntasYSeccion from "./PreguntasYSeccion";
import Reporte from "./Reporte";
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

  // Efecto para manejar automáticamente la sucursal cuando no hay sucursales
  useEffect(() => {
    if (empresaSeleccionada && sucursales.length === 0) {
      // Si no hay sucursales, establecer un valor por defecto
      setSucursalSeleccionada("Sin sucursal específica");
    } else if (empresaSeleccionada && sucursales.length > 0 && sucursalSeleccionada === "Sin sucursal específica") {
      // Si ahora hay sucursales pero estaba el valor por defecto, resetear
      setSucursalSeleccionada("");
    }
  }, [empresaSeleccionada, sucursales.length, sucursalSeleccionada]);

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

  // Función para verificar si se puede continuar con la auditoría
  const puedeContinuarConAuditoria = () => {
    // Siempre se puede continuar si hay una empresa seleccionada
    // La sucursal es opcional - puede ser casa central o una sucursal específica
    return empresaSeleccionada !== null;
  };

  // Función para obtener el tipo de ubicación
  const obtenerTipoUbicacion = () => {
    if (!empresaSeleccionada) return "";
    
    if (sucursales.length === 0) {
      return "Casa Central";
    }
    
    if (sucursalSeleccionada && sucursalSeleccionada !== "Sin sucursal específica") {
      return `Sucursal: ${sucursalSeleccionada}`;
    }
    
    return "Casa Central";
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
            Seleccionar Empresa y Ubicación
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SeleccionEmpresa
                empresas={empresas}
                empresaSeleccionada={empresaSeleccionada}
                onChange={handleEmpresaChange}
              />
            </Grid>
            {empresaSeleccionada && (
              <Grid size={{ xs: 12, sm: 6 }}>
                {sucursales.length > 0 ? (
                  <SeleccionSucursal
                    sucursales={sucursales}
                    sucursalSeleccionada={sucursalSeleccionada}
                    onChange={handleSucursalChange}
                  />
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    <Typography variant="body1" color="textSecondary">
                      <strong>Ubicación:</strong> Casa Central
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Esta empresa no tiene sucursales registradas. 
                      La auditoría se realizará en casa central.
                    </Typography>
                  </Box>
                )}
              </Grid>
            )}
          </Grid>

          {empresaSeleccionada && (
            <Box mt={2} display="flex" alignItems="center">
              <Typography variant="h6" mr={2}>Logo de la empresa seleccionada:</Typography>
              {empresaSeleccionada.logo && empresaSeleccionada.logo.trim() !== "" ? (
                <img
                  src={empresaSeleccionada.logo}
                  alt={`Logo de ${empresaSeleccionada.nombre}`}
                  style={{ width: "100px", height: "auto" }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    color: "#666",
                    border: "2px dashed #ccc"
                  }}
                >
                  {empresaSeleccionada.nombre.charAt(0).toUpperCase()}
                </Box>
              )}
            </Box>
          )}

          {empresaSeleccionada && sucursales.length > 0 && (
            <Box mt={2}>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Opciones disponibles:</strong>
                </Typography>
                <Typography variant="body2">
                  • Seleccione una sucursal específica para auditar esa ubicación
                </Typography>
                <Typography variant="body2">
                  • Deje vacío para auditar casa central
                </Typography>
              </Alert>
            </Box>
          )}

          {empresaSeleccionada && (
            <Box mt={2}>
              <Alert severity="success">
                <Typography variant="body2">
                  <strong>Ubicación seleccionada:</strong> {obtenerTipoUbicacion()}
                </Typography>
              </Alert>
            </Box>
          )}

          <Grid container spacing={2} marginTop={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SeleccionFormulario
                formularios={formularios}
                formularioSeleccionadoId={formularioSeleccionadoId}
                onChange={handleSeleccionarFormulario}
                disabled={!empresaSeleccionada}
              />
            </Grid>
          </Grid>

          {!empresaSeleccionada && (
            <Box mt={2}>
              <Alert severity="info">
                Por favor, seleccione una empresa para continuar con la auditoría.
              </Alert>
            </Box>
          )}

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
            empresa={empresaSeleccionada}
            sucursal={sucursalSeleccionada}
            formulario={formularios.find(formulario => formulario.id === formularioSeleccionadoId)}
            respuestas={respuestas}
            comentarios={comentarios}
            imagenes={imagenes}
            secciones={secciones}
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
          formulario={formularios.find(formulario => formulario.id === formularioSeleccionadoId)} // Pass the full formulario object
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
