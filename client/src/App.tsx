import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useState } from "react";
import { AuthContextProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LearnerDashboard from "./pages/LearnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CoursesPage from "./pages/CoursesPage";
import CVBuilderPage from "./pages/CVBuilderPage";
import MentorshipPage from "./pages/MentorshipPage";
import CertificatesPage from "./pages/CertificatesPage";
import ProtectedRoute from "./components/ProtectedRoute";

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
            <Link to="/cv-builder">CV Builder</Link>
            <Link to="/mentorship">Mentorship</Link>
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
              path="/courses"
              element={
                <ProtectedRoute>
                  <CoursesPage />
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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </AuthContextProvider>
  );
}

export default App;

