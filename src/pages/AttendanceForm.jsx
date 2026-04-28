import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IoFingerPrintOutline, IoCheckmarkCircleOutline, IoAlertCircleOutline, IoArrowForwardOutline } from 'react-icons/io5';
import './AttendanceForm.css';

export default function AttendanceForm() {
    const [searchParams] = useSearchParams();
    const subject = searchParams.get('subject') || 'Advanced Module';
    const label = searchParams.get('label') || 'CORE';
    const sessionId = searchParams.get('session') || 'unregistered';

    const [form, setForm] = useState({
        name: '',
        sem: '',
        batch: '',
        happened: ''
    });

    const [status, setStatus] = useState('idle'); // idle, connecting, submitting, success, error
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        setStatus('connecting');
        // Real check: probe the health endpoint
        fetch('/api/network-info')
            .then(res => res.ok ? setStatus('idle') : setStatus('error'))
            .catch(() => setStatus('error'));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;

        setStatus('submitting');
        const submission = {
            sessionId,
            subject,
            label,
            ...form,
            time: new Date().toLocaleTimeString()
        };

        try {
            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submission)
            });
            
            if (res.ok) {
                setStatus('success');
            } else {
                throw new Error('Submission rejected by server');
            }
        } catch (err) {
            console.error("Attendance failure:", err);
            setStatus('error');
            setErrorMsg('System synchronization failed. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="att-form-page">
                <div className="mesh-gradient"></div>
                <div className="att-glass-card success-entry">
                    <div className="success-icon-wrap">
                        <IoCheckmarkCircleOutline />
                    </div>
                    <h2>Identity Verified</h2>
                    <p>Attendance for <strong>{subject}</strong> recorded in the secure ledger.</p>
                    <div className="session-pill">{sessionId}</div>
                    <button className="att-prime-btn" onClick={() => window.close()}>
                        Exit Session <IoArrowForwardOutline />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="att-form-page">
            <div className="mesh-gradient"></div>
            
            {status === 'connecting' && (
                <div className="att-preloader">
                    <div className="scanner-line"></div>
                    <div className="display-giant">0{Math.floor(Math.random() * 9)}</div>
                    <p>SYNCHRONIZING SECURE TUNNEL...</p>
                </div>
            )}

            {(status === 'idle' || status === 'submitting' || status === 'error') && (
                <form className="att-glass-card" onSubmit={handleSubmit}>
                    <div className="card-accent-top"></div>
                    
                    <header className="att-header">
                        <div className="brand-icon">
                            <IoFingerPrintOutline />
                        </div>
                        <div className="title-stack">
                            <h1>Session Access</h1>
                            <p>{subject} <span className="label-lite">{label}</span></p>
                        </div>
                    </header>

                    {status === 'error' && (
                        <div className="error-banner">
                            <IoAlertCircleOutline /> {errorMsg || 'Connection unstable'}
                        </div>
                    )}

                    <div className="att-grid">
                        <div className="att-input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                required
                                disabled={status === 'submitting'}
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>

                        <div className="att-input-group">
                            <label>Semester</label>
                            <input
                                type="text"
                                placeholder="e.g. SEM 4"
                                required
                                disabled={status === 'submitting'}
                                value={form.sem}
                                onChange={e => setForm({ ...form, sem: e.target.value })}
                            />
                        </div>

                        <div className="att-input-group">
                            <label>Batch Code</label>
                            <input
                                type="text"
                                placeholder="e.g. B1"
                                required
                                disabled={status === 'submitting'}
                                value={form.batch}
                                onChange={e => setForm({ ...form, batch: e.target.value })}
                            />
                        </div>

                        <div className="att-input-group full">
                            <label>Session Reflection</label>
                            <textarea
                                placeholder="Briefly describe what was covered..."
                                required
                                disabled={status === 'submitting'}
                                rows={3}
                                value={form.happened}
                                onChange={e => setForm({ ...form, happened: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="att-footer">
                        <button 
                            type="submit" 
                            className={`att-prime-btn ${status === 'submitting' ? 'loading' : ''}`}
                            disabled={status === 'submitting'}
                        >
                            {status === 'submitting' ? 'RECORDING...' : 'VERIFY ATTENDANCE'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
