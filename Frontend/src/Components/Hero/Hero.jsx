import React from 'react';
import { CButton } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';

const Hero = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 text-center">
      <h1 className="display-4 mb-4">Streamline Property Management at Hawassa University</h1>
      <p className="lead mb-4">Track assets, manage requests, and ensure accountability with ease.</p>
      <CButton color="primary" size="lg" href="/login">
        Login to Get Started
      </CButton>
    </div>
  );
};

export default Hero;