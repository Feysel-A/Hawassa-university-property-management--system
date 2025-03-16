import React from "react";
import { CSidebar, CSidebarNav, CNavItem } from "@coreui/react";
import { NavLink } from "react-router-dom";
import { CIcon } from "@coreui/icons-react";
import {
  cilSpeedometer, // Dashboard icon
  cilList, // Request Assets icon
  cilFolder, // My Assets icon
  cilArrowRight, // Logout icon
} from "@coreui/icons";
import "@coreui/coreui/dist/css/coreui.min.css";

const Sidebar = ({ role, visible, overlaid }) => {
  // Role-based links with icons
  const staffLinks = [
    { to: "/dashboard/staff", label: "Dashboard", icon: cilSpeedometer },
    { to: "/dashboard/staff/request", label: "Request Assets", icon: cilList },
    { to: "/dashboard/staff/my-assets", label: "My Assets", icon: cilFolder },
  ];

  const departmentHeadLinks = [
    { to: "/dashboard/department-head", label: "Dashboard", icon: cilSpeedometer },
  ];

  const managerLinks = [
    { to: "/dashboard/manager", label: "Dashboard", icon: cilSpeedometer },
  ];

  // Select links based on role
  let links = [];
  if (role === "staff") links = staffLinks;
  else if (role === "department_head") links = departmentHeadLinks;
  else if (role === "manager") links = managerLinks;

  return (
    <CSidebar
      narrow={true} // Slimmer sidebar
      visible={visible}
      overlaid={overlaid}
      style={{
        backgroundColor: "#2D6CA2",
        width: "200px", // Fixed width (narrower than default ~250px)
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)", // Subtle shadow
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.3s ease", // Smooth toggle animation
      }}
    >
      <CSidebarNav className="pt-3">
        {links.map((link, index) => (
          <CNavItem key={index}>
            <NavLink
              to={link.to}
              className="nav-link text-white d-flex align-items-center"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#1A4F77" : "transparent",
                padding: "10px 15px",
                borderRadius: "5px",
                margin: "5px 10px",
                transition: "background-color 0.2s ease",
              })}
            >
              <CIcon icon={link.icon} className="me-2" size="lg" />
              {link.label}
            </NavLink>
          </CNavItem>
        ))}
      </CSidebarNav>
      <CSidebarNav className="pb-3">
        <CNavItem>
          <NavLink
            to="/login"
            className="nav-link text-white d-flex align-items-center"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#1A4F77" : "transparent",
              padding: "10px 15px",
              borderRadius: "5px",
              margin: "5px 10px",
              transition: "background-color 0.2s ease",
            })}
          >
            <CIcon icon={cilArrowRight} className="me-2" size="lg" />
            Logout
          </NavLink>
        </CNavItem>
      </CSidebarNav>

      {/* Inline CSS for hover effects */}
      <style jsx>{`
        .nav-link:hover {
          background-color: #1A4F77 !important;
        }
        @media (max-width: 991px) {
          .c-sidebar {
            width: 180px !important; // Slightly narrower on mobile overlay
          }
        }
      `}</style>
    </CSidebar>
  );
};

export default Sidebar;