import React, { useState, useEffect } from "react";
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
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
  CSpinner,
} from "@coreui/react";
import { CIcon } from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";
import Sidebar from "../../../../Components/Sidebar/Sidebar";

const ManagerDashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [manager, setManager] = useState({});

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setManager(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/requests/manager"
        );
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching manager requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAllocate = async (request) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/requests/allocate/${request.id}`,
        {
          status: "ManagerApproved",
          manager_id: manager.id,
        }
      );
      console.log(res)
      setMessage(`✅ ${res.data.message}`);
      setRequests((prev) => prev.filter((r) => r.id !== request.id)); // Remove approved item
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Approval error:", error);
      setMessage("❌ Failed to approve the request.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleReject = async (request) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/requests/allocate/${request.id}`,
        {
          status: "ManagerDenied",
          manager_id: manager.id,
        }
      );
      setMessage(`❌ ${res.data.message}`);
      setRequests((prev) => prev.filter((r) => r.id !== request.id)); // Remove rejected item
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Rejection error:", error);
      setMessage("❌ Failed to reject the request.");
      setTimeout(() => setMessage(""), 3000);
    }
  };
  return (
    <div className="min-vh-100 d-flex">
      <Sidebar
        role="manager"
        visible={isSmallScreen ? sidebarVisible : true}
        overlaid={isSmallScreen}
      />

      <div className="flex-grow-1 bg-light">
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          {isSmallScreen && (
            <CButton
              color="primary"
              onClick={() => setSidebarVisible(!sidebarVisible)}
            >
              <CIcon icon={cilMenu} />
            </CButton>
          )}
          <h1 className="mb-0">Manager Dashboard</h1>
        </div>

        <CContainer fluid className="py-3">
          <CRow>
            <CCol>
              <p className="text-muted fs-5">
                Welcome back, <strong>{manager.name || "Manager"}</strong> 👋 –
                You can now allocate department-approved requests.
              </p>
            </CCol>
          </CRow>

          {message && (
            <CAlert
              color={message.includes("successfully") ? "success" : "danger"}
            >
              {message}
            </CAlert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-2">Loading pending requests...</p>
            </div>
          ) : (
            <CRow>
              <CCol>
                <CCard>
                  <CCardHeader>
                    <h4 className="mb-0">Pending Requests for Allocation</h4>
                  </CCardHeader>
                  <CCardBody className="p-1">
                    <div style={{ overflowX: "auto" }}>
                      <CTable hover responsive>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>ID</CTableHeaderCell>
                            <CTableHeaderCell>Requested By</CTableHeaderCell>
                            <CTableHeaderCell>Asset Name</CTableHeaderCell>
                            <CTableHeaderCell>Type</CTableHeaderCell>
                            <CTableHeaderCell>Quantity</CTableHeaderCell>
                            <CTableHeaderCell>Date</CTableHeaderCell>
                            <CTableHeaderCell>Action</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {requests.length > 0 ? (
                            requests.map((req) => (
                              <CTableRow key={req.id}>
                                <CTableHeaderCell>{req.id}</CTableHeaderCell>
                                <CTableHeaderCell>
                                  {req.requested_by}
                                </CTableHeaderCell>
                                <CTableHeaderCell>
                                  {req.asset_name}
                                </CTableHeaderCell>
                                <CTableHeaderCell>
                                  {req.asset_type}
                                </CTableHeaderCell>
                                <CTableHeaderCell>
                                  {req.quantity}
                                </CTableHeaderCell>
                                <CTableHeaderCell>
                                  {req.request_date?.split("T")[0]}
                                </CTableHeaderCell>
                                <CTableHeaderCell>
                                  <div className="d-flex flex-column flex-sm-row">
                                    <CButton
                                      color="success"
                                      size="sm"
                                      className="me-sm-2 mb-2 mb-sm-0"
                                      onClick={() => handleAllocate(req)}
                                    >
                                      Allocate
                                    </CButton>
                                    <CButton
                                      color="danger"
                                      size="sm"
                                      onClick={() => handleReject(req)}
                                    >
                                      Reject
                                    </CButton>
                                  </div>
                                </CTableHeaderCell>
                              </CTableRow>
                            ))
                          ) : (
                            <CTableRow>
                              <CTableHeaderCell
                                colSpan="7"
                                className="text-center text-muted"
                              >
                                No requests to display.
                              </CTableHeaderCell>
                            </CTableRow>
                          )}
                        </CTableBody>
                      </CTable>
                    </div>
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

export default ManagerDashboard;
