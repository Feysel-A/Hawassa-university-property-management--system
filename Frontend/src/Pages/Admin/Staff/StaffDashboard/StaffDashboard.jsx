import React, { useState } from 'react';
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
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import Sidebar from '../../../../Components/Sidebar/Sidebar'; // Import the reusable Sidebar

const StaffDashboard = () => {
  const availableAssets = [
    { id: 1, name: 'Desktop PC', type: 'Fixed', status: 'Available' },
    { id: 2, name: 'Projector', type: 'Fixed', status: 'Available' },
    { id: 3, name: 'Printer Ink', type: 'Consumable', status: 'Available' },
  ];

  const [requestMessage, setRequestMessage] = useState('');

  const handleRequest = (asset) => {
    const requestData = {
      assetId: asset.id,
      assetName: asset.name,
      assetType: asset.type,
      quantity: 1,
      purpose: 'General use',
      requestDate: new Date().toISOString().split('T')[0],
      staffId: 'STAFF001',
    };
    console.log('Requesting asset:', requestData);
    setRequestMessage(`Requested ${asset.name} successfully!`);
    setTimeout(() => setRequestMessage(''), 3000);
  };

  return (
    <div className="min-vh-100 d-flex">
      {/* Pass role="staff" to Sidebar */}
      <Sidebar role="staff" />

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
          <CRow>
            <CCol>
              <h1 className="mb-4">Staff Dashboard</h1>
              <p className="text-muted">Welcome, [Username]! View and request available assets here.</p>
            </CCol>
          </CRow>

          {requestMessage && (
            <CAlert color="success" className="mb-4">
              {requestMessage}
            </CAlert>
          )}

          <CRow className="mb-4">
            <CCol>
              <CCard>
                <CCardHeader>
                  <h4 className="mb-0">Available Assets</h4>
                </CCardHeader>
                <CCardBody>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>ID</CTableHeaderCell>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {availableAssets.map((asset) => (
                        <CTableRow key={asset.id}>
                          <CTableHeaderCell>{asset.id}</CTableHeaderCell>
                          <CTableHeaderCell>{asset.name}</CTableHeaderCell>
                          <CTableHeaderCell>{asset.type}</CTableHeaderCell>
                          <CTableHeaderCell>
                            <CButton color="primary" size="sm" onClick={() => handleRequest(asset)}>
                              Request
                            </CButton>
                          </CTableHeaderCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  );
};

export default StaffDashboard;