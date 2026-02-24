import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoSchool } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple demo — navigate to dashboard on submit
        navigate('/dashboard');
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <IoSchool />
                    MindForge Academy
                </div>
                <h1>Welcome Back</h1>
                <p className="login-subtitle">Sign in to continue your learning journey</p>

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

                    <button type="submit" className="login-submit">Sign In</button>

                    <div className="login-divider">or continue with</div>

                    <button type="button" className="google-btn" onClick={() => navigate('/dashboard')}>
                        <FcGoogle size={20} />
                        Sign in with Google
                    </button>
                </form>

                <p className="login-footer">
                    Don't have an account? <Link to="/dashboard">Sign up for free</Link>
                </p>
            </div>
        </div>
    );
}
