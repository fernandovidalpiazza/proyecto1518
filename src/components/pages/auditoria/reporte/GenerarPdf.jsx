import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';

const GenerarPdf = ({ targetRef }) => {
  const handleGeneratePdf = async () => {
    const element = targetRef.current;

    // Estilo para ocultar el botón en el PDF
    const originalStyle = element.style.display;
    const button = element.querySelector(".pdf-button-container");

    if (button) {
      button.style.display = 'none';
    }

    const canvas = await html2canvas(element, {
      scale: 2, // Mejora la calidad de la imagen
      useCORS: true // Permite cargar imágenes desde otros dominios
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Dimensiones de la página en mm
    const pageWidth = 210;
    const pageHeight = 297;

    // Calcular las dimensiones de la imagen en el PDF
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Altura proporcionalmente

    let heightLeft = imgHeight;
    let position = 0;

    // Agregar la primera página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Agregar las páginas adicionales si es necesario
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Restaurar el estilo original del botón
    if (button) {
      button.style.display = originalStyle;
    }

    // Guardar el PDF
    pdf.save('reporte.pdf');
  };

  return (
    <div className="pdf-button-container">
      <Button variant="contained" color="primary" onClick={handleGeneratePdf}>
        Generar PDF
      </Button>
    </div>
  );
};

export default GenerarPdf;
