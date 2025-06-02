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
  CBadge,
} from "@coreui/react";
import { Bar } from "react-chartjs-2";
import Sidebar from "../../../../Components/Sidebar/Sidebar";
import "@coreui/coreui/dist/css/coreui.min.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  const [statistics, setStatistics] = useState({
    totalAssets: 0,
    totalApprovedRequests: 0,
    totalPendingRequests: 0,
    stockInCost: 0,
    stockOutCost: 0,
  });
  const [chartData, setChartData] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reports/summary");
        const data = await res.json();
        setStatistics(data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load statistics. Please try again.");
      }
    };

    const fetchChart = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reports/chart-data");
        const data = await res.json();
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Monthly Requests",
              data: data.values,
              backgroundColor: "#003366",
            },
          ],
        });
      } catch (err) {
        console.error("Chart loading failed");
      }
    };

    fetchStatistics();
    fetchChart();
  }, []);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar role="manager" />
      <CContainer className="py-4 flex-grow-1">
        <CCard>
          <CCardHeader
            className="text-white text-center"
            style={{ backgroundColor: "#08194a" }}
          >
            <h3 style={{ color: "white" }}>
              Store Efficiency & Balance Report
            </h3>
          </CCardHeader>
          <CCardBody>
            {message && <CAlert color="danger">{message}</CAlert>}

            {/* Top Summary Cards */}
            <CRow className="mb-4">
              <CCol md={3}>
                <CCard>
                  <CCardBody className="text-center">
                    <h4>{statistics.totalAssets}</h4>
                    <CBadge color="success">Total Assets</CBadge>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={3}>
                <CCard>
                  <CCardBody className="text-center">
                    <h4>{statistics.totalApprovedRequests}</h4>
                    <CBadge color="primary">Approved Requests</CBadge>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={3}>
                <CCard>
                  <CCardBody className="text-center">
                    <h4>{statistics.totalPendingRequests}</h4>
                    <CBadge color="warning">Pending Requests</CBadge>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={3}>
                <CCard>
                  <CCardBody className="text-center">
                    <h4 className="text-success">
                      ETB {statistics.stockInCost.toLocaleString()}
                    </h4>
                    <CBadge color="info">Total Stock-In (Cost)</CBadge>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {/* Stock In vs Out Balance */}
            <CRow className="mb-4">
              <CCol md={6}>
                <CCard>
                  <CCardBody className="text-center">
                    <h4 className="text-success">
                      ETB {statistics.stockInCost.toLocaleString()}
                    </h4>
                    <p className="mb-0">Total Stock-In</p>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={6}>
                <CCard>
                  <CCardBody className="text-center">
                    <h4 className="text-danger">
                      ETB {statistics.stockOutCost.toLocaleString()}
                    </h4>
                    <p className="mb-0">Total Stock-Out</p>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {/* Chart */}
            <CRow className="mb-4">
              <CCol>
                {chartData.labels ? (
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                      },
                    }}
                  />
                ) : (
                  <p className="text-muted text-center">
                    Chart will be loaded here
                  </p>
                )}
              </CCol>
            </CRow>

            {/* Export Buttons */}
            <CRow className="text-center">
              <CCol>
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
