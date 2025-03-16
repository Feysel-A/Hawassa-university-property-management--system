import React from 'react';
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
import Sidebar from '../Sidebar/Sidebar';

const StaffDashboard = () => {
  // Mock data for available assets (replace with backend fetch later)
  const availableAssets = [
    { id: 1, name: 'Desktop PC', type: 'Fixed', status: 'Available' },
    { id: 2, name: 'Projector', type: 'Fixed', status: 'Available' },
    { id: 3, name: 'Printer Ink', type: 'Consumable', status: 'Available' },
  ];

  // State for request feedback
  const [requestMessage, setRequestMessage] = React.useState('');

  // Handle request button click
  const handleRequest = (asset) => {
    const requestData = {
      assetId: asset.id,
      assetName: asset.name,
      assetType: asset.type,
      quantity: 1, // Default for now
      purpose: 'General use', // Default, editable in RequestAssets.js
      requestDate: new Date().toISOString().split('T')[0], // Current date
      staffId: 'STAFF001', // Placeholder from login
    };
    // Simulate backend request (replace with fetch/axios later)
    console.log('Requesting asset:', requestData);
    setRequestMessage(`Requested ${asset.name} successfully!`);
    setTimeout(() => setRequestMessage(''), 3000); // Clear after 3s
  };

  return (
    <div className="min-vh-100 d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
          <CRow>
            <CCol>
              <h1 className="mb-4">Staff Dashboard</h1>
              <p className="text-muted">Welcome, [Username]! View and request available assets here.</p>
            </CCol>
          </CRow>

          {/* Request Feedback */}
          {requestMessage && (
            <CAlert color="success" className="mb-4">
              {requestMessage}
            </CAlert>
          )}

          {/* Available Assets */}
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