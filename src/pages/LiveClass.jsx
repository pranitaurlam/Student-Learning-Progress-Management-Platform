import React, { useState, useEffect } from 'react';
import { FaVideo, FaCalendarAlt, FaClock, FaUserTie, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './LiveClass.css';

export default function LiveClass() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [activeSession, setActiveSession] = useState(null);

    useEffect(() => {
        const loadClasses = () => {
            try {
                // Load Timetable
                const storedTt = localStorage.getItem('mindforge_timetable');
                const storedActive = localStorage.getItem('mindforge_active_session');

                let timetable = [];
                if (storedTt) timetable = JSON.parse(storedTt);

                let active = null;
                if (storedActive) active = JSON.parse(storedActive);
                setActiveSession(active);

                // Enriched classes
                const enriched = timetable.map((cls) => ({
                    ...cls,
                    instructor: "Academy Mentor",
                    date: "Today",
                    status: active && active.id === cls.id ? "Live Now" : "Scheduled",
                    link: "#"
                }));
                setClasses(enriched);
            } catch (e) {
                console.error("Failed to load timetable", e);
            }
        };

        loadClasses();
        const interval = setInterval(loadClasses, 2000);
        return () => clearInterval(interval);
    }, []);

    const joinClass = (cls) => {
        navigate(`/live-room/${cls.id}`);
    };

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
                {classes.length > 0 ? (
                    <div className="class-grid">
                        {classes.map(cls => (
                            <div key={cls.id} className={`class-card ${cls.status === 'Live Now' ? 'live' : ''}`}>
                                <div className="class-card-header">
                                    <span className={`status-tag ${cls.status.toLowerCase().replace(' ', '-')}`}>
                                        {cls.status === 'Live Now' && <span className="live-pulse"></span>}
                                        {cls.status}
                                    </span>
                                    <FaVideo className="video-icon" />
                                </div>

                                <h2 className="class-title">{cls.topic}</h2>
                                <p className="class-subject-tag">{cls.subject}</p>

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

                                <button
                                    className="join-btn"
                                    disabled={cls.status !== 'Live Now'}
                                    onClick={() => joinClass(cls)}
                                >
                                    {cls.status === 'Live Now' ? 'Join Class Now' : 'Wait for Mentor'}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="live-class-empty">
                        <FaCalendarAlt size={50} style={{ opacity: 0.2, marginBottom: 20 }} />
                        <h3>No classes scheduled yet</h3>
                        <p>Check back later or visit the "Study Material" section for recorded sessions.</p>
                        <button onClick={() => navigate('/dashboard')} className="secondary-btn">Go to Dashboard</button>
                    </div>
                )}
            </div>
        </div>
    );
}
