import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaSyncAlt, FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaUsers } from 'react-icons/fa';
import { MdScreenShare, MdExitToApp } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import './StudyRoom.css';

const PEERS = [
    { id: 1, name: 'Ananya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
    { id: 2, name: 'Rahul Varma', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
    { id: 3, name: 'Sneha Patel', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
    { id: 4, name: 'Aditya Raj', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
];

export default function StudyRoom() {
    const navigate = useNavigate();
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);

    // Stopwatch Logic
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Camera Logic
    const toggleCamera = async () => {
        if (isCameraOn) {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            setStream(null);
            setIsCameraOn(false);
        } else {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(newStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                }
                setIsCameraOn(true);
            } catch (err) {
                console.error("Camera access denied:", err);
                alert("Please allow camera access to join the study room.");
            }
        }
    };

    useEffect(() => {
        if (isCameraOn && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [isCameraOn, stream]);

    const handleExit = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        navigate('/dashboard');
    };

    return (
        <div className="study-room-page">
            <div className="study-container">
                {/* Header Section */}
                <header className="study-header">
                    <div className="room-info">
                        <div className="status-dot"></div>
                        <h1>Combined Study Session #104</h1>
                        <span className="participant-count"><FaUsers /> 5 Online</span>
                    </div>

                    <div className="stopwatch-container">
                        <div className="stopwatch-display">{formatTime(time)}</div>
                        <div className="stopwatch-controls">
                            <button onClick={() => setIsRunning(!isRunning)} className={isRunning ? 'pause' : 'play'}>
                                {isRunning ? <FaPause /> : <FaPlay />}
                            </button>
                            <button onClick={() => { setTime(0); setIsRunning(false); }} className="reset">
                                <FaSyncAlt />
                            </button>
                        </div>
                    </div>

                    <button className="exit-btn" onClick={handleExit}>
                        <MdExitToApp /> Exit Room
                    </button>
                </header>

                {/* Video Grid Section */}
                <main className="video-grid">
                    {/* User Video */}
                    <div className={`video-card profile ${isCameraOn ? 'active' : ''}`}>
                        <div className="video-wrapper">
                            {isCameraOn ? (
                                <video ref={videoRef} autoPlay playsInline muted className="local-video" />
                            ) : (
                                <div className="video-placeholder">
                                    <div className="avatar-large">PA</div>
                                    <p>You (Pranita)</p>
                                </div>
                            )}
                        </div>
                        <div className="peer-label">You (Host)</div>
                    </div>

                    {/* Peer Videos */}
                    {PEERS.map(peer => (
                        <div key={peer.id} className="video-card peer">
                            <div className="video-wrapper">
                                <img src={peer.avatar} alt={peer.name} className="peer-avatar-video" />
                                <div className="simulated-stream-overlay">
                                    <div className="pulse"></div>
                                    <span>LIVE</span>
                                </div>
                            </div>
                            <div className="peer-label">{peer.name}</div>
                        </div>
                    ))}
                </main>

                {/* Floating Controls Section */}
                <footer className="study-controls">
                    <button className={`control-btn ${!isCameraOn ? 'off' : ''}`} onClick={toggleCamera}>
                        {isCameraOn ? <FaVideo /> : <FaVideoSlash />}
                        <span>Camera</span>
                    </button>
                    <button className={`control-btn ${isMuted ? 'off' : ''}`} onClick={() => setIsMuted(!isMuted)}>
                        {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                        <span>Mic</span>
                    </button>
                    <button className="control-btn">
                        <MdScreenShare />
                        <span>Share</span>
                    </button>
                </footer>
            </div>
        </div>
    );
}
