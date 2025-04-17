import React from "react";
import { CButton, CContainer, CRow, CCol } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import logo from "../../assets/img/hu-logo-2.png";
import "../../assets/css/LandingStyles.css";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className="header-section">
      <CContainer>
        <CRow className="align-items-center">
          <CCol xs="10">
            {/* Replace with <img src={logo} alt="HU Logo" className="header-logo" /> */}
            <Link to="/">
              {" "}
              <img src={logo} alt="HU Logo" className="header-logo" />{" "}
            </Link>
          </CCol>
          <CCol xs="2" className="text-right">
            <Link to="/login">
              {" "}
              <CButton
                color="primary"
                style={{
                  backgroundColor: "#d9534f",
                  margin: "10px 15px",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  transition: "background-color 0.2s ease",
                }}
              >
                Login
              </CButton>
            </Link>
          </CCol>
        </CRow>
      </CContainer>
    </header>
  );
};

export default Header;
