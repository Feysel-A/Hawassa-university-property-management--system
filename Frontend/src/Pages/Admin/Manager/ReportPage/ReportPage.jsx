import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CAlert,
  CBadge,
} from "@coreui/react";
import Sidebar from "../../../../Components/Sidebar/Sidebar";

const ReportsPage = () => {
  const [report, setReport] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reports/enhanced-report");
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error("Error loading report:", err);
        setMessage("Failed to load report. Please try again.");
      }
    };
    fetchReport();
  }, []);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar role="manager" />
      <CContainer className="py-4 flex-grow-1">
        <CCard>
          <CCardHeader className="text-white text-center" style={{ backgroundColor: "#08194a" }}>
            <h4>📊 Asset Efficiency & Balance Report</h4>
          </CCardHeader>
          <CCardBody>
            {message && <CAlert color="danger">{message}</CAlert>}

            <CRow className="mb-4 text-center">
              <CCol md={4}>
                <CCard>
                  <CCardBody>
                    <h5>{report.totalAssets}</h5>
                    <CBadge color="success">Total Assets</CBadge>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={4}>
                <CCard>
                  <CCardBody>
                    <h5>{report.totalApproved}</h5>
                    <CBadge color="primary">Approved Requests</CBadge>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={4}>
                <CCard>
                  <CCardBody>
                    <h5>{report.totalPending}</h5>
                    <CBadge color="warning">Pending Requests</CBadge>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CRow className="mb-4 text-center">
              <CCol md={6}>
                <CCard>
                  <CCardBody>
                    <h5 className="text-success">
                      ETB {report.totalStockInCost?.toLocaleString()}
                    </h5>
                    <p>💼 Total Stock-In Value</p>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={6}>
                <CCard>
                  <CCardBody>
                    <h5 className="text-danger">
                      ETB {report.totalStockOutCost?.toLocaleString()}
                    </h5>
                    <p>📤 Total Stock-Out Value</p>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CRow>
              <CCol>
                <CCard>
                  <CCardBody className="text-center">
                    <h4
                      className={`${
                        report.balance > 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      ETB {report.balance?.toLocaleString()}
                    </h4>
                    <CBadge color={report.balance > 0 ? "info" : "danger"}>
                      Store Balance Value
                    </CBadge>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default ReportsPage;
