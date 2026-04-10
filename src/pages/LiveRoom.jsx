import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash,
    FaPhoneSlash, FaExpand, FaDesktop, FaUsers, FaRegCommentDots, FaUserTie
} from 'react-icons/fa';
import './LiveRoom.css';

export default function LiveRoom() {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const isMentor = new URLSearchParams(window.location.search).get('mode') === 'mentor';

    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [sessionData, setSessionData] = useState(null);
    const [participants] = useState([
        { name: isMentor ? "Academy Mentor (You)" : "Academy Mentor", role: "Instructor", isMe: isMentor },
        { name: "Rahul V.", role: "Student" },
        { name: "Priya K.", role: "Student" },
    ]);
    const [connectionStatus, setConnectionStatus] = useState("Connecting...");

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const screenStreamRef = useRef(null);
    const pcRef = useRef(null);
    const videoSenderRef = useRef(null);

    useEffect(() => {
        const data = localStorage.getItem('mindforge_active_session');
        if (data) setSessionData(JSON.parse(data));

        // Setup Local WebRTC
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        pcRef.current = pc;

        if (isMentor) {
            localStorage.removeItem('mindforge_webrtc_offer');
            localStorage.removeItem('mindforge_webrtc_answer');
            localStorage.setItem('mindforge_webrtc_mentor_ice', '[]');
            localStorage.setItem('mindforge_webrtc_student_ice', '[]');

            initMentorStream(pc);

            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    const ice = JSON.parse(localStorage.getItem('mindforge_webrtc_mentor_ice') || '[]');
                    ice.push(e.candidate);
                    localStorage.setItem('mindforge_webrtc_mentor_ice', JSON.stringify(ice));
                }
            };

            window.addEventListener('storage', handleMentorStorage);
        } else {
            // Student Setup
            pc.ontrack = (e) => {
                if (videoRef.current && e.streams[0]) {
                    videoRef.current.srcObject = e.streams[0];
                    setConnectionStatus(""); // Connected
                }
            };

            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    const ice = JSON.parse(localStorage.getItem('mindforge_webrtc_student_ice') || '[]');
                    ice.push(e.candidate);
                    localStorage.setItem('mindforge_webrtc_student_ice', JSON.stringify(ice));
                }
            };

            const existingOffer = localStorage.getItem('mindforge_webrtc_offer');
            if (existingOffer) handleStudentOffer(JSON.parse(existingOffer), pc);

            window.addEventListener('storage', handleStudentStorage);
        }

        return () => {
            pc.close();
            stopAllStreams();
            window.removeEventListener('storage', isMentor ? handleMentorStorage : handleStudentStorage);
            if (isMentor) {
                localStorage.removeItem('mindforge_webrtc_offer');
                localStorage.removeItem('mindforge_webrtc_answer');
                localStorage.removeItem('mindforge_webrtc_mentor_ice');
                localStorage.removeItem('mindforge_webrtc_student_ice');
            }
        };
    }, []);

    // ── MENTOR SPECIFIC WEBRTC ── //
    const initMentorStream = async (pc) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;

            if (videoRef.current) videoRef.current.srcObject = stream;
            setConnectionStatus("");

            stream.getTracks().forEach(track => {
                const sender = pc.addTrack(track, stream);
                if (track.kind === 'video') videoSenderRef.current = sender;
            });

            startAudioMeter(stream);

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            localStorage.setItem('mindforge_webrtc_offer', JSON.stringify(offer));

        } catch (err) {
            console.error("Camera access denied", err);
            setIsCameraOn(false);
            setIsMicOn(false);
            setConnectionStatus("Camera Error");
        }
    };

    const handleMentorStorage = async (e) => {
        const pc = pcRef.current;
        if (!pc) return;
        if (e.key === 'mindforge_webrtc_answer' && e.newValue) {
            try {
                const answer = JSON.parse(e.newValue);
                if (pc.signalingState === 'have-local-offer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                }
            } catch (err) { }
        }
        if (e.key === 'mindforge_webrtc_student_ice' && e.newValue) {
            try {
                const cands = JSON.parse(e.newValue);
                if (cands.length > 0) {
                    await pc.addIceCandidate(new RTCIceCandidate(cands[cands.length - 1]));
                }
            } catch (err) { }
        }
    };

    const startAudioMeter = (stream) => {
        try {
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
        } catch (e) { }
    };

    // ── STUDENT SPECIFIC WEBRTC ── //
    const handleStudentOffer = async (offerDesc, pc) => {
        try {
            if (pc.signalingState !== 'stable') return;
            await pc.setRemoteDescription(new RTCSessionDescription(offerDesc));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            localStorage.setItem('mindforge_webrtc_answer', JSON.stringify(answer));
        } catch (err) { }
    };

    const handleStudentStorage = async (e) => {
        const pc = pcRef.current;
        if (!pc) return;
        if (e.key === 'mindforge_webrtc_offer' && e.newValue) {
            setConnectionStatus("Instructor went live!");
            handleStudentOffer(JSON.parse(e.newValue), pc);
        }
        if (e.key === 'mindforge_webrtc_mentor_ice' && e.newValue) {
            try {
                const cands = JSON.parse(e.newValue);
                if (cands.length > 0) {
                    await pc.addIceCandidate(new RTCIceCandidate(cands[cands.length - 1]));
                }
            } catch (err) { }
        }
    };

    const stopAllStreams = () => {
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(track => track.stop());
    };

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                screenStreamRef.current = screenStream;
                if (videoRef.current) videoRef.current.srcObject = screenStream;
                setIsScreenSharing(true);

                // Send screen via WebRTC seamlessly
                if (videoSenderRef.current) {
                    videoSenderRef.current.replaceTrack(screenStream.getVideoTracks()[0]);
                }

                screenStream.getVideoTracks()[0].onended = () => stopScreenShare();
            } catch (err) { console.error("Screen share failed:", err); }
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

        // Revert to camera in WebRTC
        if (videoSenderRef.current && streamRef.current) {
            videoSenderRef.current.replaceTrack(streamRef.current.getVideoTracks()[0]);
        }
        setIsScreenSharing(false);
    };

    useEffect(() => {
        if (isMentor && streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (videoTrack) videoTrack.enabled = isCameraOn;
            if (audioTrack) audioTrack.enabled = isMicOn;

            // Re-sync WebRTC track status
            if (videoSenderRef.current && !isScreenSharing) {
                videoSenderRef.current.track.enabled = isCameraOn;
            }
        }
    }, [isCameraOn, isMicOn, isMentor, isScreenSharing]);

    const handleExit = () => {
        if (isMentor) {
            if (window.confirm("End session for everyone?")) {
                localStorage.removeItem('mindforge_active_session');
                // Clean up RTC signaling
                localStorage.removeItem('mindforge_webrtc_offer');
                localStorage.removeItem('mindforge_webrtc_answer');
                localStorage.removeItem('mindforge_webrtc_mentor_ice');
                localStorage.removeItem('mindforge_webrtc_student_ice');
                navigate('/staff');
            }
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="live-room-page full-screen">
            <div className="room-container">
                <div className="video-viewport">
                    <div className={`video-placeholder ${!isCameraOn && !isScreenSharing && isMentor ? 'dark' : ''}`}>

                        {connectionStatus && !isMentor && (
                            <div className="connection-status-msg">
                                <div className="mentor-avatar-large pulse-anim">
                                    {sessionData?.topic?.[0] || "M"}
                                </div>
                                <p style={{ marginTop: 20 }}>{connectionStatus}</p>
                                <p style={{ opacity: 0.5, fontSize: '0.9rem', marginTop: 8 }}>Waiting for instructor broadcast...</p>
                            </div>
                        )}

                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted={isMentor} // Student should hear the audio, Mentor mutes self!
                            className={`live-video-feed ${(!isCameraOn && !isScreenSharing && isMentor) || (connectionStatus && !isMentor) ? 'hidden' : ''} ${isScreenSharing ? 'as-display' : ''}`}
                        />

                        {!isCameraOn && !isScreenSharing && isMentor && (
                            <div className="camera-off-msg">
                                <div className="mentor-avatar-large">
                                    <FaUserTie size={50} />
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
                        {isMentor && (
                            <>
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
                                    disabled={isScreenSharing}
                                    title={isCameraOn ? "Stop Video" : "Start Video"}
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
                            </>
                        )}

                        <button
                            className={`control-btn end-btn ${!isMentor ? 'student-leave' : ''}`}
                            onClick={handleExit}
                            title={isMentor ? "End Class" : "Leave Class"}
                        >
                            <FaPhoneSlash />
                        </button>
                    </div>

                    <div className="utility-controls" style={{ display: 'flex', gap: '10px' }}>
                        {isMentor && (
                            <button
                                className="secondary-btn"
                                style={{ padding: '8px 12px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)' }}
                                onClick={() => window.open('/dashboard', '_blank')}
                                title="Open Dashboard in new tab to see what students see"
                            >
                                <FaDesktop style={{ marginRight: '5px' }} /> Test Student View
                            </button>
                        )}
                        <button className="icon-btn" onClick={() => document.documentElement.requestFullscreen()}><FaExpand /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
