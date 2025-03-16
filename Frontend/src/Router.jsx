import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Login from "./Pages/Login/Login";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import StaffDashboard from "./Components/Admin/Staff/StaffDashboard/StaffDashboard";
import MyAssets from "./Components/Admin/Staff/MyAssets/MyAssets";
import RequestAssets from "./Components/Admin/Staff/RequestAssets/RequestAssets";

function Router() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/staff" element={<StaffDashboard />} />
        <Route path="/dashboard/staff/my-assets" element={<MyAssets />} />
        {/* Add placeholder for Request Assets later */}
        <Route
          path="/dashboard/staff/request"
          element={<RequestAssets />}
        />{" "}
        {/* Temp redirect */}
      </Routes>
      <Footer />
    </>
  );
}

export default Router;
