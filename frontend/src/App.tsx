import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import GroupsPage from "./pages/GroupsPage";
import ChallengesPage from "./pages/ChallengesPage";
import LogActionPage from "./pages/LogActionPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import HomePage from "./pages/HomePage";
import RequireAuth from "./auth/RequireAuth";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/" element={<HomePage />} />

      {/* App (logged-in area) */}
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="challenges" element={<ChallengesPage />} />
          <Route path="log-action" element={<LogActionPage />} />
          <Route path="leaderboards" element={<LeaderboardsPage />} />
          <Route index element={<Navigate to="/app/dashboard" replace />} />
        </Route>
      </Route>

      {/* Default */}
      {/*<Route path="/" element={<Navigate to="/login" replace />} /> */}
      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  );
}
