import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CFormFeedback,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle login button click with validation
  const handleLogin = () => {
    let isValid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate email
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    // Validate role
    if (!selectedRole) {
      alert("Please select a role!");
      isValid = false;
    }

    // Navigate if valid
    if (isValid) {
      switch (selectedRole) {
        case "staff":
          navigate("/dashboard/staff", { state: { role: "staff" } });
          break;
        case "department_head":
          navigate("/dashboard/department-head", {
            state: { role: "department_head" },
          });
          break;
        case "manager":
          navigate("/dashboard/manager", { state: { role: "manager" } });
          break;
        default:
          navigate("/login");
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6}>
            {" "}
            {/* Increased width */}
            <CCard className="shadow-lg">
              <CCardHeader
                className="text-white text-center py-4"
                style={{ backgroundColor: "#2D6CA2" }}
              >
                <h2 className="mb-0" style={{ fontSize: "1.5rem" }}>
                  Login
                </h2>
              </CCardHeader>
              <CCardBody className="p-5">
                {" "}
                {/* More padding */}
                <CForm>
                  <div className="mb-4">
                    <CFormInput
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      invalid={!!emailError}
                      className="py-2"
                      size="lg" // Larger input
                    />
                    {emailError && (
                      <CFormFeedback invalid>{emailError}</CFormFeedback>
                    )}
                  </div>
                  <div className="mb-4">
                    <CFormInput
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      invalid={!!passwordError}
                      className="py-2"
                      size="lg" // Larger input
                    />
                    {passwordError && (
                      <CFormFeedback invalid>{passwordError}</CFormFeedback>
                    )}
                  </div>
                  <div className="mb-4">
                    <CFormSelect
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      aria-label="Select Role"
                      className="py-2"
                      size="lg" // Larger dropdown
                    >
                      <option value="">Select a Role</option>
                      <option value="staff">Staff</option>
                      <option value="department_head">Department Head</option>
                      <option value="manager">Manager</option>
                    </CFormSelect>
                  </div>
                  <CButton
                    color="primary"
                    onClick={handleLogin}
                    className="w-100 py-3" // Full-width, taller button
                    size="lg" // Larger button
                  >
                    Login
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default LoginPage;
