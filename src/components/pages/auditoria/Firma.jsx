import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import PropTypes from 'prop-types';
import './Firma.css';

const Firma = ({ title }) => {
  const sigCanvas = useRef({});

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  return (
    <div className="firma-container">
      <h2>{title}</h2>
      <SignatureCanvas
        ref={sigCanvas}
        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
      />
      <button onClick={clearSignature}>Clear</button>
    </div>
  );
};

Firma.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Firma;
