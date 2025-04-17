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
  CFormFeedback,
  CRow,
} from "@coreui/react";
import axios from "axios";
import "@coreui/coreui/dist/css/coreui.min.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");
    setServerError("");

    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username: email,
          password: password,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on user role
      switch (user.role) {
        case "Admin":
          navigate("/dashboard/admin");
          break;
        case "DepartmentHead":
          navigate("/dashboard/department-head");
          break;
        case "StockManager":
          navigate("/dashboard/manager");
          break;
        case "StoreMan":
          navigate("/dashboard/storeman");
          break;
        default:
          navigate("/dashboard/staff");
      }
    } catch (error) {
      const message =
        error.response?.data?.error || "Login failed. Please try again.";
      setServerError(message);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6}>
            <CCard className="shadow-lg">
              <CCardHeader
                className="text-white text-center py-4"
                style={{ backgroundColor: "#08194A" }}
              >
                <h2 style={{ fontSize: "2rem", color: "white" }}>Login</h2>
              </CCardHeader>
              <CCardBody className="p-5">
                <CForm>
                  <div className="mb-4">
                    <CFormInput
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      invalid={!!emailError}
                      className="py-2"
                      size="lg"
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
                      size="lg"
                    />
                    {passwordError && (
                      <CFormFeedback invalid>{passwordError}</CFormFeedback>
                    )}
                  </div>

                  {serverError && (
                    <p style={{ color: "red", textAlign: "center" }}>
                      {serverError}
                    </p>
                  )}

                  <CButton
                    color="primary"
                    style={{
                      backgroundColor: "#D9534F",
                      margin: "10px 15px",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      fontSize: "15px",
                      transition: "background-color 0.2s ease",
                    }}
                    onClick={handleLogin}
                    className="w-100 py-3"
                    size="lg"
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
