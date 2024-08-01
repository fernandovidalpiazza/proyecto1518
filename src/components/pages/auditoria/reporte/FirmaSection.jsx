import React, { useState } from "react";
import Firma from "./Firma";
import { Grid, Box } from "@mui/material";

const FirmaSection = ({ onSaveSignature }) => {
  const [firmaURL, setFirmaURL] = useState(null);

  const handleSaveSignature = (url) => {
    setFirmaURL(url);
    if (onSaveSignature) {
      onSaveSignature(url);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Box mb={2}>
          <Firma title="Firma del Auditor" setFirmaURL={handleSaveSignature} />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box mb={2}>
          <Firma title="Firma del Responsable de la Empresa" setFirmaURL={handleSaveSignature} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default FirmaSection;
