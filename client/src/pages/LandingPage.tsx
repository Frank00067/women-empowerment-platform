import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <section className="landing">
      <div className="hero">
        <h1>Empowering Young African Women in Digital Skills</h1>
        <p>
          Learn Microsoft Word, Excel, CV writing, and job readiness skills in
          one accessible platform created for you.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="primary-btn">
            Get Started
          </Link>
          <Link to="/login" className="secondary-btn">
            I already have an account
          </Link>
        </div>
      </div>
      <div className="hero-cards">
        <div className="hero-card">
          <h3>Digital Skills</h3>
          <p>Step-by-step Word and Excel lessons with practice exercises.</p>
        </div>
        <div className="hero-card">
          <h3>Career Growth</h3>
          <p>CV builder, interview tips, and job application guidance.</p>
        </div>
        <div className="hero-card">
          <h3>Mentorship</h3>
          <p>Connect with mentors and explore curated opportunities.</p>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;

