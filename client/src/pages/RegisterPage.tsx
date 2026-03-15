import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ name, email, password });
      navigate("/learner", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        <p>Join a community of young African women building digital skills.</p>
        {error && <div className="error-banner">{error}</div>}
        <label>
          Full name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
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
            minLength={6}
          />
        </label>
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
        <p className="auth-footer">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;

