import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useState } from "react";
import { AuthContextProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LearnerDashboard from "./pages/LearnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import CoursesPage from "./pages/CoursesPage";
import CVBuilderPage from "./pages/CVBuilderPage";
import MentorshipPage from "./pages/MentorshipPage";
import CertificatesPage from "./pages/CertificatesPage";
import JobsPage from "./pages/JobsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthContextProvider>
      <div className="app-shell">
        <header className="app-header">
          <Link to="/" className="brand">
            SheDigital
          </Link>
          <button
            className="mobile-menu-button"
            onClick={() => setMobileOpen((v) => !v)}
          >
            ☰
          </button>
          <nav className={`nav-links ${mobileOpen ? "open" : ""}`}>
            <Link to="/courses">Digital Skills</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/cv-builder">CV Builder</Link>
            <Link to="/mentorship">Mentorship</Link>
            <Link to="/notifications">Notifications</Link>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/learner"
              element={
                <ProtectedRoute role="learner">
                  <LearnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer"
              element={
                <ProtectedRoute role="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute roles={["learner", "employer", "admin"]}>
                  <JobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cv-builder"
              element={
                <ProtectedRoute>
                  <CVBuilderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentorship"
              element={
                <ProtectedRoute>
                  <MentorshipPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <CertificatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute roles={["learner", "employer", "admin"]}>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContextProvider>
  );
}

export default App;

