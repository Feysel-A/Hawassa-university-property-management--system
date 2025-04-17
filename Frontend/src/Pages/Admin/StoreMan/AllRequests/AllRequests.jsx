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
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
} from "@coreui/react";
import Sidebar from "../../../../Components/Sidebar/Sidebar";

const StoremanHandledRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHandled = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/requests/storeman/handled"
      );
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching handled requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHandled();
  }, []);

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar role="StoreMan" />
      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
          <CRow>
            <CCol>
              <h1 className="mb-4">Handled Requests</h1>
              <p className="text-muted">
                View all accepted or rejected asset deliveries by users.
              </p>
            </CCol>
          </CRow>

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
                    <h5 className="mb-0">Delivered / Rejected Assets</h5>
                  </CCardHeader>
                  <CCardBody>
                    <CTable hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>ID</CTableHeaderCell>
                          <CTableHeaderCell>Staff Name</CTableHeaderCell>
                          <CTableHeaderCell>Asset</CTableHeaderCell>
                          <CTableHeaderCell>Type</CTableHeaderCell>
                          <CTableHeaderCell>Quantity</CTableHeaderCell>
                          <CTableHeaderCell>Status</CTableHeaderCell>
                          <CTableHeaderCell>Delivered On</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {requests.length > 0 ? (
                          requests.map((req) => (
                            <CTableRow key={req.id}>
                              <CTableDataCell>{req.id}</CTableDataCell>
                              <CTableDataCell>{req.staff_name}</CTableDataCell>
                              <CTableDataCell>{req.asset_name}</CTableDataCell>
                              <CTableDataCell>{req.asset_type}</CTableDataCell>
                              <CTableDataCell>{req.quantity}</CTableDataCell>
                              <CTableDataCell>
                                <strong
                                  className={
                                    req.status === "Accepted"
                                      ? "text-success"
                                      : "text-danger"
                                  }
                                >
                                  {req.status === "Accepted"
                                    ? "Accepted"
                                    : "Rejected"}
                                </strong>
                              </CTableDataCell>
                              <CTableDataCell>
                                {req.allocation_date?.split("T")[0] || "--"}
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell
                              colSpan="7"
                              className="text-center text-muted"
                            >
                              No accepted or rejected requests yet.
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

export default StoremanHandledRequests;
