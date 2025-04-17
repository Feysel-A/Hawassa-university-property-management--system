import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CButton,
  CAlert,
} from "@coreui/react";
import { Bar } from "react-chartjs-2";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import "@coreui/coreui/dist/css/coreui.min.css";

const ReportsPage = () => {
  const [statistics, setStatistics] = useState({
    totalAssets: 0,
    totalApprovedRequests: 0,
    totalPendingRequests: 0,
    stockIn: 0,
    stockOut: 0,
  });
  const [message, setMessage] = useState("");
  const [chartData, setChartData] = useState({});

  // Fetch statistics and chart data from backend
  useEffect(() => {
    fetch("/api/admin/statistics") // Replace with actual endpoint
      .then((res) => res.json())
      .then((data) => setStatistics(data))
      .catch(() =>
        setMessage("Failed to load statistics. Please try again later.")
      );

    fetch("/api/admin/chart-data") // Replace with actual endpoint
      .then((res) => res.json())
      .then((data) =>
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Requests Trend",
              data: data.values,
              backgroundColor: "#08194a",
            },
          ],
        })
      );
  }, []);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar role="manager" />
      <CContainer className="py-4 flex-grow-1">
        <CCard>
          <CCardHeader
            className="text-center text-white"
            style={{ backgroundColor: "#08194a" }}
          >
            <h3>Reports</h3>
          </CCardHeader>
          <CCardBody>
            {message && <CAlert color="danger">{message}</CAlert>}
            <CRow className="mb-4">
              <CCol md={3}>
                <CCard>
                  <CCardBody>
                    <h4 className="text-center text-success">
                      {statistics.totalAssets}
                    </h4>
                    <p className="text-center">Total Assets</p>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={3}>
                <CCard>
                  <CCardBody>
                    <h4 className="text-center text-primary">
                      {statistics.totalApprovedRequests}
                    </h4>
                    <p className="text-center">Approved Requests</p>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={3}>
                <CCard>
                  <CCardBody>
                    <h4 className="text-center text-warning">
                      {statistics.totalPendingRequests}
                    </h4>
                    <p className="text-center">Pending Requests</p>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={3}>
                <CCard>
                  <CCardBody>
                    <h4 className="text-center text-info">
                      {statistics.stockIn}
                    </h4>
                    <p className="text-center">Stock-In Transactions</p>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {/* Charts */}
            <CRow className="mb-4">
              {/* <CCol>
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                  }}
                />
              </CCol> */}
            </CRow>

            {/* Export Buttons */}
            <CRow>
              <CCol className="text-center">
                <CButton color="primary" className="me-3">
                  Download PDF
                </CButton>
                <CButton color="success" className="me-3">
                  Export to Excel
                </CButton>
                <CButton color="info">Export to CSV</CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default ReportsPage;
