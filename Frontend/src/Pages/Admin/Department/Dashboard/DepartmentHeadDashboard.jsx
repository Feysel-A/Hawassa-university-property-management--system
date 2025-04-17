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
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
  CSpinner,
} from "@coreui/react";
import { cilMenu } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import Sidebar from "../../../../Components/Sidebar/Sidebar";

const DepartmentHeadDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 👤 Get logged-in department head
  useEffect(() => {
    const getUser = localStorage.getItem("user");
    if (getUser) setUser(JSON.parse(getUser));
  }, []);
  // ✅ Fetch department requests
  useEffect(() => {
    if (!user?.id) return;

    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/requests/department-head/${user.id}/pending-requests`
        );
        console.log(res)
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch department requests", err);
        setMessage("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  // ✅ Approve/Reject Handlers
  const updateRequest = async (requestId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/requests/approve/${requestId}`,
        {
          status,
          approved_by: user.id,
        }
      );
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      setMessage(
        `Request ${
          status === "DeptApproved" ? "Approved" : "rejected"
        } successfully!`
      );
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Action failed:", err);
      setMessage("Error processing request.");
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar
        role="department_head"
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
          <h1 className="mb-0">Department Head Dashboard</h1>
        </div>

        <CContainer fluid className="py-3">
          <CRow>
            <CCol>
              <p className="text-muted">Review and approve staff requests.</p>
            </CCol>
          </CRow>

          {message && (
            <CAlert color="info" className="mb-3 text-center">
              {message}
            </CAlert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p>Loading pending requests...</p>
            </div>
          ) : (
            <CCard>
              <CCardHeader>
                <h4 className="mb-0">Pending Requests</h4>
              </CCardHeader>
              <CCardBody className="p-2">
                <div style={{ overflowX: "auto" }}>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Request ID</CTableHeaderCell>
                        <CTableHeaderCell>Requested By</CTableHeaderCell>
                        <CTableHeaderCell>Asset Name</CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Qty</CTableHeaderCell>
                        <CTableHeaderCell>Purpose</CTableHeaderCell>
                        <CTableHeaderCell>Date</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {requests.map((req) => (
                        <CTableRow key={req.id}>
                          <CTableHeaderCell>{req.id}</CTableHeaderCell>
                          <CTableHeaderCell>
                            {req.staff_name || "—"}
                          </CTableHeaderCell>
                          <CTableHeaderCell>{req.asset_name}</CTableHeaderCell>
                          <CTableHeaderCell>{req.asset_type}</CTableHeaderCell>
                          <CTableHeaderCell>{req.quantity}</CTableHeaderCell>
                          <CTableHeaderCell>{req.purpose}</CTableHeaderCell>
                          <CTableHeaderCell>
                            {req.request_date?.slice(0, 10)}
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <div className="d-flex gap-2">
                              <CButton
                                color="success"
                                size="sm"
                                onClick={() =>
                                  updateRequest(req.id, "DeptApproved")
                                }
                              >
                                Approve
                              </CButton>
                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() =>
                                  updateRequest(req.id, "DeptDenied")
                                }
                              >
                                Reject
                              </CButton>
                            </div>
                          </CTableHeaderCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              </CCardBody>
            </CCard>
          )}
        </CContainer>
      </div>
    </div>
  );
};

export default DepartmentHeadDashboard;
