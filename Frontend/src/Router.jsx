import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Login from "./Pages/Login/Login";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import StaffDashboard from "./Pages/Admin/Staff/StaffDashboard/StaffDashboard";
import MyAssets from "./Pages/Admin/Staff/MyAssets/MyAssets";
import PendingRequests from "./Pages/Admin/Staff/PendingRequests/PendingRequests";
import RequestAssets from "./Pages/Admin/Staff/RequestAssets/RequestAssets";
import ManagerDashboard from "./Pages/Admin/Manager/Dashboard/ManagerDashboard";
import DepartmentHeadDashboard from "./Pages/Admin/Department/Dashboard/DepartmentHeadDashboard";
import PendingRequestsDh from  "./Pages/Admin/Department/PendingRequestsDh/PendingRequestsDh";
import AdminDashboard from "./Pages/Admin/Admin/Dashboard/AdminDashboard";
import UserRegistration from "./Pages/Admin/Admin/UserRegistration/UserRegistration";
import UserList from "./Pages/Admin/Admin/UserList/UserList";
import ReportsPage from "./Pages/Admin/ReportPage/ReportPage";
import RegisterAsset from "./Pages/Admin/Manager/AssetRegistration/AssetRegistration";
import AvailableAssets from "./Pages/Admin/Manager/AvailableAssets/AvailableAssets";
import RequestAssetsForDH from "./Pages/Admin/Department/RequestAssets/RequestAssets";
import AvailableAssetsForDH from "./Pages/Admin/Department/AvailableAssets/AvailableAssets";
import MyAssetsForDH from "./Pages/Admin/Department/MyAssetsForDH/MyAssetsForDH";
import ReportsPageForMn from "./Pages/Admin/ReportPage/ReportPage";
import StoreManDashboard from "./Pages/Admin/StoreMan/StoreManDashboard/StoreManDashboard";
import AllRequests from "./Pages/Admin/StoreMan/AllRequests/AllRequests";
function Router() {
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("User role:", user?.role);
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/staff" element={<StaffDashboard />} />
        <Route path="/dashboard/staff/my-assets" element={<MyAssets />} />
        <Route
          path="/dashboard/staff/request"
          element={<RequestAssets />}
        />{" "}
        <Route
          path="/dashboard/staff/pending-requests"
          element={<PendingRequests />}
        />
        {/* department head dashboard */}
        <Route
          path="/dashboard/department-head/my-assets"
          element={<MyAssetsForDH />}
        />
        <Route path="/dashboard/department-head/pending-requests" element={<PendingRequestsDh />} />
        <Route
          path="/dashboard/department-head"
          element={<DepartmentHeadDashboard />}
        />
        <Route
          path="/dashboard/department-head/available-assets"
          element={<AvailableAssetsForDH />}
        />
        <Route
          path="/dashboard/department-head/request"
          element={<RequestAssetsForDH />}
        />
        {/* manager dashboard */}
        <Route path="/dashboard/manager" element={<ManagerDashboard />} />
        <Route
          path="/dashboard/manager/register-asset"
          element={<RegisterAsset />}
        />
        <Route
          path="/dashboard/manager/all-assets"
          element={<AvailableAssets />}
        />
        <Route
          path="/dashboard/manager/report"
          element={<ReportsPageForMn />}
        />
        {/* <Route path="/dashboard/manager/report" element={<ReportsPage />} /> */}
        {/* Store man dashboard */}
        <Route path="/dashboard/storeman" element={<StoreManDashboard />} />
        <Route
          path="/dashboard/storeman/all-requests"
          element={<AllRequests />}
        />
        {/* admin dashboard */}
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route
          path="/dashboard/admin/register-user"
          element={<UserRegistration />}
        />
        <Route path="/dashboard/admin/users" element={<UserList />} />
        <Route path="/dashboard/admin/report" element={<ReportsPage />} />
        {/* Temp redirect */}
      </Routes>
      <Footer />
    </>
  );
}

export default Router;
