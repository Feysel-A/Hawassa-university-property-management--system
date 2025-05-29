import React, { useEffect, useState } from "react";
import axios from "axios";
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
  CTableDataCell,
  CButton,
  CAlert,
  CSpinner,
} from "@coreui/react";
import Sidebar from "../../../../Components/Sidebar/Sidebar";

const ReturnedAssets = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReturnedRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/requests/return-requests"
      );
      console.log(res.data);
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch return requests", err);
      setMessage("Error loading returned asset requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReturn = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/requests/confirm-return/${id}`
      );
      setMessage("Return confirmed successfully.");
      fetchReturnedRequests(); // Refresh list
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Confirmation failed", err);
      setMessage("Failed to confirm return.");
    }
  };

  useEffect(() => {
    fetchReturnedRequests();
  }, []);

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar role="storeman" />
      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
          <CRow>
            <CCol>
              <h2 className="mb-3">Returned Asset Requests</h2>
              {message && <CAlert color="info">{message}</CAlert>}
            </CCol>
          </CRow>

          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p>Loading return requests...</p>
            </div>
          ) : (
            <CCard>
              <CCardHeader>Pending Return Confirmations</CCardHeader>
              <CCardBody>
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>ID</CTableHeaderCell>
                      <CTableHeaderCell>Asset</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Requested By</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {requests.length > 0 ? (
                      requests.map((req) => (
                        <CTableRow key={req.id}>
                          <CTableDataCell>{req.id}</CTableDataCell>
                          <CTableDataCell>{req.asset_name}</CTableDataCell>
                          <CTableDataCell>{req.asset_type}</CTableDataCell>
                          <CTableDataCell>{req.quantity}</CTableDataCell>
                          <CTableDataCell>{req.staff_name}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="success"
                              size="sm"
                              onClick={() => handleConfirmReturn(req.id)}
                            >
                              Confirm
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell
                          colSpan="6"
                          className="text-center text-muted"
                        >
                          No return requests found.
                        </CTableDataCell>
                      </CTableRow>
                    )}
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

export default ReturnedAssets;
