import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CAlert,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  // State for form inputs and errors
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.role) newErrors.role = "Please select a role";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // True if no errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError(""); // Clear previous submission error

    if (validateForm()) {
      // Simulate backend call (replace with real API later)
      const loginData = {
        username: formData.username,
        password: formData.password,
        role: formData.role,
      };
      navigate("/dashboard/staff");
      console.log("Submitting to backend:", loginData);

      // Simulate success or failure (for demo purposes)
      try {
        // Replace this with actual fetch/axios call to backend
        // e.g., await fetch('/api/login', { method: 'POST', body: JSON.stringify(loginData) });
        console.log("Login successful (simulated)");
        // Redirect or update UI here after real backend integration
      } catch (error) {
        setSubmitError("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-row align-items-center bg-light">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit}>
                  <h1 className="mb-4 text-center">Login to HUPMS</h1>
                  <p className="text-muted text-center mb-4">
                    Sign in to manage university property
                  </p>

                  {/* Username */}
                  <CFormInput
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="mb-3"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    invalid={!!errors.username}
                    feedbackInvalid={errors.username}
                  />

                  {/* Password */}
                  <CFormInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="mb-3"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    invalid={!!errors.password}
                    feedbackInvalid={errors.password}
                  />

                  {/* Role */}
                  <CFormSelect
                    name="role"
                    className="mb-4"
                    value={formData.role}
                    onChange={handleChange}
                    aria-label="Select Role"
                    invalid={!!errors.role}
                    feedbackInvalid={errors.role}
                  >
                    <option value="">Select Your Role</option>
                    <option value="staff">Staff</option>
                    <option value="department_head">Department Head</option>
                    <option value="property_manager">Property Manager</option>
                    <option value="store_keeper">Store Keeper</option>
                    <option value="control_room">Control Room</option>
                  </CFormSelect>

                  {/* Submission Error */}
                  {submitError && (
                    <CAlert color="danger" className="mb-4">
                      {submitError}
                    </CAlert>
                  )}

                  {/* Buttons */}
                  <CRow>
                    <CCol xs="6">
                      <CButton color="primary" className="px-4" type="submit">
                        Login
                      </CButton>
                    </CCol>
                    <CCol xs="6" className="text-right">
                      <CButton color="link" className="px-0">
                        Forgot Password?
                      </CButton>
                    </CCol>
                  </CRow>
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
