// src/components/FirmaSection.jsx
import React from "react";
import Firma from "./Firma";
import { Grid } from "@mui/material";

const FirmaSection = () => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <Firma title="Firma del Auditor" />
    </Grid>
    <Grid item xs={12} md={6}>
      <Firma title="Firma del Responsable de la Empresa" />
    </Grid>
  </Grid>
);

export default FirmaSection;
