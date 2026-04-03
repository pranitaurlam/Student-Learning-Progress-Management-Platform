import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { IoSchool } from 'react-icons/io5';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
          <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>
          <NavLink to="/ai-chat" onClick={() => setOpen(false)}>AI Doubt Chat</NavLink>
          <NavLink to="/study-room" onClick={() => setOpen(false)}>Study Room</NavLink>
          <NavLink to="/messages" onClick={() => setOpen(false)}>Messages</NavLink>

          <Link to="/login" className="navbar-login-btn" onClick={() => setOpen(false)}>
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
