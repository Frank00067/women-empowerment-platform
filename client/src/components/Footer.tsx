import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand">SheDigital</div>
          <p className="footer-muted">
            Digital skills, career growth, and job opportunities for young African
            women.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <div className="footer-title">Platform</div>
            <Link to="/courses">Courses</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/cv-builder">CV Builder</Link>
            <Link to="/mentorship">Mentorship</Link>
          </div>
          <div>
            <div className="footer-title">Account</div>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/notifications">Notifications</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SheDigital. All rights reserved.</span>
        <span className="footer-muted">
          Built for Women Empowerment & Job Creation in Africa.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

