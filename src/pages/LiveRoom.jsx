import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash,
    FaPhoneSlash, FaUsers, FaRegCommentDots, FaExpand
} from 'react-icons/fa';
import './LiveRoom.css';

export default function LiveRoom() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [sessionData, setSessionData] = useState(null);
    const [participants, setParticipants] = useState([
        { name: "Academy Mentor (You)", role: "Instructor", isMe: true },
        { name: "Rahul V.", role: "Student" },
        { name: "Priya K.", role: "Student" },
    ]);
    const videoRef = useRef(null);

    useEffect(() => {
        const data = localStorage.getItem('mindforge_active_session');
        if (data) setSessionData(JSON.parse(data));

        // Background stream simulation logic
        if (isCameraOn && videoRef.current) {
            // In a real app, use navigator.mediaDevices.getUserMedia
            // Here we just simulate visual feedback
        }
    }, [sessionId, isCameraOn]);

    const handleEndSession = () => {
        if (window.confirm("Are you sure you want to end this session?")) {
            localStorage.removeItem('mindforge_active_session');
            navigate('/staff');
        }
    };

    return (
        <div className="live-room-page">
            <div className="room-container">
                {/* Main Video Area */}
                <div className="video-viewport">
                    <div className={`video-placeholder ${!isCameraOn ? 'dark' : ''}`}>
                        {isCameraOn ? (
                            <div className="simulated-video">
                                <div className="video-ui-overlay">
                                    <span className="live-badge">LIVE - {sessionData?.topic || "Session"}</span>
                                </div>
                                <div className="mentor-avatar-large">
                                    {sessionData?.topic?.[0] || "M"}
                                </div>
                            </div>
                        ) : (
                            <div className="camera-off-msg">
                                <FaVideoSlash size={50} />
                                <p>Camera is turned off</p>
                            </div>
                        )}
                    </div>

                    {/* Self View Mini */}
                    <div className="self-view">
                        <div className="self-video-box">
                            {isCameraOn ? "Camera On" : <FaVideoSlash />}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="room-sidebar">
                    <div className="sidebar-header">
                        <h3><FaUsers /> Participants ({participants.length})</h3>
                    </div>
                    <div className="participant-list">
                        {participants.map((p, idx) => (
                            <div key={idx} className="participant-item">
                                <div className="p-avatar">{p.name[0]}</div>
                                <div className="p-info">
                                    <span className="p-name">{p.name}</span>
                                    <span className="p-role">{p.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="chat-mini-section">
                        <div className="sidebar-header">
                            <h3><FaRegCommentDots /> Live Chat</h3>
                        </div>
                        <div className="chat-placeholder">
                            <p>Chat is enabled during the session.</p>
                        </div>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="controls-bar">
                    <div className="room-info-mini">
                        <strong>{sessionData?.subject || "Academy"}</strong>
                        <span>{sessionData?.topic || "Live Class"}</span>
                    </div>

                    <div className="central-controls">
                        <button
                            className={`control-btn ${!isMicOn ? 'off' : ''}`}
                            onClick={() => setIsMicOn(!isMicOn)}
                            title={isMicOn ? "Mute" : "Unmute"}
                        >
                            {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
                        </button>

                        <button
                            className={`control-btn ${!isCameraOn ? 'off' : ''}`}
                            onClick={() => setIsCameraOn(!isCameraOn)}
                            title={isCameraOn ? "Stop Video" : "Start Video"}
                        >
                            {isCameraOn ? <FaVideo /> : <FaVideoSlash />}
                        </button>

                        <button className="control-btn end-btn" onClick={handleEndSession} title="End Session">
                            <FaPhoneSlash />
                        </button>
                    </div>

                    <div className="utility-controls">
                        <button className="icon-btn"><FaExpand /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
