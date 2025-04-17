import React from 'react';
import { CButton } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import { Link } from 'react-router-dom';
const Hero = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 text-center">
      <h1 className="display-4 mb-4">Streamline Property Management at Hawassa University</h1>
      <p className="lead mb-4 text-dark">Track assets, manage requests, and ensure accountability with ease.</p>
      <Link to="/login"><CButton color="primary" size="lg" >
        Login to Get Started
      </CButton></Link>
    </div>
  );
};

export default Hero;