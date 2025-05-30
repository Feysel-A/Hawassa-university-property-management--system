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
  CRow,
  CAlert,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import Sidebar from "../../../../Components/Sidebar/Sidebar";
import axios from "axios";

const RegisterAsset = () => {
  const [formData, setFormData] = useState({
    name: "",
    model_name: "",
    code: "",
    type: "",
    quantity: "",
    cost: "",
    department_id: 1,
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Asset name is required";
    if (!formData.code.trim()) newErrors.code = "Asset code is required";
    if (!formData.type) newErrors.type = "Asset type is required";
    if (!formData.quantity || formData.quantity <= 0)
      newErrors.quantity = "Quantity must be a positive number";
    if (!formData.cost || formData.cost <= 0)
      newErrors.cost = "Cost must be a positive number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage("");

    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/assets", formData);

      setSubmitMessage("✅ Asset registered successfully!");
      setFormData({
        name: "",
        model_name: "",
        code: "",
        type: "",
        quantity: "",
        cost: "",
        department_id: 1,
      });
    } catch (error) {
      console.error("Asset registration error:", error);
      if (error.response?.data?.message) {
        setSubmitMessage("❌ " + error.response.data.message);
      } else {
        setSubmitMessage("❌ Asset registration failed.");
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar role="manager" />
      <div className="flex-grow-1 bg-light d-flex justify-content-center align-items-center">
        <CContainer className="py-5">
          <CRow className="justify-content-center">
            <CCol xs={12} md={10} lg={8}>
              {submitMessage && (
                <CAlert color={submitMessage.includes("✅") ? "success" : "danger"} className="mb-4 text-center">
                  {submitMessage}
                </CAlert>
              )}

              <CCard className="shadow-sm">
                <CCardHeader className="text-white" style={{ backgroundColor: "#08194a" }}>
                  <h4 className="mb-0 text-center text-white">Asset Registration Form</h4>
                </CCardHeader>
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <CFormInput
                      name="name"
                      label="Asset Name"
                      value={formData.name}
                      onChange={handleChange}
                      invalid={!!errors.name}
                      feedbackInvalid={errors.name}
                      className="mb-3"
                    />
                    <CFormInput
                      name="model_name"
                      label="Model Name"
                      value={formData.model_name}
                      onChange={handleChange}
                      className="mb-3"
                    />
                    <CFormInput
                      name="code"
                      label="Asset Code"
                      value={formData.code}
                      onChange={handleChange}
                      invalid={!!errors.code}
                      feedbackInvalid={errors.code}
                      className="mb-3"
                    />
                    <CFormSelect
                      name="type"
                      label="Asset Type"
                      value={formData.type}
                      onChange={handleChange}
                      invalid={!!errors.type}
                      feedbackInvalid={errors.type}
                      className="mb-3"
                    >
                      <option value="">Select Asset Type</option>
                      <option value="Fixed">Fixed</option>
                      <option value="Consumable">Consumable</option>
                    </CFormSelect>
                    <CFormInput
                      type="number"
                      name="quantity"
                      label="Quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      invalid={!!errors.quantity}
                      feedbackInvalid={errors.quantity}
                      min="1"
                      className="mb-3"
                    />
                    <CFormInput
                      type="number"
                      name="cost"
                      label="Cost"
                      value={formData.cost}
                      onChange={handleChange}
                      invalid={!!errors.cost}
                      feedbackInvalid={errors.cost}
                      min="1"
                      className="mb-3"
                    />
                    <div className="text-center">
                      <CButton type="submit" color="primary">
                        Register Asset
                      </CButton>
                    </div>
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

export default RegisterAsset;
