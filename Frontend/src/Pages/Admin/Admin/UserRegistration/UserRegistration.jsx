import React, { useState, useEffect } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import Sidebar from "../../../../Components/Sidebar/Sidebar";
const UserRegistration = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    department_id: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load departments
  useEffect(() => {
    fetch("http://localhost:5000/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error("Error fetching departments", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      role,
      department_id,
      password,
    } = formData;

    if (!firstName || !lastName || !email || !role || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      role,
      password,
      department_id,
    };
    console.log(department_id);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.error || "Registration failed.");
      } else {
        setSuccessMessage("User registered successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          role: "",
          department_id: "",
          password: "",
        });
      }
    } catch (err) {
      setErrorMessage("Server error. Please try again.");
    }
  };

  const showDepartment =
    formData.role === "Staff" || formData.role === "DepartmentHead";

  return (
    <div className="d-flex min-vh-100 ">
      <Sidebar role="admin" />
      <CContainer
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center bg-light"
      >
        <CCol md={8} lg={6}>
          <CCard className="shadow-lg">
            <CCardHeader
              className="text-center text-white"
              style={{ backgroundColor: "#08194a" }}
            >
              <h4 className="mb-0" style={{ color: "white" }}>
                User Registration
              </h4>
            </CCardHeader>
            <CCardBody className="p-4">
              {successMessage && (
                <CAlert color="success">{successMessage}</CAlert>
              )}
              {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      name="firstName"
                      label="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      name="lastName"
                      label="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      name="email"
                      label="Email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@example.com"
                      type="email"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      name="phone"
                      label="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0911..."
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol>
                    <CFormInput
                      name="address"
                      label="Address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="HU Campus"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol>
                    <CFormSelect
                      name="role"
                      label="Role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="">Select role</option>
                      <option value="Admin">Admin</option>
                      <option value="Staff">Staff</option>
                      <option value="DepartmentHead">Department Head</option>
                      <option value="StockManager">Stock Manager</option>
                      <option value="StoreMan">Store Keeper</option>
                      <option value="ControlRoom">Control Room</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                {showDepartment && (
                  <CRow className="mb-3">
                    <CCol>
                      <CFormSelect
                        name="department_id"
                        label="Department"
                        value={formData.department_id}
                        onChange={handleChange}
                      >
                        <option value="">Select department</option>
                        <option value="1">Information Technology</option>
                        <option value="2">Computer Science</option>
                        <option value="3">Information System</option>
                        <option value="4">Electrical Engineering</option>
                        <option value="5">Civil Engineering</option>
                        <option value="6">Mechanical Engineering</option>
                        {departments.map((dept) => (
                          <option
                            key={dept.department_id}
                            value={dept.department_id}
                          >
                            {dept.department_name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </CRow>
                )}

                <CRow className="mb-4">
                  <CCol>
                    <CFormInput
                      name="password"
                      type="password"
                      label="Password"
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                <CButton type="submit" color="primary" className="w-100 py-2">
                  Register User
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CContainer>
    </div>
  );
};

export default UserRegistration;
