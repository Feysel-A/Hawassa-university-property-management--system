import React from "react";
import { CButton } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import "../../assets/css/LandingStyles.css";
const Hero = () => {
  return (
    <div className="hero-section">
      <div className="hero-text">
        <h1>Streamline Property Management at Hawassa University</h1>
        <p>
          Efficiently track assets, manage requests, and ensure accountability.
        </p>
        <CButton href="/login" color="success" size="lg">
          Login to Get Started
        </CButton>
      </div>
      <div className="hero-image" />
    </div>
  );
};

export default Hero;
