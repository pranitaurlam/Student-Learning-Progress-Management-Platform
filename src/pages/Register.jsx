import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaArrowRight,
    FaEye,
    FaEyeSlash,
    FaUserGraduate,
} from 'react-icons/fa';
import './Register.css';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: connect to your auth logic
        console.log('Register submitted:', formData);
    };

    return (
        <div className="register-page">
            {/* Background blobs */}
            <div className="reg-blob reg-blob-1" />
            <div className="reg-blob reg-blob-2" />

            <div className="register-card">
                {/* Logo / Brand */}
                <div className="reg-brand">
                    <FaUserGraduate className="reg-brand-icon" />
                    <span className="reg-brand-name">MindForge Academy</span>
                </div>

                <div className="reg-header">
                    <h1 className="reg-title">Create Your Account</h1>
                    <p className="reg-subtitle">
                        Start your journey to excellence today — it's free
                    </p>
                </div>

                <form className="reg-form" onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div className="reg-field">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="reg-field">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="reg-field">
                        <label htmlFor="password">Password</label>
                        <div className="reg-input-wrap">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="reg-eye"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="reg-field">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="reg-input-wrap">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="reg-eye"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="reg-btn-primary">
                        Create Account <FaArrowRight style={{ display: 'inline', marginLeft: 6 }} />
                    </button>
                </form>

                {/* Divider */}
                <div className="reg-divider">
                    <span />
                    <p>Already have an account?</p>
                    <span />
                </div>

                {/* Sign In Link */}
                <Link to="/login" className="reg-btn-secondary">
                    Sign In
                </Link>
            </div>
        </div>
    );
}
