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

  // Hide navbar in live room for immersive experience
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
      <div className="container">
        <NavLink to="/" className="navbar-logo">
          <IoSchool className="logo-icon" />
          MindForge Academy
        </NavLink>

        <button className="navbar-toggle" onClick={() => setOpen(!open)}>
          {open ? <HiX /> : <HiMenu />}
        </button>

        <div className={`navbar-links ${open ? 'open' : ''}`}>
          {!isStaffView ? (
            <>
              <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
              <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>
              <NavLink to="/ai-chat" onClick={() => setOpen(false)}>AI Doubt Chat</NavLink>
              <NavLink to="/messages" onClick={() => setOpen(false)}>Messages</NavLink>

              <Link to="/login" className="navbar-login-btn" onClick={() => setOpen(false)}>
                Sign In
              </Link>
              <button className="navbar-staff-btn" onClick={handleStaffLogin}>
                Staff Only
              </button>
            </>
          ) : (
            <>
              <span className="staff-badge">Staff Mode</span>
              <button className="navbar-staff-btn logout" onClick={handleStaffLogout}>
                Exit Staff Area
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
