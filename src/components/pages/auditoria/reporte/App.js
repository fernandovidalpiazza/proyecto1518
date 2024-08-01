import React from "react";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GenerarPdf = ({ targetRef }) => {
  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Auditoría de Higiene y Seguridad", 20, 10);

    const content = targetRef.current;
    doc.html(content, {
      callback: function (doc) {
        doc.save("reporte.pdf");
      },
      x: 10,
      y: 10,
    });
  };

  return (
    <Button variant="contained" color="primary" onClick={handleGeneratePdf}>
      Generar PDF
    </Button>
  );
};

export default GenerarPdf;
