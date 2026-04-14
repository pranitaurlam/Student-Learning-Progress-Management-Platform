import { useState } from 'react';
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
        semester: '',
        batch: '',
        understanding: 'Good',
        doubts: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;

        const submission = {
            id: Date.now(),
            sessionId,
            subject,
            label,
            ...form,
            time: new Date().toLocaleTimeString()
        };

        // Save to localStorage for Staff Portal to pick up
        const existing = JSON.parse(localStorage.getItem(ATTENDANCE_STORAGE_KEY) || '[]');
        localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify([submission, ...existing]));

        setSubmitted(true);
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
                        <label>Student's Full Name <span>*</span></label>
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
                        <label>Which Semester? <span>*</span></label>
                        <div className="att-radio-group">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                <label key={sem} className="att-radio-item">
                                    <input
                                        type="radio"
                                        name="semester"
                                        value={sem}
                                        required
                                        onChange={e => setForm({ ...form, semester: e.target.value })}
                                    />
                                    Semester {sem}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Batch */}
                    <div className="att-field">
                        <label>What is your Batch? <span>*</span></label>
                        <div className="att-radio-group">
                            {['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4'].map(batch => (
                                <label key={batch} className="att-radio-item">
                                    <input
                                        type="radio"
                                        name="batch"
                                        value={batch}
                                        required
                                        onChange={e => setForm({ ...form, batch: e.target.value })}
                                    />
                                    {batch}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Understanding */}
                    <div className="att-field">
                        <label>Did you understand today's class? <span>*</span></label>
                        <div className="att-radio-group">
                            {['Excellent', 'Good', 'Average', 'Not much'].map(opt => (
                                <label key={opt} className="att-radio-item">
                                    <input
                                        type="radio"
                                        name="understanding"
                                        value={opt}
                                        required
                                        checked={form.understanding === opt}
                                        onChange={e => setForm({ ...form, understanding: e.target.value })}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Doubts */}
                    <div className="att-field">
                        <label>What are your doubts? (Leave blank if none)</label>
                        <textarea
                            className="att-input-text"
                            placeholder="Your answer"
                            rows={3}
                            style={{ resize: 'vertical', borderBottom: '1px solid #d1d5db' }}
                            value={form.doubts}
                            onChange={e => setForm({ ...form, doubts: e.target.value })}
                        />
                    </div>

                    <div className="att-submit-row">
                        <button type="submit" className="att-submit-btn">Submit</button>
                        <button type="button" className="att-clear-btn" onClick={() => setForm({ name: '', semester: '', batch: '', understanding: 'Good', doubts: '' })}>Clear form</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
