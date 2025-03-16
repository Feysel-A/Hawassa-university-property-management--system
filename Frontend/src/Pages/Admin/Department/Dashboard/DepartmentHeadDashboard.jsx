import React, { useState, useEffect } from "react";
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
} from "@coreui/react";
import { CIcon } from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";
import "@coreui/coreui/dist/css/coreui.min.css";
import Sidebar from "../../../../Components/Sidebar/Sidebar";

const DepartmentHeadDashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pendingRequests = [
    {
      id: 1,
      staffId: "STAFF001",
      assetName: "Desktop PC",
      assetType: "Fixed",
      quantity: 1,
      purpose: "Teaching",
      requestDate: "2025-03-16",
    },
    {
      id: 2,
      staffId: "STAFF002",
      assetName: "Printer Ink",
      assetType: "Consumable",
      quantity: 2,
      purpose: "Office use",
      requestDate: "2025-03-16",
    },
  ];

  const [message, setMessage] = useState("");

  const handleApprove = (request) => {
    const approvalData = { ...request, status: "Approved", approvedBy: "DEPT001" };
    console.log("Approving request:", approvalData);
    setMessage(`Approved request for ${request.assetName}`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleReject = (request) => {
    const rejectionData = { ...request, status: "Rejected", approvedBy: "DEPT001" };
    console.log("Rejecting request:", rejectionData);
    setMessage(`Rejected request for ${request.assetName}`);
    setTimeout(() => setMessage(""), 3000);
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
        <CContainer fluid className="py-2">
          <CRow>
            <CCol xs={12}>
              <p className="text-muted">
                Welcome, [Department Head]! Review and approve staff requests here.
              </p>
            </CCol>
          </CRow>
          {message && (
            <CAlert
              color={message.includes("Approved") ? "success" : "danger"}
              className="mb-4"
            >
              {message}
            </CAlert>
          )}
          <CRow>
            <CCol xs={12}>
              <CCard>
                <CCardHeader>
                  <h4 className="mb-0">Pending Requests</h4>
                </CCardHeader>
                <CCardBody className="p-1">
                  <div style={{ overflowX: "auto" }}>
                    <CTable hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell className="d-none d-sm-table-cell">ID</CTableHeaderCell>
                          <CTableHeaderCell className="d-none d-sm-table-cell">Staff ID</CTableHeaderCell>
                          <CTableHeaderCell>Asset Name</CTableHeaderCell>
                          <CTableHeaderCell className="d-none d-sm-table-cell">Type</CTableHeaderCell>
                          <CTableHeaderCell className="d-none d-sm-table-cell">Quantity</CTableHeaderCell>
                          <CTableHeaderCell className="d-none d-md-table-cell">Purpose</CTableHeaderCell>
                          <CTableHeaderCell className="d-none d-md-table-cell">Date</CTableHeaderCell>
                          <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {pendingRequests.map((request) => (
                          <CTableRow key={request.id}>
                            <CTableHeaderCell className="d-none d-sm-table-cell">{request.id}</CTableHeaderCell>
                            <CTableHeaderCell className="d-none d-sm-table-cell">{request.staffId}</CTableHeaderCell>
                            <CTableHeaderCell>{request.assetName}</CTableHeaderCell>
                            <CTableHeaderCell className="d-none d-sm-table-cell">{request.assetType}</CTableHeaderCell>
                            <CTableHeaderCell className="d-none d-sm-table-cell">{request.quantity}</CTableHeaderCell>
                            <CTableHeaderCell className="d-none d-md-table-cell">{request.purpose}</CTableHeaderCell>
                            <CTableHeaderCell className="d-none d-md-table-cell">{request.requestDate}</CTableHeaderCell>
                            <CTableHeaderCell>
                              <div className="d-flex flex-column flex-sm-row">
                                <CButton
                                  color="success"
                                  size="sm"
                                  className="mb-1 mb-sm-0 me-sm-2"
                                  onClick={() => handleApprove(request)}
                                >
                                  Approve
                                </CButton>
                                <CButton
                                  color="danger"
                                  size="sm"
                                  onClick={() => handleReject(request)}
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
            </CCol>
          </CRow>
        </CContainer>
      </div>

      {/* Inline CSS for mobile adjustments */}
      <style jsx>{`
        @media (max-width: 576px) {
          .container-fluid {
            padding-left: 5px !important;
            padding-right: 5px !important;
          }
          .card-body {
            padding: 5px !important;
          }
          th, td {
            font-size: 0.85rem;
            padding: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DepartmentHeadDashboard;