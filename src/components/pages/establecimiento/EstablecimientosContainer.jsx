import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

const EstablecimientosContainer = () => {
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    const obtenerEmpresas = async () => {
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
    };

    obtenerEmpresas();
  }, []);

  return (
    <div>
      <div style={{ position: "relative", marginRight: 1, marginTop: 16 }}>
        <Link to="/">
          <Button variant="contained" color="primary">
            Agregar empresa
          </Button>
        </Link>
      </div>
      <Box sx={{ marginTop: { xs: 8, sm: 10 }, marginLeft: 2 }}>
        <Typography variant="h4">Empresas:</Typography>
      </Box>

      <Grid container spacing={2} sx={{ marginTop: 4 }}>
        {empresas.map((empresa) => (
          <Grid item xs={8} sm={4} md={3} key={empresa.id}>
            <Card>
              <CardContent>
                <img
                  src={empresa.logo}
                  alt="Logo de la empresa"
                  style={{ width: "100%", height: "auto", marginBottom: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Nombre de la empresa: {empresa.nombre}
                  
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Dirección: {empresa.direccion}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Número: {empresa.numero}
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
                  <IconButton color="error" aria-label="Eliminar empresa">
                    <DeleteIcon />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EstablecimientosContainer;
