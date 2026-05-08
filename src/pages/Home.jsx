import { Link } from 'react-router-dom';
import { MdQuiz, MdSupportAgent } from 'react-icons/md';
import { FaTrophy, FaChartLine, FaUsers, FaMedal } from 'react-icons/fa';
import './Home.css';

const features = [
  {
    icon: <MdQuiz />,
    title: 'Practice Questions',
    desc: 'Move through topic-wise drills with clean progression and quick retries when you need reps.',
  },
  {
    icon: <FaTrophy />,
    title: 'Mock Tests',
    desc: 'Simulate the real exam rhythm with timed runs, scoring feedback, and momentum tracking.',
  },
  {
    icon: <FaChartLine />,
    title: 'Progress Tracking',
    desc: 'See what is improving, where your accuracy drops, and which subjects need another pass.',
  },
  {
    icon: <MdSupportAgent />,
    title: 'AI Tutor',
    desc: 'Get guided explanations fast when you are stuck instead of breaking your study flow.',
  },
  {
    icon: <FaUsers />,
    title: 'Live Learning',
    desc: 'Join sessions, revisit recordings, and stay close to your mentors and peer cohort.',
  },
  {
    icon: <FaMedal />,
    title: 'Student Motivation',
    desc: 'Streaks, points, and milestones keep the work feeling active and worth returning to daily.',
  },
];

const heroStats = [
  { value: '4', label: 'Core study modes' },
  { value: '24/7', label: 'On-demand AI help' },
  { value: '1', label: 'Focused student workspace' },
];

export default function Home() {
  const isLoggedIn = localStorage.getItem('mindforge_is_logged_in') === 'true';
  const dashboardLink = isLoggedIn ? '/dashboard' : '/login';

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Built for serious study</span>
            <h1 className="hero-title">A sharper learning workspace for students who want momentum.</h1>
            <p className="hero-subtitle">
              MindForge Academy brings mock tests, guided practice, AI support, and class resources into one
              focused command center.
            </p>

            <div className="hero-buttons">
              <Link to={dashboardLink} className="button-primary">Open Dashboard</Link>
              {!isLoggedIn && <Link to="/login" className="button-ghost">Sign In</Link>}
            </div>

            <div className="hero-stats">
              {heroStats.map((item) => (
                <div key={item.label} className="hero-stat">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-preview">
            <div className="hero-preview-card top">
              <span className="preview-kicker">Today&apos;s rhythm</span>
              <h3>Study with structure, not just tabs.</h3>
              <ul>
                <li>Mock test performance snapshots</li>
                <li>Assignments, timetable, and recordings</li>
                <li>Fast jump into AI tutor and practice mode</li>
              </ul>
            </div>

            <div className="hero-preview-card bottom">
              <div>
                <span className="preview-kicker">What students need</span>
                <p>Less clutter. Better visibility. A UI that helps you start the next useful thing quickly.</p>
              </div>
              <span className="preview-pulse" />
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Platform highlights</span>
              <h2>Everything students reach for most, arranged with more clarity.</h2>
            </div>
            <p>We keep the visual language tight and the interactions simple so the study flow stays in front.</p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-banner">
            <div>
              <span className="eyebrow">Ready to begin</span>
              <h2>Open the student dashboard and get into the work.</h2>
            </div>
            <Link to={dashboardLink} className="button-primary">Enter Study Center</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
