import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CAlert,
  CButton,
  CTableDataCell,
  CSpinner,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSelect,
  CFormInput,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import Sidebar from "../../../../Components/Sidebar/Sidebar";
import axios from "axios";

const AvailableAssets = () => {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [allAssets, setAllAssets] = useState([]);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [disposalData, setDisposalData] = useState({
    replacement_type: "",
    replacement_reason: "",
    new_asset_id: "",
    institution_name: "",
  });

  const fetchAssets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assets");
      setAssets(res.data);
      setAllAssets(res.data);
    } catch (err) {
      setError("Failed to load assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDisposalClick = (asset) => {
    setSelectedAsset(asset);
    setDisposalData({
      replacement_type: "",
      replacement_reason: "",
      new_asset_id: "",
      institution_name: "",
    });
    setShowModal(true);
  };

  const handleDisposalSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/assets/dispose/${selectedAsset.id}`,
        {
          ...disposalData,
          new_asset_id: disposalData.new_asset_id || null,
          institution_name: disposalData.institution_name || null,
        }
      );
      setMessage("Asset disposed successfully.");
      setShowModal(false);
      fetchAssets();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Disposal failed.");
      setShowModal(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar role="manager" />
      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
          <CRow>
            <CCol>
              <h2 className="mb-4">Manage Assets</h2>
              {message && <CAlert color="info">{message}</CAlert>}
              {error && <CAlert color="danger">{error}</CAlert>}
            </CCol>
          </CRow>

          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p>Loading assets...</p>
            </div>
          ) : (
            <CCard className="shadow-sm">
              <CCardHeader
                className="text-white"
                style={{ backgroundColor: "#08194a" }}
              >
                <h4 className="text-center mb-0 text-white">Assets List</h4>
              </CCardHeader>
              <CCardBody>
                <CTable responsive hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>ID</CTableHeaderCell>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell>Model</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Code</CTableHeaderCell>
                      <CTableHeaderCell>Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Cost</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {assets.map((asset) => (
                      <CTableRow key={asset.id}>
                        <CTableHeaderCell>{asset.id}</CTableHeaderCell>
                        <CTableDataCell>{asset.name}</CTableDataCell>
                        <CTableDataCell>{asset.model_name}</CTableDataCell>
                        <CTableDataCell>{asset.type}</CTableDataCell>
                        <CTableDataCell>{asset.code}</CTableDataCell>
                        <CTableDataCell>{asset.quantity}</CTableDataCell>
                        <CTableDataCell>${asset.cost}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            color={
                              asset.status === "Active"
                                ? "success"
                                : asset.status === "Removed"
                                ? "danger"
                                : "secondary"
                            }
                          >
                            {asset.status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {asset.status === "Active" && (
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleDisposalClick(asset)}
                            >
                              Dispose
                            </CButton>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          )}

          {/* Modal for Disposal */}
          <CModal visible={showModal} onClose={() => setShowModal(false)}>
            <CModalHeader>Asset Disposal</CModalHeader>
            <CModalBody>
              <CForm>
                <CFormSelect
                  label="Replacement Type"
                  value={disposalData.replacement_type}
                  onChange={(e) =>
                    setDisposalData({
                      ...disposalData,
                      replacement_type: e.target.value,
                    })
                  }
                  className="mb-3"
                >
                  <option value="">Select Type</option>
                  <option value="Removed">Removed</option>
                  <option value="Replaced">Replaced</option>
                  <option value="Donated">Donated</option>
                </CFormSelect>

                <CFormInput
                  label="Reason"
                  value={disposalData.replacement_reason}
                  onChange={(e) =>
                    setDisposalData({
                      ...disposalData,
                      replacement_reason: e.target.value,
                    })
                  }
                  className="mb-3"
                />

                {disposalData.replacement_type === "Replaced" && (
                  <CFormSelect
                    label="Select Replacement Asset"
                    value={disposalData.new_asset_id}
                    onChange={(e) =>
                      setDisposalData({
                        ...disposalData,
                        new_asset_id: e.target.value,
                      })
                    }
                    className="mb-3"
                  >
                    <option value="">Select Asset</option>
                    {assets

                      .filter(
                        (a) =>
                          a.status === "Active" && a.id !== selectedAsset?.id
                      )
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.model_name})
                        </option>
                      ))}
                  </CFormSelect>
                )}

                {disposalData.replacement_type === "Donated" && (
                  <CFormInput
                    label="Institution Name"
                    value={disposalData.institution_name}
                    onChange={(e) =>
                      setDisposalData({
                        ...disposalData,
                        institution_name: e.target.value,
                      })
                    }
                    className="mb-3"
                  />
                )}
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </CButton>
              <CButton color="danger" onClick={handleDisposalSubmit}>
                Confirm Disposal
              </CButton>
            </CModalFooter>
          </CModal>
        </CContainer>
      </div>
    </div>
  );
};

export default AvailableAssets;
