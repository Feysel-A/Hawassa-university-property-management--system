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

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const staffId = user.id;

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/requests/user/${staffId}`
      );
      const filtered = res.data.filter(
        (r) =>
          r.status === "Allocated" ||
          r.status === "Pending" ||
          r.status === "DeptApproved" ||
          r.status === "ManagerApproved"
      );
      setRequests(filtered);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staffId) fetchRequests();
  }, [staffId]);

  const handleConfirm = async (id, accepted) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/requests/user/${id}`,
        {
          accepted,
        }
      );
      setMessage(res.data.message);
      fetchRequests();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Confirmation failed:", err);
      setMessage("Action failed.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/requests/${id}`);
      setMessage("Request cancelled successfully.");
      fetchRequests();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Cancel failed:", err);
      setMessage("Failed to cancel request.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar role="department_head" />
      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
          <CRow>
            <CCol>
              <h1 className="mb-4">Pending Requests</h1>
              <p className="text-muted">
                Manage your pending and unconfirmed asset requests.
              </p>
            </CCol>
          </CRow>

          {message && (
            <CAlert color="info" className="mb-3">
              {message}
            </CAlert>
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
                    <h5 className="mb-0">Pending or Unconfirmed Requests</h5>
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
                        {requests.length > 0 ? (
                          requests.map((req) => (
                            <CTableRow key={req.id}>
                              <CTableDataCell>{req.id}</CTableDataCell>
                              <CTableDataCell>{req.asset_name}</CTableDataCell>
                              <CTableDataCell>{req.asset_type}</CTableDataCell>
                              <CTableDataCell>{req.quantity}</CTableDataCell>
                              <CTableDataCell>
                                <strong>{req.status}</strong>
                              </CTableDataCell>
                              <CTableDataCell>
                                {req.status === "Allocated" ? (
                                  <div className="d-flex gap-2">
                                    <CButton
                                      size="sm"
                                      color="success"
                                      onClick={() =>
                                        handleConfirm(req.id, true)
                                      }
                                    >
                                      Accept
                                    </CButton>
                                    <CButton
                                      size="sm"
                                      color="danger"
                                      onClick={() =>
                                        handleConfirm(req.id, false)
                                      }
                                    >
                                      Reject
                                    </CButton>
                                  </div>
                                ) : (
                                  <CButton
                                    size="sm"
                                    color="secondary"
                                    onClick={() => handleCancel(req.id)}
                                  >
                                    Cancel
                                  </CButton>
                                )}
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell
                              colSpan="6"
                              className="text-center text-muted"
                            >
                              No pending or unconfirmed requests.
                            </CTableDataCell>
                          </CTableRow>
                        )}
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

export default PendingRequests;
