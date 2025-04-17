import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CAlert,
} from "@coreui/react";
import Sidebar from "../../../../Components/Sidebar/Sidebar"; // Import reusable Sidebar
import "@coreui/coreui/dist/css/coreui.min.css";

const AdminDashboard = () => {
  // State for statistics
  const [statistics, setStatistics] = useState({
    totalAssets: 0,
    totalRequests: 0,
    totalApproved: 0,
    totalRejected: 0,
  });
  const [alertMessage, setAlertMessage] = useState("");

  // Fetch statistics from backend
  useEffect(() => {
    fetch("/api/admin/statistics") // Replace with actual backend endpoint
      .then((res) => res.json())
      .then((data) => setStatistics(data))
      .catch(() =>
        setAlertMessage("Failed to load statistics. Please try again later.")
      );
  }, []);

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar role="admin" />

      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
          <CRow>
            <CCol>
              <h1 className="mb-4">Admin Dashboard</h1>
              <p className="text-muted">
                Welcome, Admin! Here's an overview of key system metrics.
              </p>
            </CCol>
          </CRow>

          {alertMessage && <CAlert color="danger">{alertMessage}</CAlert>}

          <CRow>
            {/* Total Assets */}
            <CCol md={6} lg={3}>
              <CCard>
                <CCardHeader>Total Assets</CCardHeader>
                <CCardBody>
                  <h2 className="text-center text-success">
                    {statistics.totalAssets}
                  </h2>
                  <p className="text-center text-muted">Registered Assets</p>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Total Requests */}
            <CCol md={6} lg={3}>
              <CCard>
                <CCardHeader>Total Requests</CCardHeader>
                <CCardBody>
                  <h2 className="text-center text-info">
                    {statistics.totalRequests}
                  </h2>
                  <p className="text-center text-muted">Submitted Requests</p>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Approved Requests */}
            <CCol md={6} lg={3}>
              <CCard>
                <CCardHeader>Approved Requests</CCardHeader>
                <CCardBody>
                  <h2 className="text-center text-primary">
                    {statistics.totalApproved}
                  </h2>
                  <p className="text-center text-muted">Requests Approved</p>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Rejected Requests */}
            <CCol md={6} lg={3}>
              <CCard>
                <CCardHeader>Rejected Requests</CCardHeader>
                <CCardBody>
                  <h2 className="text-center text-danger">
                    {statistics.totalRejected}
                  </h2>
                  <p className="text-center text-muted">Requests Rejected</p>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* Charts Section */}
          <CRow className="mt-4">
            <CCol>
              <CCard>
                <CCardHeader>Activity Overview</CCardHeader>
                <CCardBody>
                  <p className="text-center">
                    Add your charts here for deeper insights (e.g., asset
                    trends, request statistics over time).
                  </p>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;