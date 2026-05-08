import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoSchool } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';

const loginHighlights = [
  'Jump back into your dashboard in one step.',
  'See study progress, assignments, and recordings in one place.',
  'Use the AI tutor without breaking your revision flow.',
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const DUMMY_CREDENTIALS = {
    email: 'student@mindforge.com',
    password: 'password123'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <aside className="login-aside">
          <span className="eyebrow">Member access</span>
          <div className="login-brand">
            <IoSchool />
            <span>MindForge Academy</span>
          </div>
          <h1>Welcome back to your study workspace.</h1>
          <p>
            Sign in to continue with mock tests, guided practice, live class updates, and your personal progress view.
          </p>
          <ul className="login-highlights">
            {loginHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Sign In</h2>
            <p>Use your student account to enter the dashboard.</p>
          </div>

          {error && <div className="login-error-message">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="login-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="login-submit">Continue to Dashboard</button>

            <div className="login-divider">or continue with</div>

            <button type="button" className="google-btn" onClick={() => navigate('/dashboard')}>
              <FcGoogle size={20} />
              Sign in with Google
            </button>
          </form>

          <p className="login-footer">
            Don&apos;t have an account? <Link to="/dashboard">Preview the dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
