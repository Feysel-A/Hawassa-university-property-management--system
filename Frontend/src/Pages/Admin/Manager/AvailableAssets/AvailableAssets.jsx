import React, { useEffect, useState } from "react";
import {
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
  CBadge,
  CAlert,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import Sidebar from "../../../../Components/Sidebar/Sidebar";

const AvailableAssets = () => {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Later you will replace this with fetch/axios call
    const fetchAssets = async () => {
      try {
        // Simulated fetch (replace this with API call)
        const mockAssets = [
          {
            id: 1,
            name: "Desktop PC",
            modelName: "Dell OptiPlex 7070",
            type: "Fixed",
            code: "PC-001",
            quantity: 10,
            cost: 1200.0,
            status: "Active",
          },
          {
            id: 2,
            name: "Printer Ink",
            modelName: "HP 61XL",
            type: "Consumable",
            code: "INK-002",
            quantity: 50,
            cost: 20.5,
            status: "Active",
          },
          {
            id: 3,
            name: "Old Projector",
            modelName: "Epson X1",
            type: "Fixed",
            code: "PROJ-003",
            quantity: 0,
            cost: 600,
            status: "Removed",
          },
        ];

        setAssets(mockAssets);
      } catch (err) {
        setError("Failed to load assets.");
      }
    };

    fetchAssets();
  }, []);

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar role="manager" />
      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
         

          {error && <CAlert color="danger">{error}</CAlert>}

          <CCard className="shadow-sm">
            <CCardHeader
              className=" text-white"
              style={{ backgroundColor: "#08194a" }}
            >
              <h3 style={{ color: "white", textAlign: "center" }}>
                Assets List
              </h3>
            </CCardHeader>
            <CCardBody>
              <CTable responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Model</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Code</CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                    <CTableHeaderCell>Cost</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {assets.map((asset) => (
                    <CTableRow key={asset.id}>
                      <CTableHeaderCell>{asset.id}</CTableHeaderCell>
                      <CTableHeaderCell>{asset.name}</CTableHeaderCell>
                      <CTableHeaderCell>{asset.modelName}</CTableHeaderCell>
                      <CTableHeaderCell>{asset.type}</CTableHeaderCell>
                      <CTableHeaderCell>{asset.code}</CTableHeaderCell>
                      <CTableHeaderCell>{asset.quantity}</CTableHeaderCell>
                      <CTableHeaderCell>${asset.cost}</CTableHeaderCell>
                      <CTableHeaderCell>
                        <CBadge
                          color={
                            asset.status === "Active"
                              ? "success"
                              : asset.status === "Removed"
                              ? "danger"
                              : "secondary"
                          }
                        >
                          {asset.status}
                        </CBadge>
                      </CTableHeaderCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CContainer>
      </div>
    </div>
  );
};

export default AvailableAssets;
