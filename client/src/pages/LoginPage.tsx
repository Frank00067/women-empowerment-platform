import { FormEvent, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      const redirectTo = location.state?.from?.pathname || "/learner";
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p>Log in to continue your learning journey.</p>
        {error && <div className="error-banner">{error}</div>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

