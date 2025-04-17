import React, { useState, useEffect } from "react";
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
  CButton,
  CFormInput,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CSpinner,
  CAlert,
} from "@coreui/react";
import Sidebar from "../../../../Components/Sidebar/Sidebar";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users");
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter on search and role
  useEffect(() => {
    const filtered = users.filter((user) => {
      return (
        (search === "" ||
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())) &&
        (roleFilter === "" || user.role === roleFilter)
      );
    });
    setFilteredUsers(filtered);
  }, [search, roleFilter, users]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      await fetch(`http://localhost:5000/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedUser.name,
          email: selectedUser.email,
        }),
      });
      setEditModalVisible(false);
      window.location.reload();
    } catch (err) {
      console.error("Edit error", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`http://localhost:5000/api/users/${id}`, {
          method: "DELETE",
        });
        window.location.reload();
      } catch (err) {
        console.error("Delete error", err);
      }
    }
  };

  return (
    <div className="d-flex min-vh-100">
      <Sidebar role="admin" />

      <CContainer className="py-4 flex-grow-1">
        <CCard>
          <CCardHeader className="bg-dark text-white">
            <h3 className="text-center text-white">User Management</h3>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex justify-content-between mb-3">
              <CFormInput
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-50"
              />
              <CFormSelect
                className="w-25"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Filter by Role</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
                <option value="Manager">Manager</option>
                <option value="DepartmentHead">Department Head</option>
              </CFormSelect>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <CSpinner />
              </div>
            ) : filteredUsers.length === 0 ? (
              <CAlert color="warning">No users found.</CAlert>
            ) : (
              <CTable striped hover responsive bordered>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell>Department</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Created</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredUsers.map((user, index) => (
                    <CTableRow key={user.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{user.name}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={
                            user.role === "Admin" ? "primary" : "secondary"
                          }
                        >
                          {user.role}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{user.department}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>{user.created_at}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CContainer>

      {/* Edit Modal */}
      <CModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      >
        <CModalHeader>Edit User</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Name</CFormLabel>
            <CFormInput
              value={selectedUser?.name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, name: e.target.value })
              }
            />
            <CFormLabel className="mt-3">Email</CFormLabel>
            <CFormInput
              value={selectedUser?.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSaveEdit}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default UserList;
