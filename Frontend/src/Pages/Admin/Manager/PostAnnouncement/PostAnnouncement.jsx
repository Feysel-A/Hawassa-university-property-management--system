import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CForm,
  CFormInput,
  CButton,
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
} from "@coreui/react";
import Sidebar from "../../../../Components/Sidebar/Sidebar";
import axios from "axios";

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      setMessage("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return setMessage("All fields are required.");

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/announcements/${editingId}`, form);
        setMessage("Announcement updated");
      } else {
        await axios.post("http://localhost:5000/api/announcements", form);
        setMessage("Announcement created");
      }
      fetchAnnouncements();
      setForm({ title: "", message: "" });
      setEditingId(null);
      setShowForm(false);
    } catch {
      setMessage("Failed to save announcement");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await axios.delete(`http://localhost:5000/api/announcements/${id}`);
        fetchAnnouncements();
        setMessage("Deleted successfully");
      } catch {
        setMessage("Delete failed");
      }
    }
  };

  const startEdit = (a) => {
    setForm({ title: a.title, message: a.message });
    setEditingId(a.id);
    setShowForm(true);
  };

  return (
    <div className="min-vh-100 d-flex">
      <Sidebar role="manager" />
      <div className="flex-grow-1 bg-light">
        <CContainer className="py-4">
          <CRow>
            <CCol>
              <h2 className="mb-4 text-center">📢 Manage Announcements</h2>
              {message && <CAlert color="info">{message}</CAlert>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol className="text-end">
              <CButton color="primary" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Hide Form" : "➕ New Announcement"}
              </CButton>
            </CCol>
          </CRow>

          {showForm && (
            <CRow>
              <CCol md={8} className="mx-auto">
                <CCard className="mb-4">
                  <CCardHeader>{editingId ? "Edit Announcement" : "New Announcement"}</CCardHeader>
                  <CCardBody>
                    <CForm onSubmit={handleSubmit}>
                      <CFormInput
                        label="Title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="mb-3"
                      />
                      <CFormInput
                        label="Message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="mb-3"
                      />
                      <CButton type="submit" color="success">
                        {editingId ? "Update" : "Post"}
                      </CButton>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}

          <CRow>
            <CCol>
              <CCard>
                <CCardHeader>📜 All Announcements</CCardHeader>
                <CCardBody>
                  {loading ? (
                    <div className="text-center">
                      <CSpinner color="primary" />
                    </div>
                  ) : announcements.length === 0 ? (
                    <p className="text-muted text-center">No announcements posted yet.</p>
                  ) : (
                    <CTable striped hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Title</CTableHeaderCell>
                          <CTableHeaderCell>Message</CTableHeaderCell>
                          <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {announcements.map((a, i) => (
                          <CTableRow key={a.id}>
                            <CTableDataCell>{i + 1}</CTableDataCell>
                            <CTableDataCell>{a.title}</CTableDataCell>
                            <CTableDataCell>{a.message}</CTableDataCell>
                            <CTableDataCell>
                              <CButton color="info" size="sm" className="me-2" onClick={() => startEdit(a)}>
                                ✏️ Edit
                              </CButton>
                              <CButton color="danger" size="sm" onClick={() => handleDelete(a.id)}>
                                🗑️ Delete
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  );
};

export default AnnouncementManager;
