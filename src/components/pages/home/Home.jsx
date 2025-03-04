import React from 'react';
import { Container, Typography, Button, Grid, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container
      sx={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <Box sx={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Bienvenido a Nuestro Sistema de Auditoría
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Optimiza tus auditorías con nuestra plataforma profesional.
        </Typography>
        
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Características
            </Typography>
            <ul style={{ textAlign: 'left' }}>
              <li>Gestión completa de formularios</li>
              <li>Generación automática de informes en PDF</li>
              <li>Funcionalidades para agregar, editar y eliminar secciones y preguntas</li>
            </ul>
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
            <Typography variant="h4" gutterBottom>
              Cómo Funciona
            </Typography>
            <ol style={{ textAlign: 'left' }}>
              <li>Selecciona un formulario para comenzar una auditoría.</li>
              <li>Agrega secciones y preguntas según tus necesidades.</li>
              <li>Completa el formulario y guarda tus respuestas.</li>
              <li>Genera un informe detallado y visualiza los resultados.</li>
            </ol>
          </Paper>
        </Grid>
      </Grid>

      <Box
        sx={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#282c34',
          color: 'white',
        }}
      >
        <Typography variant="body2">
          Contacto: licvidalfernando@gmail.com
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
