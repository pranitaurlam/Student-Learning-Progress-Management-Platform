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
    const streamRef = useRef(null);

    useEffect(() => {
        const data = localStorage.getItem('mindforge_active_session');
        if (data) setSessionData(JSON.parse(data));

        // Initialize hardware stream
        const initStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Hardware access denied:", err);
                setIsCameraOn(false);
                setIsMicOn(false);
            }
        };

        initStream();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Handle toggles
    useEffect(() => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (videoTrack) videoTrack.enabled = isCameraOn;
            if (audioTrack) audioTrack.enabled = isMicOn;
        }
    }, [isCameraOn, isMicOn]);

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
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted // Always mute self-view to avoid feedback
                            className={`live-video-feed ${!isCameraOn ? 'hidden' : ''}`}
                        />

                        {!isCameraOn && (
                            <div className="camera-off-msg">
                                <div className="mentor-avatar-large">
                                    {sessionData?.topic?.[0] || "M"}
                                </div>
                                <FaVideoSlash size={30} style={{ marginTop: 20, opacity: 0.5 }} />
                                <p>Camera is turned off</p>
                            </div>
                        )}

                        <div className="video-ui-overlay">
                            <span className="live-badge">LIVE - {sessionData?.topic || "Session"}</span>
                        </div>
                    </div>

                    {/* Self View Mini (Optional for more complex UI, but kept simple here) */}
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
