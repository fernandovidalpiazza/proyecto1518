import React, { useState } from 'react';
import { Box, Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { onSignIn } from '../../../firebaseConfig';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Correo electrónico inválido').required('Ingresa el correo electronico'),
    password: Yup.string().required('Ingresa la Contraseña')
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setLoading(true);
    try {
      await onSignIn(values);
      navigate("/");
    } catch (error) {
      console.error(error); // Muestra el error en la consola
      setErrors({ password: 'Correo electrónico o contraseña incorrectos' });
    }
    setLoading(false);
    setSubmitting(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid
              container
              rowSpacing={2}
              justifyContent={'center'}
            >
              <Grid item xs={10} md={12}>
                <Field as={TextField} name="email" label="Correo Electrónico" fullWidth disabled={isSubmitting || loading} />
                <ErrorMessage name="email" component="div" />
              </Grid>
              <Grid item xs={10} md={12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="outlined-adornment-password">
                    Contraseña
                  </InputLabel>
                  <Field
                    as={OutlinedInput}
                    name="password"
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff color="primary" />
                          ) : (
                            <Visibility color="primary" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Contraseña"
                    disabled={isSubmitting || loading}
                  />
                </FormControl>
                <ErrorMessage name="password" component="div" />
              </Grid>
              <Link
                to="/forgot-password"
                style={{ color: 'steelblue', marginTop: '10px' }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <Grid container justifyContent="center" spacing={3} mt={2}>
                <Grid item xs={10} md={5}>
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={isSubmitting || loading}
                    sx={{
                      color: 'white',
                      textTransform: 'none',
                      textShadow: '2px 2px 2px grey',
                    }}
                  >
                    {loading ? 'Cargando...' : 'Ingresar'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
