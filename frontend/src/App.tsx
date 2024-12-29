import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import PrivateRoutes from "./features/authorization/PrivateRoute";
import AssignPDC from "./pages/sis/AssignPDC";
import ActionTaken from "./pages/sis/ActionTaken";
import LogIms from "./pages/ims/LogIms";
import ViewIms from "./pages/ims/ViewIms";
import TeamFormation from "./pages/ims/TeamFormation";
import CloseIncident from "./pages/ims/CloseIncident";
import CategorizeIncident from "./pages/ims/CategorizeIncident";
import IncidentInvestigation from "./pages/ims/IncidentInvestigation";
import Users from "./pages/master/Users";
import CloseRecommendation from "./pages/ims/CloseRecommendation";

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
const ContextDefinations = React.lazy(
  () => import("@/pages/master/ContextDefinations"),
);

// SIS Routes

const LogSis = React.lazy(() => import("@/pages/sis/LogSis"));
const ViewSio = React.lazy(() => import("@/pages/sis/ViewSio"));
const LogPtw = React.lazy(() => import("@/pages/ptw/LogPtw"));
const ViewPtw = React.lazy(() => import("@/pages/ptw/ViewPtw"));
const ApprovePtw = React.lazy(() => import("@/pages/ptw/ApprovePtw"));

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
            element={<PrivateRoutes outlet={<HomeLayout appId={0} />} />}
          >
            <Route index element={<MasterDashboard />} />
            <Route path="dashboard" element={<MasterDashboard />} />
            <Route path="users" element={<Users />} />
            <Route
              path="context-definations"
              element={<ContextDefinations />}
            />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route
            path="sio"
            element={<PrivateRoutes outlet={<HomeLayout appId={2} />} />}
          >
            <Route index element={<LogSis />} />
            <Route path="dashboard" element={<LogSis />} />
            <Route path="log-sio" element={<LogSis />} />
            <Route path="view-sio" element={<ViewSio />} />
            <Route path="assign-pdc" element={<AssignPDC />} />
            <Route path="action-taken" element={<ActionTaken />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          <Route
            path="ptw"
            element={<PrivateRoutes outlet={<HomeLayout appId={3} />} />}
          >
            <Route index element={<LogPtw />} />
            <Route path="dashboard" element={<LogPtw />} />
            <Route path="log-ptw" element={<LogPtw />} />
            <Route path="view-ptw" element={<ViewPtw />} />
            <Route path="approve-ptw" element={<ApprovePtw />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route
            path="ims"
            element={<PrivateRoutes outlet={<HomeLayout appId={4} />} />}
          >
            <Route index element={<LogIms />} />
            <Route path="dashboard" element={<LogIms />} />
            <Route path="log-ims" element={<LogIms />} />
            <Route path="view-ims" element={<ViewIms />} />
            <Route path="team-formation" element={<TeamFormation />} />
            <Route path="close-incident" element={<CloseIncident />} />
            <Route
              path="incident-categorization"
              element={<CategorizeIncident />}
            />
            <Route
              path="incident-investigation"
              element={<IncidentInvestigation />}
            />
            <Route
              path="close-recommendation"
              element={<CloseRecommendation />}
            />
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
