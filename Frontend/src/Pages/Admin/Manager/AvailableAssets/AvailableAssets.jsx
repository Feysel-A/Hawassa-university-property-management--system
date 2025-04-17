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
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import Sidebar from "../../../../Components/Sidebar/Sidebar";
import axios from "axios";

const AvailableAssets = () => {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch real assets
  const fetchAssets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assets");
      setAssets(res.data);
    } catch (err) {
      setError("Failed to load assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDisposal = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/assets/${id}`, {
        status: "Removed",
      });
      setMessage("Asset marked as removed successfully.");
      fetchAssets(); // Refresh
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Disposal failed.");
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
                          {asset.status !== "Removed" && (
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleDisposal(asset.id)}
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
        </CContainer>
      </div>
    </div>
  );
};

export default AvailableAssets;
