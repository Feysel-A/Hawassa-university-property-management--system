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
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import Sidebar from '../Sidebar/Sidebar';

const MyAssets = () => {
  // Mock data for my assets (replace with backend fetch later)
  const myAssets = [
    { id: 4, name: 'Laptop', type: 'Fixed', issuedDate: '2025-03-01' },
    { id: 5, name: 'Projector', type: 'Fixed', issuedDate: '2025-03-01' },
  ];

  return (
    <div className="min-vh-100 d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
          <CRow>
            <CCol>
              <h1 className="mb-4">My Assets</h1>
              <p className="text-muted">View and manage your issued assets here.</p>
            </CCol>
          </CRow>

          {/* My Assets */}
          <CRow>
            <CCol>
              <CCard>
                <CCardHeader>
                  <h4 className="mb-0">My Assets</h4>
                </CCardHeader>
                <CCardBody>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>ID</CTableHeaderCell>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Issued Date</CTableHeaderCell>
                        <CTableHeaderCell>Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {myAssets.map((asset) => (
                        <CTableRow key={asset.id}>
                          <CTableHeaderCell>{asset.id}</CTableHeaderCell>
                          <CTableHeaderCell>{asset.name}</CTableHeaderCell>
                          <CTableHeaderCell>{asset.type}</CTableHeaderCell>
                          <CTableHeaderCell>{asset.issuedDate}</CTableHeaderCell>
                          <CTableHeaderCell>
                            <CButton color="warning" size="sm" onClick={() => alert(`Returning ${asset.name}`)}>
                              Return
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

export default MyAssets;