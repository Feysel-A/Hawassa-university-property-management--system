import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CAlert,
  CButton,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CSpinner,
  CFormInput,
} from "@coreui/react";
import Sidebar from "../../../../Components/Sidebar/Sidebar";

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState({
    totalAssets: 0,
    totalRequests: 0,
    totalApproved: 0,
    totalRejected: 0,
  });

  const [activeView, setActiveView] = useState("");
  const [details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/reports/statistics")
      .then((res) => res.json())
      .then((data) => setStatistics(data))
      .catch(() =>
        setAlertMessage("Failed to load statistics. Please try again.")
      );
  }, []);

  const fetchDetails = async (type) => {
    setActiveView(type);
    setLoading(true);
    setSearchTerm(""); // Reset search
    try {
      const res = await fetch(
        `http://localhost:5000/api/reports/details/${type}`
      );
      const data = await res.json();
      setDetails(data || []);
      setFilteredDetails(data || []);
    } catch (err) {
      setDetails([]);
      setFilteredDetails([]);
      setAlertMessage("Failed to fetch details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = details.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(term)
      )
    );
    setFilteredDetails(filtered);
  };

  const renderTable = () => {
    if (loading) {
      return (
        <div className="text-center py-3">
          <CSpinner color="primary" />
        </div>
      );
    }

    if (filteredDetails.length === 0) {
      return <p className="text-center text-muted">No records found.</p>;
    }

    const headers = Object.keys(filteredDetails[0]);

    return (
      <>
        <CFormInput
          className="mb-3"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              {headers.map((key) => (
                <CTableHeaderCell key={key}>{key}</CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredDetails.map((row, idx) => (
              <CTableRow key={idx}>
                {headers.map((key) => (
                  <CTableDataCell key={key}>{row[key]}</CTableDataCell>
                ))}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </>
    );
  };

  const cards = [
    {
      label: "Total Assets",
      count: statistics.totalAssets,
      color: "success",
      type: "assets",
    },
    {
      label: "Total Requests",
      count: statistics.totalRequests,
      color: "info",
      type: "requests",
    },
    {
      label: "Approved Requests",
      count: statistics.totalApproved,
      color: "primary",
      type: "approved",
    },
    {
      label: "Rejected Requests",
      count: statistics.totalRejected,
      color: "danger",
      type: "rejected",
    },
  ];

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar role="admin" />
      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
          <h2 className="text-center mb-4">Admin Dashboard</h2>
          {alertMessage && <CAlert color="danger">{alertMessage}</CAlert>}

          <CRow className="mb-4">
            {cards.map((card) => (
              <CCol key={card.type} md={6} lg={3}>
                <CCard
                  style={{
                    cursor: "pointer",
                    border:
                      activeView === card.type
                        ? `2px solid #${card.color}`
                        : "",
                    boxShadow:
                      activeView === card.type ? "0 0 10px #ccc" : "",
                  }}
                  onClick={() => fetchDetails(card.type)}
                >
                  <CCardHeader>{card.label}</CCardHeader>
                  <CCardBody>
                    <h3 className={`text-center text-${card.color}`}>
                      {card.count}
                    </h3>
                    <p className="text-center text-muted">{card.label}</p>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>

          {activeView && (
            <CRow>
              <CCol>
                <CCard>
                  <CCardHeader className="d-flex justify-content-between align-items-center">
                    <strong>
                      {activeView.charAt(0).toUpperCase() +
                        activeView.slice(1)}{" "}
                      Details
                    </strong>
                    <CButton
                      color="secondary"
                      size="sm"
                      onClick={() => {
                        setActiveView("");
                        setSearchTerm("");
                      }}
                    >
                      Close
                    </CButton>
                  </CCardHeader>
                  <CCardBody>{renderTable()}</CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </CContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
