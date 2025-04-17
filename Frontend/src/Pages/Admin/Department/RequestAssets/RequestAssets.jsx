import React, { useEffect, useState } from "react";
import axios from "axios";
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
  CFormTextarea,
  CRow,
  CAlert,
  CFormFeedback,
} from "@coreui/react";
import Sidebar from "../../../../Components/Sidebar/Sidebar";

const RequestAssets = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
    purpose: "",
    employee_id: null,
  });
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

  // Get logged-in user
  useEffect(() => {
    const getUser = localStorage.getItem("user");
    if (getUser) {
      const parsedUser = JSON.parse(getUser);
      setUser(parsedUser);
      setFormData((prev) => ({ ...prev, employee_id: parsedUser.id }));
    }
  }, []);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Asset name is required";
    if (!formData.type) newErrors.type = "Asset type is required";
    if (!formData.quantity || parseInt(formData.quantity) <= 0)
      newErrors.quantity = "Quantity must be greater than 0";
    if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    setSubmitMessage("");

    if (!validateForm()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/requests/unfulfilled-requests",
        formData
      );
      setSubmitMessage("✅ Asset request submitted successfully!");
      setFormData({
        name: "",
        type: "",
        quantity: "",
        purpose: "",
        employee_id: user.id,
      });
      setTimeout(() => setSubmitMessage(""), 3000);
    } catch (err) {
      console.error("Request failed:", err);
      setSubmitMessage("❌ Failed to submit request. Try again.");
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar role="department_head" />
      <div className="flex-grow-1 bg-light d-flex align-items-center justify-content-center">
        <CContainer style={{ maxWidth: "700px" }}>
          <CCard className="shadow">
            <CCardHeader
              className="text-center"
              style={{ backgroundColor: "#08194a", color: "white" }}
            >
              <h3 style={{ color: "white" }}>Request New Asset</h3>
              <small>Fill in the form to request a new item.</small>
            </CCardHeader>
            <CCardBody>
              {submitMessage && (
                <CAlert
                  color={submitMessage.includes("✅") ? "success" : "danger"}
                >
                  {submitMessage}
                </CAlert>
              )}
              <CForm onSubmit={handleSubmit}>
                <CFormInput
                  label="Asset Name"
                  name="name"
                  placeholder="e.g. Laptop"
                  className="mb-3"
                  value={formData.name}
                  onChange={handleChange}
                  invalid={!!errors.name}
                />
                <CFormFeedback invalid>{errors.name}</CFormFeedback>

                <CFormSelect
                  label="Asset Type"
                  name="type"
                  className="mb-3"
                  value={formData.type}
                  onChange={handleChange}
                  invalid={!!errors.type}
                >
                  <option value="">Select Asset Type</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Consumable">Consumable</option>
                </CFormSelect>
                <CFormFeedback invalid>{errors.type}</CFormFeedback>

                <CFormInput
                  type="number"
                  label="Quantity"
                  name="quantity"
                  placeholder="e.g. 1"
                  className="mb-3"
                  min={1}
                  value={formData.quantity}
                  onChange={handleChange}
                  invalid={!!errors.quantity}
                />
                <CFormFeedback invalid>{errors.quantity}</CFormFeedback>

                <CFormTextarea
                  label="Purpose"
                  name="purpose"
                  placeholder="Describe the reason for this request"
                  rows={3}
                  className="mb-3"
                  value={formData.purpose}
                  onChange={handleChange}
                  invalid={!!errors.purpose}
                />
                <CFormFeedback invalid>{errors.purpose}</CFormFeedback>

                <div className="text-center">
                  <CButton type="submit" color="primary">
                    Submit Request
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CContainer>
      </div>
    </div>
  );
};

export default RequestAssets;
