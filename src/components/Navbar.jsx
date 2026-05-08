import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { IoSchool } from 'react-icons/io5';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isStaffView = location.pathname === '/staff';
  const isLiveRoom = location.pathname.startsWith('/live-room');
  const isLoggedIn = localStorage.getItem('mindforge_is_logged_in') === 'true';

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('mindforge_is_logged_in');
      navigate('/');
    }
  };

  if (isLiveRoom) return null;

  const handleStaffLogin = () => {
    const password = prompt('Enter Staff Password:');
    if (password === 'Mentors@polaris123') {
      setOpen(false);
      navigate('/staff');
    } else if (password !== null) {
      alert('Incorrect password. Access denied.');
    }
  };

  const handleStaffLogout = () => {
    if (window.confirm('Log out from staff area?')) {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-shell">
        <NavLink to="/" className="navbar-logo">
          <span className="navbar-logo-mark">
            <IoSchool className="logo-icon" />
          </span>
          <span className="navbar-logo-copy">
            <span className="navbar-logo-kicker">Student Portal</span>
            <span className="navbar-logo-title">MindForge Academy</span>
          </span>
        </NavLink>

        <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <HiX /> : <HiMenu />}
        </button>

        <div className={`navbar-links ${open ? 'open' : ''}`}>
          {!isStaffView ? (
            <>
              <div className="navbar-link-group">
                <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
                <NavLink to={isLoggedIn ? "/dashboard" : "/login"} onClick={() => setOpen(false)}>Dashboard</NavLink>
                <NavLink to={isLoggedIn ? "/ai-chat" : "/login"} onClick={() => setOpen(false)}>AI Tutor</NavLink>
                <NavLink to={isLoggedIn ? "/focus" : "/login"} onClick={() => setOpen(false)}>Focus</NavLink>
                <NavLink to={isLoggedIn ? "/messages" : "/login"} onClick={() => setOpen(false)}>Messages</NavLink>
              </div>

              <div className="navbar-actions">
                <button className="navbar-staff-btn" onClick={handleStaffLogin}>
                  Staff Only
                </button>
                {isLoggedIn ? (
                  <button className="navbar-logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                ) : (
                  <Link to="/login" className="navbar-login-btn" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="navbar-actions staff-actions">
              <span className="staff-badge">Staff Mode</span>
              <button className="navbar-staff-btn logout" onClick={handleStaffLogout}>
                Exit Staff Area
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
