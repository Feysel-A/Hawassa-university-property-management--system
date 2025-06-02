import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Unauthorized from "./Pages/Unauthorized/Unauthorized";
import Landing from "./Pages/Landing/Landing";
import Login from "./Pages/Login/Login";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

// Staff pages
import StaffDashboard from "./Pages/Admin/Staff/StaffDashboard/StaffDashboard";
import MyAssets from "./Pages/Admin/Staff/MyAssets/MyAssets";
import PendingRequests from "./Pages/Admin/Staff/PendingRequests/PendingRequests";
import RequestAssets from "./Pages/Admin/Staff/RequestAssets/RequestAssets";

// Department Head pages
import DepartmentHeadDashboard from "./Pages/Admin/Department/Dashboard/DepartmentHeadDashboard";
import PendingRequestsDh from "./Pages/Admin/Department/PendingRequestsDh/PendingRequestsDh";
import RequestAssetsForDH from "./Pages/Admin/Department/RequestAssets/RequestAssets";
import AvailableAssetsForDH from "./Pages/Admin/Department/AvailableAssets/AvailableAssets";
import MyAssetsForDH from "./Pages/Admin/Department/MyAssetsForDH/MyAssetsForDH";

// Manager pages
import ManagerDashboard from "./Pages/Admin/Manager/Dashboard/ManagerDashboard";
import RegisterAsset from "./Pages/Admin/Manager/AssetRegistration/AssetRegistration";
import AvailableAssets from "./Pages/Admin/Manager/AvailableAssets/AvailableAssets";
import ReportsPageForMn from "./Pages/Admin/Manager/ReportPage/ReportPage";

// StoreMan pages
import StoreManDashboard from "./Pages/Admin/StoreMan/StoreManDashboard/StoreManDashboard";
import AllRequests from "./Pages/Admin/StoreMan/AllRequests/AllRequests";
import ReturnedAssets from "./Pages/Admin/StoreMan/ReturnedAssets/ReturnedAssets";

// Admin pages
import AdminDashboard from "./Pages/Admin/Admin/Dashboard/AdminDashboard";
import UserRegistration from "./Pages/Admin/Admin/UserRegistration/UserRegistration";
import UserList from "./Pages/Admin/Admin/UserList/UserList";
import ReportsPage from "./Pages/Admin/Admin/ReportPage/ReportPage";

function Router() {
  return (
    <>
      <Header />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ==== Staff Routes ==== */}
        <Route
          path="/dashboard/staff"
          element={
            <ProtectedRoute allowedRoles={["Staff"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/staff/my-assets"
          element={
            <ProtectedRoute allowedRoles={["Staff"]}>
              <MyAssets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/staff/request"
          element={
            <ProtectedRoute allowedRoles={["Staff"]}>
              <RequestAssets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/staff/pending-requests"
          element={
            <ProtectedRoute allowedRoles={["Staff"]}>
              <PendingRequests />
            </ProtectedRoute>
          }
        />

        {/* ==== Department Head Routes ==== */}
        <Route
          path="/dashboard/department-head"
          element={
            <ProtectedRoute allowedRoles={["DepartmentHead"]}>
              <DepartmentHeadDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/department-head/available-assets"
          element={
            <ProtectedRoute allowedRoles={["DepartmentHead"]}>
              <AvailableAssetsForDH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/department-head/request"
          element={
            <ProtectedRoute allowedRoles={["DepartmentHead"]}>
              <RequestAssetsForDH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/department-head/pending-requests"
          element={
            <ProtectedRoute allowedRoles={["DepartmentHead"]}>
              <PendingRequestsDh />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/department-head/my-assets"
          element={
            <ProtectedRoute allowedRoles={["DepartmentHead"]}>
              <MyAssetsForDH />
            </ProtectedRoute>
          }
        />

        {/* ==== Manager Routes ==== */}
        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute allowedRoles={["StockManager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manager/register-asset"
          element={
            <ProtectedRoute allowedRoles={["StockManager"]}>
              <RegisterAsset />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manager/all-assets"
          element={
            <ProtectedRoute allowedRoles={["StockManager"]}>
              <AvailableAssets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manager/report"
          element={
            <ProtectedRoute allowedRoles={["StockManager"]}>
              <ReportsPageForMn />
            </ProtectedRoute>
          }
        />

        {/* ==== StoreMan Routes ==== */}
        <Route
          path="/dashboard/storeman"
          element={
            <ProtectedRoute allowedRoles={["StoreMan"]}>
              <StoreManDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/storeman/all-requests"
          element={
            <ProtectedRoute allowedRoles={["StoreMan"]}>
              <AllRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/storeman/returned-assets"
          element={
            <ProtectedRoute allowedRoles={["StoreMan"]}>
              <ReturnedAssets />
            </ProtectedRoute>
          }
        />

        {/* ==== Admin Routes ==== */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/register-user"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <UserRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/users"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/report"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* You can add a “catch-all” route here if you like, e.g. */}
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>

      <Footer />
    </>
  );
}

export default Router;
