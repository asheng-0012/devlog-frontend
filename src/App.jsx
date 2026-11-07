import { Routes, Route } from "react-router-dom";
import withAuth from "./hoc/withAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Submissions from "./pages/Submissions";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";

// HOC applied once here: each page becomes login-only
const ProtectedHome = withAuth(Home);
const ProtectedProblems = withAuth(Problems);
const ProtectedProblemDetail = withAuth(ProblemDetail);
const ProtectedSubmissions = withAuth(Submissions);
const ProtectedLeaderboard = withAuth(Leaderboard);
const ProtectedSettings = withAuth(Settings);
const ProtectedChangePassword = withAuth(ChangePassword);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/home" element={<ProtectedHome />} />
      <Route path="/problems" element={<ProtectedProblems />} />
      <Route path="/problems/:id" element={<ProtectedProblemDetail />} />
      <Route path="/submissions" element={<ProtectedSubmissions />} />
      <Route path="/leaderboard" element={<ProtectedLeaderboard />} />
      <Route path="/settings" element={<ProtectedSettings />} />
      <Route path="/profile" element={<ProtectedSettings />} />
      <Route path="/change-password" element={<ProtectedChangePassword />} />
    </Routes>
  );
}