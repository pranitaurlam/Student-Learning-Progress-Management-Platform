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
} from 'react-icons/fa';
import './Home.css';

const features = [
    {
        icon: <MdQuiz />,
        title: 'Practice Questions',
        desc: 'Access thousands of questions across multiple topics and difficulty levels',
    },
    {
        icon: <FaTrophy />,
        title: 'Mock Tests',
        desc: 'Take timed mock tests to prepare for your exams with real-time scoring',
    },
    {
        icon: <FaChartLine />,
        title: 'Progress Tracking',
        desc: 'Monitor your learning journey with detailed analytics and insights',
    },
    {
        icon: <MdSupportAgent />,
        title: 'Mentor Support',
        desc: 'Get personalized guidance from experienced mentors',
    },
    {
        icon: <FaUsers />,
        title: 'Collaborative Learning',
        desc: 'Join a community of learners and grow together',
    },
    {
        icon: <FaMedal />,
        title: 'Gamification',
        desc: 'Stay motivated with daily streaks, points, and achievements',
    },
];

export default function Home() {
    return (
        <div className="home-page">
            {/* Hero */}
            <section className="home-hero">
                <div className="container">
                    <h1 className="hero-title">Master Your Learning Journey</h1>
                    <p className="hero-subtitle">
                        Practice, test, and track your progress with MindForge Academy's
                        comprehensive educational platform
                    </p>
                    <div className="hero-buttons">
                        <Link to="/dashboard">
                            <button className="btn-primary">Get Started Free</button>
                        </Link>
                        <Link to="/dashboard">
                            <button className="btn-secondary">Sign In</button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Everything You Need to Succeed</h2>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div className="feature-card" key={i}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-banner">
                    <h2>Ready to Transform Your Learning?</h2>
                    <p>Join thousands of students already using MindForge Academy</p>
                    <Link to="/dashboard">
                        <button className="btn-cta">Start Learning Today</button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
