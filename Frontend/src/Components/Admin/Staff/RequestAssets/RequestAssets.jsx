import React, { useState } from "react";
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
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import Sidebar from "../Sidebar/Sidebar";

const RequestAssets = () => {
  // Form state
  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "",
    quantity: "",
    purpose: "",
    requestDate: new Date().toISOString().split("T")[0], // Auto-filled
    staffId: "STAFF001", // Placeholder from login
  });
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.assetName.trim())
      newErrors.assetName = "Asset name is required";
    if (!formData.assetType) newErrors.assetType = "Asset type is required";
    if (!formData.quantity || formData.quantity <= 0)
      newErrors.quantity = "Quantity must be a positive number";
    if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitMessage("");

    if (validateForm()) {
      // Simulate backend call (replace with fetch/axios later)
      console.log("Submitting request:", formData);
      setSubmitMessage("Asset request submitted successfully!");
      setFormData({
        assetName: "",
        assetType: "",
        quantity: "",
        purpose: "",
        requestDate: new Date().toISOString().split("T")[0],
        staffId: "STAFF001",
      }); // Reset form
      setTimeout(() => setSubmitMessage(""), 3000); // Clear message
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
          <CRow>
            <CCol>
              <h1 className="mb-4">Request New Assets</h1>
              <p className="text-muted">
                Fill out the form to request new assets.
              </p>
            </CCol>
          </CRow>

          {/* Submit Feedback */}
          {submitMessage && (
            <CAlert color="success" className="mb-4">
              {submitMessage}
            </CAlert>
          )}

          {/* Request Form */}
          <CRow>
            <CCol md="8">
              <CCard>
                <CCardHeader>
                  <h4 className="mb-0">Asset Request Form</h4>
                </CCardHeader>
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <CFormInput
                      type="text"
                      name="assetName"
                      placeholder="Asset Name"
                      className="mb-3"
                      value={formData.assetName}
                      onChange={handleChange}
                      invalid={!!errors.assetName}
                      feedbackInvalid={errors.assetName}
                      label="Asset Name"
                    />
                    <CFormSelect
                      name="assetType"
                      className="mb-3"
                      value={formData.assetType}
                      onChange={handleChange}
                      invalid={!!errors.assetType}
                      feedbackInvalid={errors.assetType}
                      label="Asset Type"
                    >
                      <option value="">Select Asset Type</option>
                      <option value="Fixed">Fixed</option>
                      <option value="Consumable">Consumable</option>
                    </CFormSelect>
                    <CFormInput
                      type="number"
                      name="quantity"
                      placeholder="Quantity"
                      className="mb-3"
                      value={formData.quantity}
                      onChange={handleChange}
                      invalid={!!errors.quantity}
                      feedbackInvalid={errors.quantity}
                      label="Quantity"
                      min="1"
                    />
                    <CFormTextarea
                      name="purpose"
                      placeholder="Purpose of the request"
                      className="mb-3"
                      value={formData.purpose}
                      onChange={handleChange}
                      invalid={!!errors.purpose}
                      feedbackInvalid={errors.purpose}
                      label="Purpose"
                      rows="3"
                    />
                    <CFormInput
                      type="date"
                      name="requestDate"
                      className="mb-3"
                      value={formData.requestDate}
                      onChange={handleChange}
                      label="Request Date"
                      disabled // Auto-filled
                    />
                    <CFormInput
                      type="text"
                      name="staffId"
                      className="mb-4"
                      value={formData.staffId}
                      onChange={handleChange}
                      label="Staff ID"
                      disabled // From login
                    />
                    <CButton color="primary" type="submit">
                      Submit Request
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  );
};

export default RequestAssets;
