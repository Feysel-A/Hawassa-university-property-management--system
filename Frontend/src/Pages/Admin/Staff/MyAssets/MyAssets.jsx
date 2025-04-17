import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CAlert,
} from "@coreui/react";
import Sidebar from "../../../../Components/Sidebar/Sidebar";

const AcceptedAssets = () => {
  const [acceptedAssets, setAcceptedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});

  const storedUser = localStorage.getItem("user");

  useEffect(() => {
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const staffId = user.id;

  const fetchAssets = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/requests/user/${staffId}`
      );
      const filtered = res.data.filter((req) => req.status === "Accepted");
      setAcceptedAssets(filtered);
    } catch (err) {
      console.error("Failed to fetch accepted assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staffId) {
      fetchAssets();
    }
  }, [staffId]);

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar role="staff" />
      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
          <CRow>
            <CCol>
              <h1 className="mb-4">My Accepted Assets</h1>
              <p className="text-muted">These are the assets you’ve accepted and now possess.</p>
            </CCol>
          </CRow>

          {message && (
            <CRow className="mb-3">
              <CCol>
                <CAlert color="info">{message}</CAlert>
              </CCol>
            </CRow>
          )}

          {loading ? (
            <CRow>
              <CCol className="text-center">
                <CSpinner color="primary" />
              </CCol>
            </CRow>
          ) : (
            <CRow>
              <CCol>
                <CCard>
                  <CCardHeader>
                    <h5 className="mb-0">Accepted Assets</h5>
                  </CCardHeader>
                  <CCardBody>
                    <CTable hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>ID</CTableHeaderCell>
                          <CTableHeaderCell>Asset</CTableHeaderCell>
                          <CTableHeaderCell>Type</CTableHeaderCell>
                          <CTableHeaderCell>Quantity</CTableHeaderCell>
                          <CTableHeaderCell>Status</CTableHeaderCell>
                          <CTableHeaderCell>Action</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {acceptedAssets.map((asset) => (
                          <CTableRow key={asset.id}>
                            <CTableHeaderCell>{asset.id}</CTableHeaderCell>
                            <CTableDataCell>{asset.asset_name}</CTableDataCell>
                            <CTableDataCell>{asset.asset_type}</CTableDataCell>
                            <CTableDataCell>{asset.quantity}</CTableDataCell>
                            <CTableDataCell>
                              <strong>{asset.status}</strong>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                color="warning"
                                size="sm"
                                onClick={() => alert("Return functionality coming soon!")}
                              >
                                Return
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </CContainer>
      </div>
    </div>
  );
};

export default AcceptedAssets;
