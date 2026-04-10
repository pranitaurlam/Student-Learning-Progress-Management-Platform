import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash,
    FaPhoneSlash, FaUsers, FaRegCommentDots, FaExpand, FaDesktop
} from 'react-icons/fa';
import './LiveRoom.css';

export default function LiveRoom() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [sessionData, setSessionData] = useState(null);
    const [participants, setParticipants] = useState([
        { name: "Academy Mentor (You)", role: "Instructor", isMe: true },
        { name: "Rahul V.", role: "Student" },
        { name: "Priya K.", role: "Student" },
    ]);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const screenStreamRef = useRef(null);

    useEffect(() => {
        const data = localStorage.getItem('mindforge_active_session');
        if (data) setSessionData(JSON.parse(data));

        initStream();

        return () => {
            stopAllStreams();
        };
    }, []);

    const stopAllStreams = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
        }
    };

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

            // Audio Metering
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateMeter = () => {
                if (!streamRef.current && !screenStreamRef.current) return;
                analyser.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((p, c) => p + c, 0) / dataArray.length;
                setAudioLevel(avg);
                requestAnimationFrame(updateMeter);
            };
            updateMeter();
        } catch (err) {
            console.error("Hardware access denied:", err);
            setIsCameraOn(false);
            setIsMicOn(false);
        }
    };

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                screenStreamRef.current = screenStream;
                if (videoRef.current) {
                    videoRef.current.srcObject = screenStream;
                }
                setIsScreenSharing(true);

                // Handle stop sharing from browser UI
                screenStream.getVideoTracks()[0].onended = () => {
                    stopScreenShare();
                };
            } catch (err) {
                console.error("Screen share failed:", err);
            }
        } else {
            stopScreenShare();
        }
    };

    const stopScreenShare = () => {
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }
        if (videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
        setIsScreenSharing(false);
    };

    // Handle Mic/Camera Toggles
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
                    <div className={`video-placeholder ${!isCameraOn && !isScreenSharing ? 'dark' : ''}`}>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`live-video-feed ${(!isCameraOn && !isScreenSharing) ? 'hidden' : ''} ${isScreenSharing ? 'as-display' : ''}`}
                        />

                        {!isCameraOn && !isScreenSharing && (
                            <div className="camera-off-msg">
                                <div className="mentor-avatar-large">
                                    {sessionData?.topic?.[0] || "M"}
                                </div>
                                <FaVideoSlash size={30} style={{ marginTop: 20, opacity: 0.5 }} />
                                <p>Camera is turned off</p>
                            </div>
                        )}

                        <div className="video-ui-overlay">
                            <span className="live-badge">
                                {isScreenSharing ? "SCREEN SHARING" : "LIVE"} - {sessionData?.topic || "Session"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="controls-bar">
                    <div className="room-info-mini">
                        <strong>{sessionData?.subject || "Academy"}</strong>
                        <span>{sessionData?.topic || "Live Class"}</span>
                    </div>

                    <div className="central-controls">
                        <div className="mic-control-wrapper">
                            <button
                                className={`control-btn ${!isMicOn ? 'off' : ''}`}
                                onClick={() => setIsMicOn(!isMicOn)}
                                title={isMicOn ? "Mute" : "Unmute"}
                            >
                                {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
                            </button>
                            {isMicOn && (
                                <div className="audio-meter">
                                    <div className="audio-bar" style={{ height: `${Math.min(100, audioLevel * 1.5)}%` }}></div>
                                </div>
                            )}
                        </div>

                        <button
                            className={`control-btn ${!isCameraOn ? 'off' : ''}`}
                            onClick={() => setIsCameraOn(!isCameraOn)}
                            title={isCameraOn ? "Stop Video" : "Start Video"}
                            disabled={isScreenSharing}
                        >
                            {isCameraOn ? <FaVideo /> : <FaVideoSlash />}
                        </button>

                        <button
                            className={`control-btn share-btn ${isScreenSharing ? 'active' : ''}`}
                            onClick={toggleScreenShare}
                            title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
                        >
                            <FaDesktop />
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
