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
import Sidebar from "../../../../Components/Sidebar/Sidebar";
import { cilMenu } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const StoreManDashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage));
    }
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/requests/storeman");
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests for storeman:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleConfirm = async (reqId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/requests/confirm/${reqId}`, {
        storekeeper_id: user.id,
      });
      setMessage(res.data.message);
      setRequests((prev) => prev.filter((r) => r.id !== reqId));
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Confirm error:", err);
      setMessage("❌ Failed to confirm. Try again.");
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar
        role="StoreMan"
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
          <h1 className="mb-0">Store Dashboard</h1>
        </div>

        <CContainer fluid className="py-3">
          <CRow>
            <CCol>
              <p className="text-muted fs-5">
                Hello, <strong>{user.name || "Storeman"}</strong> 👋 – You can now confirm and issue allocated requests.
              </p>
            </CCol>
          </CRow>

          {message && (
            <CAlert color={message.includes("confirmed") ? "success" : "danger"}>
              {message}
            </CAlert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p>Loading manager-approved requests...</p>
            </div>
          ) : (
            <CRow>
              <CCol>
                <CCard>
                  <CCardHeader>
                    <h4 className="mb-0">Approved Requests to Confirm</h4>
                  </CCardHeader>
                  <CCardBody className="p-1">
                    <div style={{ overflowX: "auto" }}>
                      <CTable hover responsive>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>ID</CTableHeaderCell>
                            <CTableHeaderCell>Requested By</CTableHeaderCell>
                            <CTableHeaderCell>Asset</CTableHeaderCell>
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
                                <CTableHeaderCell>{req.requested_by}</CTableHeaderCell>
                                <CTableHeaderCell>{req.asset_name}</CTableHeaderCell>
                                <CTableHeaderCell>{req.asset_type}</CTableHeaderCell>
                                <CTableHeaderCell>{req.quantity}</CTableHeaderCell>
                                <CTableHeaderCell>{req.request_date?.split("T")[0]}</CTableHeaderCell>
                                <CTableHeaderCell>
                                  <CButton
                                    color="success"
                                    size="sm"
                                    onClick={() => handleConfirm(req.id)}
                                  >
                                    Confirm & Issue
                                  </CButton>
                                </CTableHeaderCell>
                              </CTableRow>
                            ))
                          ) : (
                            <CTableRow>
                              <CTableHeaderCell colSpan="7" className="text-center text-muted">
                                No approved requests to confirm.
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

export default StoreManDashboard;
