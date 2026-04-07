import { useState, useEffect, useRef } from 'react';
import {
    FaUserShield, FaCalendarAlt, FaBullhorn, FaBookOpen,
    FaPlus, FaTrash, FaEdit, FaCheck, FaTimes,
    FaUsers, FaChartBar, FaClock, FaTrophy, FaStar,
    FaFolderOpen, FaFileAlt, FaDownload, FaQrcode, FaSync
} from 'react-icons/fa';
import './Staff.css';

const SUBJECTS = ['AI/ML', 'DSA', 'Web Dev', 'DBMS', 'Python'];
const TIMES = ['08:00 AM', '09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

const initTimetable = [
    { id: 1, time: '10:00 AM', subject: 'DBMS', topic: 'Normalization' },
    { id: 2, time: '11:30 AM', subject: 'Python', topic: 'Decorators' },
    { id: 3, time: '02:00 PM', subject: 'AI/ML', topic: 'Backpropagation' },
];

const initAnnouncements = [
    { id: 1, title: 'Hackathon Registration Open', content: 'Register for the upcoming code-fest!', date: 'Just now' },
    { id: 2, title: 'New Python Course Added', content: 'Explore the new advanced Python modules.', date: '2 hours ago' },
    { id: 3, title: 'Server Maintenance', content: 'Scheduled maintenance on Sunday 2 AM.', date: 'Yesterday' },
];

const initAssignments = [
    { id: 1, title: 'Neural Networks Basics', subject: 'AI/ML', due: 'Today, 11:59 PM', status: 'Pending' },
    { id: 2, title: 'Binary Trees Implementation', subject: 'DSA', due: 'Tomorrow', status: 'Pending' },
    { id: 3, title: 'React Hooks Deep Dive', subject: 'Web Dev', due: 'In 2 days', status: 'In Progress' },
];

const TABS = [
    { key: 'timetable', label: 'Timetable', icon: FaCalendarAlt, color: '#a78bfa' },
    { key: 'announcements', label: 'Announcements', icon: FaBullhorn, color: '#f472b6' },
    { key: 'assignments', label: 'Assignments', icon: FaBookOpen, color: '#34d399' },
    { key: 'scores', label: 'Student Scores', icon: FaTrophy, color: '#fbbf24' },
    { key: 'materials', label: 'Study Material', icon: FaFolderOpen, color: '#60a5fa' },
    { key: 'attendance', label: 'Attendance', icon: FaQrcode, color: '#f87171' },
];

const SUBJECT_COLORS = {
    'AI/ML': '#a78bfa',
    'DSA': '#60a5fa',
    'Web Dev': '#f472b6',
    'DBMS': '#fbbf24',
    'Python': '#34d399',
};

export default function Staff() {
    const [activeTab, setActiveTab] = useState('timetable');

    /* ── Timetable ── */
    const [timetable, setTimetable] = useState(initTimetable);
    const [ttForm, setTtForm] = useState({ time: '', subject: '', topic: '' });
    const [ttEdit, setTtEdit] = useState(null);

    const addTimetable = () => {
        if (!ttForm.time || !ttForm.subject || !ttForm.topic) return;
        setTimetable(prev => [...prev, { id: Date.now(), ...ttForm }]);
        setTtForm({ time: '', subject: '', topic: '' });
    };
    const saveTtEdit = (id) => {
        setTimetable(prev => prev.map(r => r.id === id ? { ...r, ...ttEdit } : r));
        setTtEdit(null);
    };

    /* ── Announcements ── */
    const [announcements, setAnnouncements] = useState(initAnnouncements);
    const [annForm, setAnnForm] = useState({ title: '', content: '' });
    const [annEdit, setAnnEdit] = useState(null);

    const addAnnouncement = () => {
        if (!annForm.title || !annForm.content) return;
        setAnnouncements(prev => [{ id: Date.now(), ...annForm, date: 'Just now' }, ...prev]);
        setAnnForm({ title: '', content: '' });
    };
    const saveAnnEdit = (id) => {
        setAnnouncements(prev => prev.map(r => r.id === id ? { ...r, ...annEdit } : r));
        setAnnEdit(null);
    };

    /* ── Assignments ── */
    const [assignments, setAssignments] = useState(initAssignments);
    const [asnForm, setAsnForm] = useState({ title: '', subject: '', due: '' });
    const [asnEdit, setAsnEdit] = useState(null);

    const addAssignment = () => {
        if (!asnForm.title || !asnForm.subject || !asnForm.due) return;
        setAssignments(prev => [...prev, { id: Date.now(), ...asnForm, status: 'Pending' }]);
        setAsnForm({ title: '', subject: '', due: '' });
    };
    const saveAsnEdit = (id) => {
        setAssignments(prev => prev.map(r => r.id === id ? { ...r, ...asnEdit } : r));
        setAsnEdit(null);
    };

    /* ── Scores (read-only from localStorage) ── */
    const mockHistory = (() => {
        try { return JSON.parse(localStorage.getItem('mindforge_test_history') || '[]'); } catch { return []; }
    })();
    const practiceHistory = (() => {
        try { return JSON.parse(localStorage.getItem('mindforge_practice_history') || '[]'); } catch { return []; }
    })();

    /* ── Study Materials ── */
    const [materials, setMaterials] = useState([]);
    const [matForm, setMatForm] = useState({ title: '', subject: '', file: null });
    const [matDragging, setMatDragging] = useState(false);

    const handleMatFile = (file) => {
        if (!file) return;
        setMatForm(p => ({ ...p, file, title: p.title || file.name }));
    };

    const addMaterial = () => {
        if (!matForm.file || !matForm.title) return;
        const url = URL.createObjectURL(matForm.file);
        setMaterials(prev => [{
            id: Date.now(),
            title: matForm.title,
            subject: matForm.subject,
            fileName: matForm.file.name,
            size: (matForm.file.size / 1024).toFixed(0) + ' KB',
            type: matForm.file.name.split('.').pop().toUpperCase(),
            url,
            date: new Date().toLocaleDateString(),
        }, ...prev]);
        setMatForm({ title: '', subject: '', file: null });
    };

    /* ── Attendance ── */
    const [attSession, setAttSession] = useState({ subject: '', label: '' });
    const [qrValue, setQrValue] = useState('');
    const [qrExpiry, setQrExpiry] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [attLog, setAttLog] = useState([]);
    const timerRef = useRef(null);
    const QR_DURATION = 30; // 30 seconds

    const generateQR = () => {
        clearInterval(timerRef.current);
        const token = `mindforge-attendance-${attSession.subject || 'All'}-${attSession.label || 'General'}-${Date.now()}`;
        setQrValue(token);
        setCountdown(QR_DURATION);
        const expiry = Date.now() + QR_DURATION * 1000;
        setQrExpiry(expiry);
        timerRef.current = setInterval(() => {
            const rem = Math.max(0, Math.round((expiry - Date.now()) / 1000));
            setCountdown(rem);
            if (rem === 0) {
                clearInterval(timerRef.current);
                setQrValue('');
            }
        }, 1000);
    };

    // Auto-generate QR when entering tab or changing session info
    useEffect(() => {
        if (activeTab === 'attendance') {
            generateQR();
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [activeTab, attSession.subject]); // only regenerate on subject change or tab enter, not every keystroke

    // Simulate a student scanning (demo button)
    const simulateScan = () => {
        if (!qrValue) return;
        const names = ['Riya S.', 'Arjun M.', 'Priya K.', 'Dev R.', 'Sneha T.', 'Rahul V.'];
        const name = names[Math.floor(Math.random() * names.length)];
        const already = attLog.find(l => l.session === qrValue && l.name === name);
        if (already) return;
        setAttLog(prev => [{ id: Date.now(), name, session: qrValue, subject: attSession.subject, time: new Date().toLocaleTimeString() }, ...prev]);
    };

    useEffect(() => () => clearInterval(timerRef.current), []);

    return (
        <div className="staff-page">
            {/* ── Top Header ── */}
            <div className="staff-hero">
                <div className="container">
                    <div className="staff-hero-content">
                        <div className="staff-hero-left">
                            <div className="staff-avatar">
                                <FaUserShield />
                            </div>
                            <div>
                                <div className="staff-role-badge">Staff Portal</div>
                                <h1 className="staff-hero-title">MindForge Control Center</h1>
                                <p className="staff-hero-sub">Manage your academy's content and schedule.</p>
                            </div>
                        </div>
                        <div className="staff-hero-stats">
                            <div className="hero-stat">
                                <FaUsers className="hero-stat-icon" />
                                <div>
                                    <div className="hero-stat-val">1,248</div>
                                    <div className="hero-stat-label">Students</div>
                                </div>
                            </div>
                            <div className="hero-stat">
                                <FaChartBar className="hero-stat-icon" />
                                <div>
                                    <div className="hero-stat-val">{assignments.length}</div>
                                    <div className="hero-stat-label">Assignments</div>
                                </div>
                            </div>
                            <div className="hero-stat">
                                <FaClock className="hero-stat-icon" />
                                <div>
                                    <div className="hero-stat-val">{timetable.length}</div>
                                    <div className="hero-stat-label">Sessions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Tab Bar ── */}
            <div className="staff-tab-bar">
                <div className="container">
                    <div className="staff-tabs">
                        {TABS.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.key}
                                    className={`staff-tab ${activeTab === tab.key ? 'active' : ''}`}
                                    style={activeTab === tab.key ? { '--tab-color': tab.color } : {}}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    <Icon />
                                    {tab.label}
                                    {activeTab === tab.key && tab.key !== 'scores' && tab.key !== 'materials' && (
                                        <span className="tab-count">
                                            {tab.key === 'timetable' ? timetable.length
                                                : tab.key === 'announcements' ? announcements.length
                                                    : assignments.length}
                                        </span>
                                    )}
                                    {activeTab === tab.key && tab.key === 'materials' && materials.length > 0 && (
                                        <span className="tab-count">{materials.length}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="container staff-content">

                {/* ────── TIMETABLE ────── */}
                {activeTab === 'timetable' && (
                    <div className="tab-panel">
                        <div className="panel-intro">
                            <h2>Schedule Manager</h2>
                            <p>Add, edit, or remove sessions from the student timetable.</p>
                        </div>

                        {/* Add Form */}
                        <div className="add-card">
                            <div className="add-card-title"><FaPlus /> New Session</div>
                            <div className="add-form">
                                <div className="form-field">
                                    <label>Time</label>
                                    <select value={ttForm.time} onChange={e => setTtForm(p => ({ ...p, time: e.target.value }))}>
                                        <option value="">Select time</option>
                                        {TIMES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>Subject</label>
                                    <select value={ttForm.subject} onChange={e => setTtForm(p => ({ ...p, subject: e.target.value }))}>
                                        <option value="">Select subject</option>
                                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-field grow">
                                    <label>Topic</label>
                                    <input placeholder="e.g. Normalization" value={ttForm.topic}
                                        onChange={e => setTtForm(p => ({ ...p, topic: e.target.value }))} />
                                </div>
                                <button className="primary-btn" style={{ '--btn-color': '#a78bfa', '--btn-hover': '#7c3aed' }} onClick={addTimetable}>
                                    <FaPlus /> Add Session
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="item-list">
                            {timetable.map((row, i) => (
                                <div key={row.id} className="item-card" style={{ '--accent': SUBJECT_COLORS[row.subject] || '#a78bfa' }}>
                                    {ttEdit?.id === row.id ? (
                                        <div className="inline-edit-row">
                                            <select value={ttEdit.time} onChange={e => setTtEdit(p => ({ ...p, time: e.target.value }))}>
                                                {TIMES.map(t => <option key={t}>{t}</option>)}
                                            </select>
                                            <select value={ttEdit.subject} onChange={e => setTtEdit(p => ({ ...p, subject: e.target.value }))}>
                                                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                                            </select>
                                            <input className="flex-grow" value={ttEdit.topic} onChange={e => setTtEdit(p => ({ ...p, topic: e.target.value }))} />
                                            <button className="icon-act save" onClick={() => saveTtEdit(row.id)}><FaCheck /></button>
                                            <button className="icon-act cancel" onClick={() => setTtEdit(null)}><FaTimes /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="item-num">{String(i + 1).padStart(2, '0')}</div>
                                            <div className="item-info">
                                                <span className="item-time"><FaClock className="mini-icon" />{row.time}</span>
                                                <strong className="item-name">{row.subject}</strong>
                                                <span className="item-sub">{row.topic}</span>
                                            </div>
                                            <div className="item-actions">
                                                <button className="icon-act edit" onClick={() => setTtEdit({ ...row })}><FaEdit /></button>
                                                <button className="icon-act delete" onClick={() => setTimetable(p => p.filter(r => r.id !== row.id))}><FaTrash /></button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            {timetable.length === 0 && <div className="empty-state">No sessions yet. Add one above!</div>}
                        </div>
                    </div>
                )}

                {/* ────── ANNOUNCEMENTS ────── */}
                {activeTab === 'announcements' && (
                    <div className="tab-panel">
                        <div className="panel-intro">
                            <h2>Announcement Board</h2>
                            <p>Post and manage announcements visible to all students.</p>
                        </div>

                        <div className="add-card">
                            <div className="add-card-title"><FaPlus /> New Announcement</div>
                            <div className="add-form col">
                                <div className="form-field">
                                    <label>Title</label>
                                    <input placeholder="e.g. Hackathon Registration Open" value={annForm.title}
                                        onChange={e => setAnnForm(p => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div className="form-field">
                                    <label>Content</label>
                                    <textarea rows={3} placeholder="Write your announcement..." value={annForm.content}
                                        onChange={e => setAnnForm(p => ({ ...p, content: e.target.value }))} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="primary-btn" style={{ '--btn-color': '#f472b6', '--btn-hover': '#db2777' }} onClick={addAnnouncement}>
                                        <FaBullhorn /> Post Announcement
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="item-list ann-list">
                            {announcements.map(row => (
                                <div key={row.id} className="ann-card" style={{ '--accent': '#f472b6' }}>
                                    {annEdit?.id === row.id ? (
                                        <div className="ann-edit">
                                            <input value={annEdit.title} onChange={e => setAnnEdit(p => ({ ...p, title: e.target.value }))} />
                                            <textarea rows={2} value={annEdit.content} onChange={e => setAnnEdit(p => ({ ...p, content: e.target.value }))} />
                                            <div className="edit-actions">
                                                <button className="icon-act save" onClick={() => saveAnnEdit(row.id)}><FaCheck /> Save</button>
                                                <button className="icon-act cancel" onClick={() => setAnnEdit(null)}><FaTimes /> Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="ann-body">
                                                <div className="ann-dot" />
                                                <div>
                                                    <h3 className="ann-title">{row.title}</h3>
                                                    <p className="ann-content">{row.content}</p>
                                                    <span className="ann-date">{row.date}</span>
                                                </div>
                                            </div>
                                            <div className="item-actions">
                                                <button className="icon-act edit" onClick={() => setAnnEdit({ ...row })}><FaEdit /></button>
                                                <button className="icon-act delete" onClick={() => setAnnouncements(p => p.filter(r => r.id !== row.id))}><FaTrash /></button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            {announcements.length === 0 && <div className="empty-state">No announcements yet.</div>}
                        </div>
                    </div>
                )}

                {/* ────── ASSIGNMENTS ────── */}
                {activeTab === 'assignments' && (
                    <div className="tab-panel">
                        <div className="panel-intro">
                            <h2>Assignment Manager</h2>
                            <p>Create and manage assignment questions for students.</p>
                        </div>

                        <div className="add-card">
                            <div className="add-card-title"><FaPlus /> New Assignment</div>
                            <div className="add-form">
                                <div className="form-field grow">
                                    <label>Assignment Title</label>
                                    <input placeholder="e.g. Neural Networks Basics" value={asnForm.title}
                                        onChange={e => setAsnForm(p => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div className="form-field">
                                    <label>Subject</label>
                                    <select value={asnForm.subject} onChange={e => setAsnForm(p => ({ ...p, subject: e.target.value }))}>
                                        <option value="">Select subject</option>
                                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>Due Date</label>
                                    <input placeholder="e.g. Tomorrow, 5 PM" value={asnForm.due}
                                        onChange={e => setAsnForm(p => ({ ...p, due: e.target.value }))} />
                                </div>
                                <button className="primary-btn" style={{ '--btn-color': '#34d399', '--btn-hover': '#059669' }} onClick={addAssignment}>
                                    <FaPlus /> Add
                                </button>
                            </div>
                        </div>

                        <div className="assignments-table">
                            <div className="table-head">
                                <span>Assignment</span>
                                <span>Subject</span>
                                <span>Due</span>
                                <span>Actions</span>
                            </div>
                            {assignments.map(row => (
                                <div key={row.id} className="table-row">
                                    {asnEdit?.id === row.id ? (
                                        <div className="inline-edit-row full">
                                            <input className="flex-grow" value={asnEdit.title} onChange={e => setAsnEdit(p => ({ ...p, title: e.target.value }))} />
                                            <select value={asnEdit.subject} onChange={e => setAsnEdit(p => ({ ...p, subject: e.target.value }))}>
                                                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                                            </select>
                                            <input value={asnEdit.due} onChange={e => setAsnEdit(p => ({ ...p, due: e.target.value }))} />
                                            <button className="icon-act save" onClick={() => saveAsnEdit(row.id)}><FaCheck /></button>
                                            <button className="icon-act cancel" onClick={() => setAsnEdit(null)}><FaTimes /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="row-title">{row.title}</span>
                                            <span>
                                                <span className="subj-pill" style={{ '--c': SUBJECT_COLORS[row.subject] || '#a78bfa' }}>
                                                    {row.subject}
                                                </span>
                                            </span>
                                            <span className="row-due">{row.due}</span>
                                            <span className="row-actions">
                                                <button className="icon-act edit" onClick={() => setAsnEdit({ ...row })}><FaEdit /></button>
                                                <button className="icon-act delete" onClick={() => setAssignments(p => p.filter(r => r.id !== row.id))}><FaTrash /></button>
                                            </span>
                                        </>
                                    )}
                                </div>
                            ))}
                            {assignments.length === 0 && <div className="empty-state">No assignments yet.</div>}
                        </div>
                    </div>
                )}
                {/* ────── SCORES ────── */}
                {activeTab === 'scores' && (
                    <div className="tab-panel">
                        <div className="panel-intro">
                            <h2>Student Scores</h2>
                            <p>View student performance from Mock Tests and Practice Questions.</p>
                        </div>

                        {/* Mock Test Scores */}
                        <div className="scores-section">
                            <div className="scores-section-title"><FaTrophy className="score-sec-icon gold" /> Mock Test Results</div>
                            <div className="assignments-table">
                                <div className="table-head" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 80px' }}>
                                    <span>Date</span>
                                    <span>Subject</span>
                                    <span>Difficulty</span>
                                    <span>Accuracy</span>
                                    <span>Questions</span>
                                </div>
                                {mockHistory.length === 0 && <div className="empty-state">No mock test attempts recorded yet.</div>}
                                {[...mockHistory].reverse().map((r, i) => (
                                    <div key={i} className="table-row" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 80px' }}>
                                        <span className="row-due">{new Date(r.date).toLocaleString()}</span>
                                        <span><span className="subj-pill" style={{ '--c': SUBJECT_COLORS[r.subjectName] || '#a78bfa' }}>{r.subjectName || r.subject}</span></span>
                                        <span className="row-due" style={{ textTransform: 'capitalize' }}>{r.difficulty}</span>
                                        <span>
                                            <span className={`status-pill ${r.accuracy >= 70 ? 'submitted' : r.accuracy >= 40 ? 'in-progress' : 'pending'}`}>
                                                {r.accuracy}%
                                            </span>
                                        </span>
                                        <span className="row-due">{r.attempted}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Practice Scores */}
                        <div className="scores-section">
                            <div className="scores-section-title"><FaStar className="score-sec-icon blue" /> Practice Question Attempts</div>
                            <div className="assignments-table">
                                <div className="table-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                                    <span>Question</span>
                                    <span>Subject</span>
                                    <span>Difficulty</span>
                                    <span>Result</span>
                                </div>
                                {practiceHistory.length === 0 && <div className="empty-state">No practice attempts recorded yet.</div>}
                                {[...practiceHistory].reverse().map((r, i) => (
                                    <div key={i} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                                        <span className="row-title" style={{ fontSize: '0.88rem' }}>{r.questionText?.slice(0, 60)}{r.questionText?.length > 60 ? '…' : ''}</span>
                                        <span><span className="subj-pill" style={{ '--c': SUBJECT_COLORS[r.subject] || '#a78bfa' }}>{r.subject}</span></span>
                                        <span className="row-due" style={{ textTransform: 'capitalize' }}>{r.difficulty}</span>
                                        <span>
                                            <span className={`status-pill ${r.correct ? 'submitted' : 'pending'}`}>
                                                {r.correct ? '✓ Correct' : '✗ Wrong'}
                                            </span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {/* ────── STUDY MATERIAL ────── */}
                {activeTab === 'materials' && (
                    <div className="tab-panel">
                        <div className="panel-intro">
                            <h2>Study Material Upload</h2>
                            <p>Upload files that students can access from the Dashboard.</p>
                        </div>

                        {/* Upload form */}
                        <div className="add-card">
                            <div className="add-card-title"><FaPlus /> Upload New Material</div>
                            <div
                                className={`mat-dropzone ${matDragging ? 'dragging' : ''} ${matForm.file ? 'has-file' : ''}`}
                                onDragOver={e => { e.preventDefault(); setMatDragging(true); }}
                                onDragLeave={() => setMatDragging(false)}
                                onDrop={e => { e.preventDefault(); setMatDragging(false); handleMatFile(e.dataTransfer.files[0]); }}
                                onClick={() => document.getElementById('mat-file-input').click()}
                            >
                                <input
                                    id="mat-file-input"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={e => handleMatFile(e.target.files[0])}
                                />
                                {matForm.file ? (
                                    <>
                                        <FaFileAlt className="dropzone-icon has" />
                                        <p className="dropzone-label">{matForm.file.name}</p>
                                        <span className="dropzone-sub">{(matForm.file.size / 1024).toFixed(0)} KB · Click to change</span>
                                    </>
                                ) : (
                                    <>
                                        <FaFolderOpen className="dropzone-icon" />
                                        <p className="dropzone-label">Drag & drop a file here</p>
                                        <span className="dropzone-sub">or click to browse (PDF, DOC, PPT, ZIP…)</span>
                                    </>
                                )}
                            </div>

                            <div className="add-form" style={{ marginTop: 16 }}>
                                <div className="form-field grow">
                                    <label>Display Title</label>
                                    <input
                                        placeholder="e.g. DBMS Full Notes.pdf"
                                        value={matForm.title}
                                        onChange={e => setMatForm(p => ({ ...p, title: e.target.value }))}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Subject Tag</label>
                                    <select value={matForm.subject} onChange={e => setMatForm(p => ({ ...p, subject: e.target.value }))}>
                                        <option value="">None</option>
                                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <button
                                    className="primary-btn"
                                    style={{ '--btn-color': '#60a5fa', '--btn-hover': '#2563eb' }}
                                    onClick={addMaterial}
                                >
                                    <FaPlus /> Upload
                                </button>
                            </div>
                        </div>

                        {/* Material list */}
                        <div className="mat-list">
                            {materials.length === 0 && (
                                <div className="empty-state">No materials uploaded yet. Upload a file above!</div>
                            )}
                            {materials.map(m => (
                                <div key={m.id} className="mat-item">
                                    <div className="mat-file-icon">
                                        <FaFileAlt />
                                        <span className="mat-ext">{m.type}</span>
                                    </div>
                                    <div className="mat-info">
                                        <strong className="mat-title">{m.title}</strong>
                                        <div className="mat-meta">
                                            {m.subject && <span className="subj-pill" style={{ '--c': SUBJECT_COLORS[m.subject] || '#60a5fa' }}>{m.subject}</span>}
                                            <span className="row-due">{m.size}</span>
                                            <span className="row-due">Uploaded {m.date}</span>
                                        </div>
                                    </div>
                                    <div className="mat-actions">
                                        <a href={m.url} download={m.fileName} className="icon-act save" title="Download">
                                            <FaDownload />
                                        </a>
                                        <button className="icon-act delete" onClick={() => {
                                            URL.revokeObjectURL(m.url);
                                            setMaterials(p => p.filter(x => x.id !== m.id));
                                        }}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ────── ATTENDANCE ────── */}
                {activeTab === 'attendance' && (
                    <div className="tab-panel">
                        <div className="panel-intro">
                            <h2>Session Attendance Scanner</h2>
                            <p>Generate a temporary QR code for students to scan during their live class.</p>
                        </div>

                        <div className="attendance-container">
                            {/* Left Side: Setup & QR */}
                            <div className="qr-panel">
                                <div className="add-form" style={{ marginBottom: 20 }}>
                                    <div className="form-field">
                                        <label>Session Subject</label>
                                        <select value={attSession.subject} onChange={e => setAttSession(p => ({ ...p, subject: e.target.value }))}>
                                            <option value="">General Session</option>
                                            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-field">
                                        <label>Session Label (Optional)</label>
                                        <input
                                            placeholder="e.g. Lab, Revision..."
                                            value={attSession.label}
                                            onChange={e => setAttSession(p => ({ ...p, label: e.target.value }))}
                                            onBlur={generateQR} // regenerate on blur
                                        />
                                    </div>
                                </div>
                                <div className="qr-display-area">
                                    {qrValue ? (
                                        <div className="qr-active">
                                            <div className="qr-box">
                                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`} alt="Attendance QR Code" width={200} height={200} style={{ display: 'block' }} />
                                            </div>
                                            <div className="qr-timer">
                                                <span className="timer-text">Expires in: <strong>{countdown}s</strong></span>
                                                <div className="progress-bar-bg">
                                                    <div className="progress-bar-fill" style={{ width: `${(countdown / QR_DURATION) * 100}%` }} />
                                                </div>
                                            </div>
                                            <button className="primary-btn" style={{ '--btn-color': '#f87171', '--btn-hover': '#dc2626', width: '100%', justifyContent: 'center', marginTop: 15 }} onClick={() => setQrValue('')}>
                                                Stop Scanning Early
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="qr-placeholder">
                                            <div style={{ opacity: 0.15, marginBottom: 15, pointerEvents: 'none', filter: 'blur(2px)' }}>
                                                <img src="https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=placeholder" alt="Placeholder QR" width={200} height={200} style={{ display: 'block' }} />
                                            </div>
                                            <p style={{ fontWeight: '500', color: '#4b5563' }}>Scanner is idle</p>
                                            <button className="primary-btn" style={{ '--btn-color': '#f87171', '--btn-hover': '#dc2626', marginTop: 15 }} onClick={generateQR}>
                                                <FaSync style={{ marginRight: 6 }} /> Start 30s Scanner
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Log */}
                            <div className="att-log-panel">
                                <div className="scores-section-title" style={{ marginTop: 0 }}><FaUsers className="score-sec-icon" style={{ color: '#f87171' }} /> Live Attendance Log</div>
                                <div className="assignments-table">
                                    <div className="table-head" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                                        <span>Student Name</span>
                                        <span>Subject</span>
                                        <span>Time Scanned</span>
                                    </div>
                                    {attLog.length === 0 && <div className="empty-state" style={{ padding: '20px' }}>No students scanned yet.</div>}
                                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                                        {attLog.map(log => (
                                            <div key={log.id} className="table-row" style={{ gridTemplateColumns: '1fr 1fr 1fr', padding: '12px 24px' }}>
                                                <span className="row-title" style={{ fontSize: '0.9rem' }}>{log.name}</span>
                                                <span><span className="subj-pill" style={{ '--c': SUBJECT_COLORS[log.subject] || '#f87171' }}>{log.subject}</span></span>
                                                <span className="row-due">{log.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {qrValue && (
                                    <div style={{ marginTop: 15, textAlign: 'center' }}>
                                        <button className="primary-btn" style={{ '--btn-color': '#10b981', '--btn-hover': '#059669', display: 'inline-flex', fontSize: '0.8rem', padding: '6px 12px' }} onClick={simulateScan}>
                                            [Demo] Simulate Student Scan
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
