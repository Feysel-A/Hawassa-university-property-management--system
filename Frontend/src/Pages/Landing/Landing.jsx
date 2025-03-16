import React from "react";
import "@coreui/coreui/dist/css/coreui.min.css";
import Hero from "../../Components/Hero/Hero";
import img from "../../assets/img/hero.png"
const LandingPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Hero />
    </div>
  );
};

export default LandingPage;
