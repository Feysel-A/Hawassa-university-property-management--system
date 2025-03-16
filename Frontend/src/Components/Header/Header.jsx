import React from "react";
import { CButton, CContainer, CRow, CCol } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import logo from "../../assets/img/hu-logo.png";
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
            <CButton href="/login" color="primary" size="sm">
              Login
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </header>
  );
};

export default Header;
