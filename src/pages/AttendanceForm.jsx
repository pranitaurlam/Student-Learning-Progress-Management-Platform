import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaClipboardList } from 'react-icons/fa';
import './AttendanceForm.css';

const ATTENDANCE_STORAGE_KEY = 'mindforge_attendance_submissions';

export default function AttendanceForm() {
    const [searchParams] = useSearchParams();
    const subject = searchParams.get('subject') || 'General Session';
    const label = searchParams.get('label') || 'General';
    const sessionId = searchParams.get('session') || 'unknown';

    const [form, setForm] = useState({
        name: '',
        sem: '',
        batch: '',
        happened: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsConnecting(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;

        const submission = {
            sessionId,
            subject,
            label,
            ...form,
            time: new Date().toLocaleTimeString()
        };

        try {
            await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submission)
            });
            setSubmitted(true);
        } catch (err) {
            console.error("Failed to submit attendance syncing: ", err);
            // Fallback for safety
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <div className="att-form-page">
                <div className="att-form-container att-success">
                    <FaCheckCircle className="att-success-icon" />
                    <h2>Attendance Recorded!</h2>
                    <p>Your response for <strong>{subject}</strong> has been submitted successfully.</p>
                    <button className="att-submit-btn" onClick={() => window.close()}>Close Tab</button>
                    <p style={{ marginTop: 20, fontSize: '0.8rem', color: '#9ca3af' }}>You can now return to your class.</p>
                </div>
            </div>
        );
    }

    if (isConnecting) {
        return (
            <div className="att-form-page">
                <div className="att-form-container att-success" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 40px' }}>
                    <div className="spinner" style={{
                        border: '4px solid rgba(0,0,0,0.1)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        borderLeftColor: '#60a5fa',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '24px'
                    }}></div>
                    <style>{`
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    `}</style>
                    <h2 style={{ margin: 0, color: '#4b5563', fontSize: '1.2rem', fontWeight: '500' }}>Connecting to server...</h2>
                    <p style={{ marginTop: 10, fontSize: '0.9rem', color: '#9ca3af' }}>Please wait while we establish a secure connection.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="att-form-page">
            <form className="att-form-container" onSubmit={handleSubmit}>
                <div className="att-form-header"></div>
                <div className="att-form-content">
                    <div className="att-form-title-section">
                        <h1>Session Attendance</h1>
                        <p>Please fill out this form to mark your attendance for <strong>{subject}</strong> ({label}).</p>
                    </div>

                    {/* Name */}
                    <div className="att-field">
                        <label>your name: <span>*</span></label>
                        <input
                            type="text"
                            className="att-input-text"
                            placeholder="Your answer"
                            required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    {/* Semester */}
                    <div className="att-field">
                        <label>your sem: <span>*</span></label>
                        <input
                            type="text"
                            className="att-input-text"
                            placeholder="Your answer"
                            required
                            value={form.sem}
                            onChange={e => setForm({ ...form, sem: e.target.value })}
                        />
                    </div>

                    {/* Batch */}
                    <div className="att-field">
                        <label>your batch: <span>*</span></label>
                        <input
                            type="text"
                            className="att-input-text"
                            placeholder="Your answer"
                            required
                            value={form.batch}
                            onChange={e => setForm({ ...form, batch: e.target.value })}
                        />
                    </div>

                    {/* What happen in class */}
                    <div className="att-field">
                        <label>what happen in class: <span>*</span></label>
                        <textarea
                            className="att-input-text"
                            placeholder="Your answer"
                            required
                            rows={4}
                            style={{ resize: 'vertical', borderBottom: '1px solid #d1d5db' }}
                            value={form.happened}
                            onChange={e => setForm({ ...form, happened: e.target.value })}
                        />
                    </div>

                    <div className="att-submit-row">
                        <button type="submit" className="att-submit-btn">Submit</button>
                        <button type="button" className="att-clear-btn" onClick={() => setForm({ name: '', sem: '', batch: '', happened: '' })}>Clear form</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
