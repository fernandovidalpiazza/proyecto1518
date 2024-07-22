import React from 'react';
import { Container, Typography, Button, Grid, Paper } from '@mui/material';

const Home = () => {
  return (
    <Container
      sx={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <div
        sx={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Bienvenido a Nuestro Sistema de Auditoría
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Optimiza tus auditorías con nuestra plataforma profesional.
        </Typography>
        <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
          Comienza Ahora
        </Button>
      </div>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h4" component="h3" gutterBottom>
              Características
            </Typography>
            <Typography variant="body1" paragraph>
              Nuestro sistema te ofrece una variedad de características para gestionar auditorías de manera eficiente, incluyendo:
            </Typography>
            <Typography variant="body1" paragraph>
              - Gestión completa de formularios
            </Typography>
            <Typography variant="body1" paragraph>
              - Generación automática de informes en PDF
            </Typography>
            <Typography variant="body1" paragraph>
              - Funcionalidades para agregar, editar y eliminar secciones y preguntas
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h4" component="h3" gutterBottom>
              Cómo Funciona
            </Typography>
            <Typography variant="body1" paragraph>
              1. Selecciona un formulario para comenzar una auditoría.
            </Typography>
            <Typography variant="body1" paragraph>
              2. Agrega secciones y preguntas según tus necesidades.
            </Typography>
            <Typography variant="body1" paragraph>
              3. Completa el formulario y guarda tus respuestas.
            </Typography>
            <Typography variant="body1" paragraph>
              4. Genera un informe detallado y visualiza los resultados.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
