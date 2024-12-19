import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import PrivateRoutes from "./features/authorization/PrivateRoute";
import NewUsers from "./pages/master/NewUsers";

const AuthLayout = React.lazy(
  () => import("./features/layout/auth/AuthLayout"),
);
const HomeLayout = React.lazy(
  () => import("./features/layout/home/HomeLayout"),
);

const PageNotFound = React.lazy(() => import("@/pages/PageNotFound"));
const DomainLogin = React.lazy(() => import("@/pages/DomainLogin"));
const DomainRegister = React.lazy(() => import("@/pages/DomainRegister"));
const ForgotPassword = React.lazy(() => import("@/pages/ForgotPassword"));
const Success = React.lazy(() => import("@/pages/Success"));

// Master Routes

const MasterDashboard = React.lazy(() => import("@/pages/master/Dashboard"));


// AECT Routes

const AECTDashboard = React.lazy(() => import("@/pages/aect/Dashboard"));
const LogAect = React.lazy(() => import("@/pages/aect/LogAect"));
const ViewAect = React.lazy(() => import("@/pages/aect/ViewAect"));

function App() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100 ">
      <div className="relative w-[100vw]  h-[100vh]   shadow-lg border-[1px] border-gray-200">
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="auth" element={<AuthLayout />}>
            <Route index element={<DomainLogin />} />
            <Route path="domain-login" element={<DomainLogin />} />
            <Route path="register" element={<DomainRegister />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="success" element={<Success />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          <Route
            path="master"
            element={<PrivateRoutes outlet={<HomeLayout appId={1} />} />}
          >
            <Route index element={<MasterDashboard />} />
            <Route path="dashboard" element={<MasterDashboard />} />
         
            <Route path="new-users" element={<NewUsers />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route
            path="aect"
            element={<PrivateRoutes outlet={<HomeLayout appId={2} />} />}
          >
            <Route index element={<AECTDashboard />} />
            <Route path="dashboard" element={<AECTDashboard />} />
            <Route path="log-aect" element={<LogAect />} />
            <Route path="view-aect" element={<ViewAect />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
