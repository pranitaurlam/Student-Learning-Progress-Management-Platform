import React, { useState, useEffect } from 'react';
import { FaVideo, FaCalendarAlt, FaClock, FaUserTie, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './LiveClass.css';

export default function LiveClass() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const loadClasses = () => {
            try {
                const stored = localStorage.getItem('mindforge_timetable');
                if (stored) {
                    const data = JSON.parse(stored);
                    // Add some status logic for demo purposes
                    const enriched = data.map((cls, idx) => ({
                        ...cls,
                        instructor: "Academy Mentor", // In a real app, this would come from the timetable data
                        date: "Today",
                        status: idx === 0 ? "Live Now" : "Scheduled",
                        link: "#"
                    }));
                    setClasses(enriched);
                }
            } catch (e) {
                console.error("Failed to load timetable", e);
            }
        };

        loadClasses();
        // Poll for changes
        const interval = setInterval(loadClasses, 2000);
        return () => clearInterval(interval);
    }, []);

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

                                <button className="join-btn" disabled={cls.status !== 'Live Now'}>
                                    {cls.status === 'Live Now' ? 'Join Class Now' : 'Remind Me'}
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
