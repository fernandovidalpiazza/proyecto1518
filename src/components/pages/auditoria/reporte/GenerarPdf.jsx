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
      scale: 2, // Mejora la calidad de imagen
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Calcular las dimensiones de la imagen en el PDF
    const imgWidth = 210; // Ancho de A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Altura proporcionalmente
    const pdfHeight = 297; // Altura de A4 en mm

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= 297;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Restaurar el estilo original del botón
    if (button) {
      button.style.display = originalStyle;
    }

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
