import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, CardContent, Grid, IconButton, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { db, storage } from "../../../firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AddEmpresaModal from "./AddEmpresaModal";
import EliminarEmpresa from "./EliminarEmpresa";
import Swal from 'sweetalert2';

const EstablecimientosContainer = () => {
  const [empresas, setEmpresas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [empresa, setEmpresa] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    logo: null
  });
  const [loading, setLoading] = useState(false);

  const obtenerEmpresas = useCallback(async () => {
    try {
      const refCollection = collection(db, "empresas");
      const querySnapshot = await getDocs(refCollection);
      const newArray = querySnapshot.docs.map((empresa) => ({
        ...empresa.data(),
        id: empresa.id,
      }));
      setEmpresas(newArray);
    } catch (error) {
      console.error("Error al obtener empresas:", error);
    }
  }, []);

  useEffect(() => {
    obtenerEmpresas();
  }, [obtenerEmpresas]);

  const handleCloseModal = () => {
    setOpenModal(false);
    obtenerEmpresas(); // Actualiza la lista de empresas después de cerrar el modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresa((prevEmpresa) => ({
      ...prevEmpresa,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    setEmpresa((prevEmpresa) => ({
      ...prevEmpresa,
      logo: e.target.files[0]
    }));
  };

  const handleAddEmpresa = async () => {
    setLoading(true);
    try {
      let logoURL = "";
      if (empresa.logo) {
        // Cargar la imagen al almacenamiento de Firebase
        const logoRef = ref(storage, `logos/${empresa.logo.name}`);
        const snapshot = await uploadBytes(logoRef, empresa.logo);
        logoURL = await getDownloadURL(snapshot.ref);
      }

      // Crear el documento de la empresa
      const empresaData = {
        nombre: empresa.nombre,
        direccion: empresa.direccion,
        telefono: empresa.telefono,
        logo: logoURL
      };
      
      await addDoc(collection(db, "empresas"), empresaData);

      Swal.fire({
        icon: 'success',
        title: 'Empresa Agregada',
        text: 'La empresa ha sido agregada con éxito.',
      });

      handleCloseModal();
    } catch (error) {
      console.error("Error al agregar empresa:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al agregar la empresa.',
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminarEmpresa = () => {
    obtenerEmpresas(); // Actualiza la lista de empresas después de eliminar una
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        sx={{ marginBottom: 2 }}
      >
        Agregar Empresa
      </Button>
      <Box sx={{ marginTop: { xs: 8, sm: 10 }, marginLeft: 2 }}>
        <Typography variant="h4">Empresas:</Typography>
      </Box>
      <Grid container spacing={2} sx={{ marginTop: 4 }}>
        {empresas.map((empresa) => (
          <Grid size={{ xs: 8, sm: 4, md: 3 }} key={empresa.id}>
            <Card>
              <CardContent>
                {empresa.logo && empresa.logo.trim() !== "" ? (
                  <img
                    src={empresa.logo}
                    alt="Logo de la empresa"
                    style={{ width: "100%", height: "auto", marginBottom: 2 }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "120px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "4px",
                      marginBottom: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      color: "#666",
                      border: "2px dashed #ccc"
                    }}
                  >
                    {empresa.nombre.charAt(0).toUpperCase()}
                  </Box>
                )}
                <Typography variant="h6" gutterBottom>
                  Nombre de la empresa: {empresa.nombre}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Dirección: {empresa.direccion}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Teléfono: {empresa.telefono}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  <Link to="/sucursales" style={{ textDecoration: "none" }}>
                    <Button variant="contained" color="primary">
                      Agregar sucursal
                    </Button>
                  </Link>
                  <EliminarEmpresa
                    empresaId={empresa.id}
                    eliminarEmpresa={eliminarEmpresa}
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {openModal && (
        <AddEmpresaModal
          open={openModal}
          handleClose={handleCloseModal}
          handleAddEmpresa={handleAddEmpresa}
          empresa={empresa}
          handleInputChange={handleInputChange}
          handleLogoChange={handleLogoChange}
          loading={loading}
        />
      )}
    </div>
  );
};

export default EstablecimientosContainer;
