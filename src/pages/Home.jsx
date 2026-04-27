
import { Link } from 'react-router-dom';
import {
    MdQuiz,
    MdSupportAgent,
} from 'react-icons/md';
import {
    FaTrophy,
    FaChartLine,
    FaUsers,
    FaMedal,
    FaArrowRight,
    FaUserGraduate,
    FaBook,
    FaStar,
} from 'react-icons/fa';
import './Home.css';

const features = [
    {
        icon: <MdQuiz />,
        title: 'Practice Questions',
        desc: 'Access thousands of questions across multiple topics and difficulty levels',
        color: '#a855f7',
    },
    {
        icon: <FaTrophy />,
        title: 'Mock Tests',
        desc: 'Take timed mock tests to prepare for your exams with real-time scoring',
        color: '#ec4899',
    },
    {
        icon: <FaChartLine />,
        title: 'Progress Tracking',
        desc: 'Monitor your learning journey with detailed analytics and insights',
        color: '#ec4899',
    },
    {
        icon: <MdSupportAgent />,
        title: 'Mentor Support',
        desc: 'Get personalized guidance from experienced mentors whenever you need',
        color: '#22c55e',
    },
    {
        icon: <FaUsers />,
        title: 'Collaborative Learning',
        desc: 'Join a community of learners and grow together through discussion and sharing',
        color: '#f97316',
    },
    {
        icon: <FaMedal />,
        title: 'Gamification',
        desc: 'Stay motivated with daily streaks, points, and exciting achievements',
        color: '#eab308',
    },
];

export default function Home() {
    return (
        <div className="home-page">
            {/* Hero */}
            <section className="home-hero cinematic-hero">
                <div className="container hero-content">
                    {/* LEFT SIDE TEXT */}
                    <div className="hero-text">
                        <div className="hero-badge">
                            <span>✦</span> Your Journey to Excellence Starts Here
                        </div>
                        <h1 className="hero-title">
                            <span className="hero-title-white">Master Your</span>
                            <br />
                            <span className="hero-title-pink">Learning Journey</span>
                        </h1>
                        <p className="hero-subtitle">
                            Practice, test, and track your progress with MindForge Academy's
                            comprehensive educational platform
                        </p>
                        <div className="hero-buttons">
                            <Link to="/register">
                                <button className="btn-primary">Get Started Free <FaArrowRight style={{display:'inline', marginLeft:6}} /></button>
                            </Link>
                            <Link to="/login">
                                <button className="btn-secondary">Sign In</button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <FaUserGraduate className="stat-icon" />
                                <div>
                                    <div className="stat-number">50K+</div>
                                    <div className="stat-label">Active Students</div>
                                </div>
                            </div>
                            <div className="hero-stat">
                                <FaBook className="stat-icon" />
                                <div>
                                    <div className="stat-number">10K+</div>
                                    <div className="stat-label">Practice Questions</div>
                                </div>
                            </div>
                            <div className="hero-stat">
                                <FaStar className="stat-icon" />
                                <div>
                                    <div className="stat-number">95%</div>
                                    <div className="stat-label">Success Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE IMAGE */}
                    <div className="hero-image-container">
                        <img
                            src="/home-study.png"
                            alt="Student learning online"
                            className="hero-image"
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">
                        <span className="section-title-deco">——→</span>
                        Everything You Need to Succeed
                        <span className="section-title-deco">←——</span>
                    </h2>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div className="feature-card" key={i}>
                                <div className="feature-card-left">
                                    <div className="feature-icon" style={{ color: f.color, background: `${f.color}22` }}>
                                        {f.icon}
                                    </div>
                                </div>
                                <div className="feature-card-body">
                                    <h3>{f.title}</h3>
                                    <p>{f.desc}</p>
                                </div>
                                <div className="feature-card-arrow">
                                    <FaArrowRight />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-banner">
                    <div className="cta-left-art">🚀</div>
                    <div className="cta-text">
                        <h2>Ready to Transform Your Learning?</h2>
                        <p>Join thousands of students already using MindForge Academy</p>
                        <Link to="/register">
                            <button className="btn-cta">Start Learning Today <FaArrowRight style={{display:'inline', marginLeft:6}} /></button>
                        </Link>
                    </div>
                    <div className="cta-right-art">🎓</div>
                </div>
            </section>
        </div>
    );
}