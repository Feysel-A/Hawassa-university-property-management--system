import React from "react";
import { CButton, CContainer, CRow, CCol } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import logo from "../../assets/img/hu-logo.png";
const Header = () => {
  return (
    <header className="header-section">
      <CContainer>
        <CRow className="align-items-center">
          <CCol xs="8">
            {/* Replace with <img src={logo} alt="HU Logo" className="header-logo" /> */}
            <img src={logo} alt="HU Logo" className="header-logo" />
          </CCol>
          <CCol xs="4" className="text-right">
            <CButton href="/login" color="primary">
              Login
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </header>
  );
};

export default Header;
