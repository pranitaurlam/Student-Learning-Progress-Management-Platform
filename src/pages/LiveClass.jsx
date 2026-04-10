import React from 'react';
import { FaVideo, FaCalendarAlt, FaClock, FaUserTie, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './LiveClass.css';

const UPCOMING_CLASSES = [
    {
        id: 1,
        title: "Deep Learning Architectures",
        instructor: "Prof. Sarah Johnson",
        time: "10:30 AM - 12:00 PM",
        date: "Today",
        status: "Live Now",
        link: "#"
    },
    {
        id: 2,
        title: "Advanced Data Structures",
        instructor: "Dr. Robert Smith",
        time: "02:00 PM - 03:30 PM",
        date: "Today",
        status: "Starting in 2h",
        link: "#"
    },
    {
        id: 3,
        title: "React Performance Optimization",
        instructor: "Alex Chen",
        time: "11:00 AM - 12:30 PM",
        date: "Tomorrow",
        status: "Scheduled",
        link: "#"
    }
];

export default function LiveClass() {
    const navigate = useNavigate();

    return (
        <div className="live-class-page">
            <div className="live-class-header">
                <div className="container header-content">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        <FaArrowLeft /> Back to Dashboard
                    </button>
                    <h1>🎥 Live Classes</h1>
                    <p>Connect with your mentors in real-time interactive sessions.</p>
                </div>
            </div>

            <div className="container live-class-content">
                <div className="class-grid">
                    {UPCOMING_CLASSES.map(cls => (
                        <div key={cls.id} className={`class-card ${cls.status === 'Live Now' ? 'live' : ''}`}>
                            <div className="class-card-header">
                                <span className={`status-tag ${cls.status.toLowerCase().replace(' ', '-')}`}>
                                    {cls.status === 'Live Now' && <span className="live-pulse"></span>}
                                    {cls.status}
                                </span>
                                <FaVideo className="video-icon" />
                            </div>

                            <h2 className="class-title">{cls.title}</h2>

                            <div className="class-info">
                                <div className="info-item">
                                    <FaUserTie /> <span>{cls.instructor}</span>
                                </div>
                                <div className="info-item">
                                    <FaCalendarAlt /> <span>{cls.date}</span>
                                </div>
                                <div className="info-item">
                                    <FaClock /> <span>{cls.time}</span>
                                </div>
                            </div>

                            <button className="join-btn" disabled={cls.status !== 'Live Now'}>
                                {cls.status === 'Live Now' ? 'Join Class Now' : 'Remind Me'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="live-class-empty">
                    <h3>Looking for past sessions?</h3>
                    <p>Visit the "Study Material" section to view recorded lectures and class notes.</p>
                    <button onClick={() => navigate('/dashboard')} className="secondary-btn">Go to Study Center</button>
                </div>
            </div>
        </div>
    );
}
