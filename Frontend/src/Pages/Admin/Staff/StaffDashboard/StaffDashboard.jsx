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
  CFormInput,
  CFormSelect,
} from "@coreui/react";
import Sidebar from "../../../../Components/Sidebar/Sidebar";

const StaffDashboard = () => {
  const [availableAssets, setAvailableAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [requestMessage, setRequestMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const getUser = localStorage.getItem("user");
  useEffect(() => {
    if (getUser) setUser(JSON.parse(getUser));
  }, []);

  const staffId = user.id;
  const staffName = user.name;

  // Fetch assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/assets");
        setAvailableAssets(res.data);
        setFilteredAssets(res.data);
      } catch (err) {
        console.error("Error fetching assets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, [user]);

  // Filter/search logic
  useEffect(() => {
    let results = availableAssets;

    if (searchQuery) {
      results = results.filter((asset) =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType) {
      results = results.filter((asset) => asset.type === filterType);
    }

    setFilteredAssets(results);
  }, [searchQuery, filterType, availableAssets]);

  const handleQuantityChange = (assetId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [assetId]: parseInt(value) || 0,
    }));
  };

  const handleRequest = async (asset) => {
    const quantity = quantities[asset.id] || 1;
    if (quantity <= 0) {
      setRequestMessage("Please enter a valid quantity.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/requests", {
        employee_id: staffId,
        asset_id: asset.id,
        quantity,
        purpose: "Personal Use",
      });

      setRequestMessage(`Requested "${asset.name}" (x${quantity}) successfully!`);
      setTimeout(() => setRequestMessage(""), 3000);
    } catch (err) {
      console.error("Request failed:", err);
      setRequestMessage("Failed to request asset. Try again.");
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar role="staff" />

      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
          <CRow>
            <CCol>
              <h2 className="mb-1 text-dark">
                👋 Welcome back, <span className="text-primary">{staffName}</span>!
              </h2>
              <p className="text-muted">
                Here are the assets currently available to request.
              </p>
            </CCol>
          </CRow>

          {/* Filters */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                type="text"
                placeholder="🔍 Search asset by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </CCol>
            <CCol md={4}>
              <CFormSelect
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Fixed">Fixed</option>
                <option value="Consumable">Consumable</option>
              </CFormSelect>
            </CCol>
          </CRow>

          {requestMessage && (
            <CAlert color="info" className="mb-4">
              {requestMessage}
            </CAlert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p>Loading assets...</p>
            </div>
          ) : (
            <CRow>
              <CCol>
                <CCard>
                  <CCardHeader>
                    <h4 className="mb-0">📦 Available Assets</h4>
                  </CCardHeader>
                  <CCardBody>
                    <CTable hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>ID</CTableHeaderCell>
                          <CTableHeaderCell>Name</CTableHeaderCell>
                          <CTableHeaderCell>Type</CTableHeaderCell>
                          <CTableHeaderCell>Quantity</CTableHeaderCell>
                          <CTableHeaderCell>Action</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {filteredAssets.length > 0 ? (
                          filteredAssets.map((asset) => (
                            <CTableRow key={asset.id}>
                              <CTableHeaderCell>{asset.id}</CTableHeaderCell>
                              <CTableHeaderCell>{asset.name}</CTableHeaderCell>
                              <CTableHeaderCell>{asset.type}</CTableHeaderCell>
                              <CTableHeaderCell>
                                <input
                                  type="number"
                                  min="1"
                                  value={quantities[asset.id] || ""}
                                  onChange={(e) =>
                                    handleQuantityChange(asset.id, e.target.value)
                                  }
                                  placeholder="Qty"
                                  className="form-control form-control-sm"
                                  style={{ width: "90px" }}
                                />
                              </CTableHeaderCell>
                              <CTableHeaderCell>
                                <CButton
                                  color="primary"
                                  size="sm"
                                  onClick={() => handleRequest(asset)}
                                >
                                  Request
                                </CButton>
                              </CTableHeaderCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableHeaderCell colSpan={5} className="text-center">
                              No matching assets found.
                            </CTableHeaderCell>
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

export default StaffDashboard;
