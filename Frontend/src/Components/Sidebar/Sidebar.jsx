import React from "react";
import { CSidebar, CSidebarNav, CNavItem } from "@coreui/react";
import { NavLink } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import {
  cilSpeedometer,
  cilList,
  cilFolder,
  cilArrowRight,
  cilStorage,
  cilLibraryAdd,
  cilUserPlus,
  cilPeople,
  cilLibrary,
  cilPlus,
} from "@coreui/icons";
import "@coreui/coreui/dist/css/coreui.min.css";

const Sidebar = ({ role, visible, overlaid }) => {
  const staffLinks = [
    { to: "/dashboard/staff", label: "Dashboard", icon: cilSpeedometer },
    {
      to: "/dashboard/staff/request",
      label: "Request New",
      icon: cilLibrary,
    },
    {
      to: "/dashboard/staff/pending-requests",
      label: "Pending Requests",
      icon: cilList,
    },
    {
      to: "/dashboard/staff/my-assets",
      label: "My Assets",
      icon: cilFolder,
    },
  ];

  const departmentHeadLinks = [
    {
      to: "/dashboard/department-head",
      label: "Dashboard",
      icon: cilSpeedometer,
    },
    {
      to: "/dashboard/department-head/available-assets",
      label: "Available Assets",
      icon: cilStorage,
    },
    {
      to: "/dashboard/department-head/request",
      label: "Request New",
      icon: cilLibraryAdd,
    },
    {
      to: "/dashboard/department-head/pending-requests",
      label: "My Requests",
      icon: cilList,
    },
    {
      to: "/dashboard/department-head/my-assets",
      label: "My Assets",
      icon: cilFolder,
    },
  ];

  const managerLinks = [
    {
      to: "/dashboard/manager",
      label: "Dashboard",
      icon: cilSpeedometer,
    },
    {
      to: "/dashboard/manager/register-asset",
      label: "Register Asset",
      icon: cilPlus, // Replaces cilUserPlus
    },
    {
      to: "/dashboard/manager/all-assets",
      label: "Manage Assets",
      icon: cilStorage, // Better fits for inventory/assets
    },
    {
      to: "/dashboard/manager/report",
      label: "Report",
      icon: cilLibrary,
    },
    {
      to: "/dashboard/manager/post-announcement",
      label: "Post Announcement",
      icon: cilLibraryAdd, // You can choose another if needed
    },
  ];

  const adminLinks = [
    { to: "/dashboard/admin", label: "Dashboard", icon: cilSpeedometer },
    {
      to: "/dashboard/admin/register-user",
      label: "Register User",
      icon: cilUserPlus,
    },
    { to: "/dashboard/admin/users", label: "Manage Users", icon: cilPeople },
    { to: "/dashboard/admin/report", label: "Report", icon: cilLibrary },
  ];
  const storemanLink = [
    { to: "/dashboard/storeman", label: "Dashboard", icon: cilSpeedometer },
    {
      to: "/dashboard/storeman/all-requests",
      label: "Requests",
      icon: cilList,
    },
    {
      to: "/dashboard/storeman/returned-assets",
      label: "Returned Assets",
      icon: cilFolder, // 📂 Good for return confirmation
    },
  ];
  let links = [];

  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === "staff") links = staffLinks;
  else if (normalizedRole === "department_head") links = departmentHeadLinks;
  else if (normalizedRole === "admin") links = adminLinks;
  else if (normalizedRole === "manager") links = managerLinks;
  else if (normalizedRole === "storeman") links = storemanLink;
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  return (
    <CSidebar
      narrow
      visible={visible}
      overlaid={overlaid}
      style={{
        backgroundColor: "#08194a",
        width: "220px",
        boxShadow: "2px 0 10px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease-in-out",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <CSidebarNav className="pt-4">
        {links.map((link, index) => (
          <CNavItem key={index}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center text-white ${
                  isActive ? "active-link" : ""
                }`
              }
              style={{
                padding: "12px 20px",
                margin: "8px 10px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "500",
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
            >
              <CIcon icon={link.icon} className="me-3" size="lg" />
              {link.label}
            </NavLink>
          </CNavItem>
        ))}
      </CSidebarNav>

      {/* Footer section */}
      <CSidebarNav className="pb-4 mt-auto">
        <CNavItem>
          <NavLink
            to="/login"
            className="nav-link d-flex align-items-center text-white"
            style={{
              backgroundColor: "#d9534f",
              margin: "10px 15px",
              padding: "12px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "15px",
              transition: "background-color 0.2s ease",
            }}
            onClick={handleLogout}
          >
            <CIcon icon={cilArrowRight} className="me-3" />
            Logout
          </NavLink>
        </CNavItem>
      </CSidebarNav>

      {/* Inline styling for active & hover effects */}
      <style jsx="true">{`
        .nav-link:hover {
          background-color: #1a4f77 !important;
        }
        .active-link {
          background-color: #1a4f77 !important;
        }
        @media (max-width: 991px) {
          .c-sidebar {
            width: 180px !important;
          }
        }
      `}</style>
    </CSidebar>
  );
};

export default Sidebar;
