import React from "react";
import "@coreui/coreui/dist/css/coreui.min.css";
import Hero from "../../Components/Hero/Hero";
import Announcements from "../../Components/Announcements/Announcements"; // Import Announcements
import img from "../../assets/img/hero-two.jpg";

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
        justifyContent: "center",
        color: "white",
        alignItems: "center",
        paddingTop: "50px",
      }}
    >
      <Announcements />
      <Hero />
    </div>
  );
};

export default LandingPage;
