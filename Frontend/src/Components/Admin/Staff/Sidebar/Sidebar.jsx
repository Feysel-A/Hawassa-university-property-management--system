import React from "react";
import { CSidebar, CSidebarNav, CNavItem } from "@coreui/react";
import { NavLink } from "react-router-dom"; // Use NavLink directly
import "@coreui/coreui/dist/css/coreui.min.css";

const Sidebar = () => {
  return (
    <>
      <style>
        {`
    .nav-link:hover {
      background-color: #1A4F77 !important;
    }
  `}
      </style>
      <CSidebar
        style={{ backgroundColor: "#2D6CA2" }}
        visible={true}
        narrow={false}
      >
        <CSidebarNav>
          <CNavItem>
            <NavLink
              to="/dashboard/staff"
              className="nav-link text-white"
              activeClassName="active"
              style={({ isActive }) =>
                isActive ? { backgroundColor: "#1A4F77" } : {}
              }
            >
              Dashboard
            </NavLink>
          </CNavItem>
          <CNavItem>
            <NavLink
              to="/dashboard/staff/request"
              className="nav-link text-white"
              activeClassName="active"
              style={({ isActive }) =>
                isActive ? { backgroundColor: "#1A4F77" } : {}
              }
            >
              Request Assets
            </NavLink>
          </CNavItem>
          <CNavItem>
            <NavLink
              to="/dashboard/staff/my-assets"
              className="nav-link text-white"
              activeClassName="active"
              style={({ isActive }) =>
                isActive ? { backgroundColor: "#1A4F77" } : {}
              }
            >
              My Assets
            </NavLink>
          </CNavItem>
          <CNavItem>
            <NavLink
              to="/login"
              className="nav-link text-white"
              activeClassName="active"
              style={({ isActive }) =>
                isActive ? { backgroundColor: "#1A4F77" } : {}
              }
            >
              Logout
            </NavLink>
          </CNavItem>
        </CSidebarNav>
      </CSidebar>
    </>
  );
};

export default Sidebar;
