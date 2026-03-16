import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaFire, FaQuestionCircle, FaTrophy, FaClipboardList, FaPenFancy, FaBookOpen, FaBullhorn, FaCalendarAlt, FaFolderOpen } from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';
import { IoSchool } from 'react-icons/io5';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar,
    PieChart, Pie, Cell,
    ResponsiveContainer, Legend,
} from 'recharts';
import './Dashboard.css';

const performanceData = [
    { day: 'Mon', accuracy: 65 },
    { day: 'Tue', accuracy: 72 },
    { day: 'Wed', accuracy: 58 },
    { day: 'Thu', accuracy: 80 },
    { day: 'Fri', accuracy: 74 },
    { day: 'Sat', accuracy: 85 },
    { day: 'Sun', accuracy: 78 },
];

const topicData = [
    { topic: 'AI/ML', accuracy: 82 },
    { topic: 'DSA', accuracy: 65 },
    { topic: 'Web Dev', accuracy: 73 },
    { topic: 'DBMS', accuracy: 90 },
    { topic: 'Python', accuracy: 88 },
];

const difficultyData = [
    { name: 'Easy', value: 45 },
    { name: 'Medium', value: 35 },
    { name: 'Hard', value: 20 },
];
const PIE_COLORS = ['#22c55e', '#f97316', '#ef4444'];

const timeSpentData = [
    { topic: 'AI/ML', minutes: 120 },
    { topic: 'DSA', minutes: 90 },
    { topic: 'Web Dev', minutes: 65 },
    { topic: 'DBMS', minutes: 45 },
    { topic: 'Python', minutes: 110 },
];

const assignmentsData = [
    { id: 1, title: 'Neural Networks Basics', subject: 'AI/ML', due: 'Today, 11:59 PM', status: 'Pending' },
    { id: 2, title: 'Binary Trees Implementation', subject: 'DSA', due: 'Tomorrow', status: 'Pending' },
    { id: 3, title: 'React Hooks Deep Dive', subject: 'Web Dev', due: 'In 2 days', status: 'In Progress' },
];

const announcementsData = [
    { id: 1, title: 'Hackathon Registration Open', date: 'Just now', content: 'Register for the upcoming code-fest!' },
    { id: 2, title: 'New Python Course Added', date: '2 hours ago', content: 'Explore the new advanced Python modules.' },
    { id: 3, title: 'Server Maintenance', date: 'Yesterday', content: 'Scheduled maintenance on Sunday 2 AM.' },
];

const timetableData = [
    { id: 1, time: '10:00 AM', subject: 'DBMS', topic: 'Normalization' },
    { id: 2, time: '11:30 AM', subject: 'Python', topic: 'Decorators' },
    { id: 3, time: '02:00 PM', subject: 'AI/ML', topic: 'Backpropagation' },
];

const studyMaterialData = [
    { id: 1, title: 'DBMS Full Notes.pdf', size: '2.5 MB', type: 'PDF', url: '/study-materials/dbms-notes.html' },
    { id: 2, title: 'Python Cheatsheet.pdf', size: '1.2 MB', type: 'PDF', url: '/study-materials/python-cheatsheet.html' },
    { id: 3, title: 'AI Research Paper.pdf', size: '500 KB', type: 'PDF', url: '/study-materials/ai-research-paper.html' },
];

function getStreakData() {
    const getDefaultStreak = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return { streak: 0, longest: 0, points: 0, lastDate: yesterday.toDateString(), pressedToday: false };
    };

    const saved = localStorage.getItem('mindforge_streak');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            const today = new Date().toDateString();

            // If they already pressed today, return as is
            if (data.lastDate === today) {
                return { ...data, pressedToday: true };
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            // If the last pressed date is NOT yesterday, the streak is broken
            if (data.lastDate !== yesterday.toDateString()) {
                data.streak = 0;
            }

            return { ...data, pressedToday: false };
        } catch {
            return getDefaultStreak();
        }
    }

    return getDefaultStreak();
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [streakData, setStreakData] = useState(getStreakData);
    const [assignments, setAssignments] = useState([
        { id: 1, title: 'Neural Networks Basics', subject: 'AI/ML', due: 'Today, 11:59 PM', status: 'Pending', file: null },
        { id: 2, title: 'Binary Trees Implementation', subject: 'DSA', due: 'Tomorrow', status: 'Pending', file: null },
        { id: 3, title: 'React Hooks Deep Dive', subject: 'Web Dev', due: 'In 2 days', status: 'In Progress', file: null },
    ]);

    const goToMockTests = () => navigate('/mock-tests');
    const goToPracticeQuestions = () => navigate('/practice-questions');


    useEffect(() => {
        const { pressedToday, ...rest } = streakData;
        localStorage.setItem('mindforge_streak', JSON.stringify(rest));
    }, [streakData]);

    const handleStreakPress = () => {
        const today = new Date().toDateString();
        if (streakData.lastDate === today) return; // already pressed today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = streakData.lastDate === yesterday.toDateString();

        const newStreak = wasYesterday ? streakData.streak + 1 : 1;
        const newLongest = Math.max(streakData.longest, newStreak);
        const newPoints = streakData.points + 10;

        setStreakData({
            streak: newStreak,
            longest: newLongest,
            points: newPoints,
            lastDate: today,
            pressedToday: true,
        });
    };

    const handleFileUpload = (id, file) => {
        setAssignments(prev => prev.map(item =>
            item.id === id ? { ...item, file: file } : item
        ));
    };

    const handleSubmitAssignment = (id) => {
        setAssignments(prev => prev.map(item =>
            item.id === id ? { ...item, status: 'Submitted' } : item
        ));
        alert('Assignment Submitted Successfully!');
    };

    return (
        <div className="dashboard-page">
            {/* AI Banner */}
            <section className="ai-banner">
                <div className="container">
                    <div className="ai-banner-content">
                        <div className="ai-banner-icon">
                            <IoSchool />
                        </div>
                        <div>
                            <h3>Stuck on a problem?</h3>
                            <p>Ask our AI Tutor for instant explanations and step-by-step help.</p>
                        </div>
                    </div>
                    <Link to="/ai-chat">
                        <button className="ai-banner-btn">Ask AI Doubt Chat →</button>
                    </Link>
                </div>
            </section>

            <div className="container">
                {/* Streak */}
                <div className="streak-card">
                    <div className="streak-header">
                        <FaFire className="streak-icon" />
                        <h3>Daily Streak</h3>
                    </div>
                    <div className="streak-count">{streakData.streak}</div>
                    <div className="streak-label">days in a row!</div>
                    <div className="streak-meta">
                        <span>Longest streak: {streakData.longest} days</span>
                        <span>Total points: {streakData.points}</span>
                    </div>
                    <button
                        className={`streak-btn ${streakData.pressedToday ? 'disabled' : ''}`}
                        onClick={handleStreakPress}
                        disabled={streakData.pressedToday}
                    >
                        {streakData.pressedToday ? '✅ Checked In Today!' : '🔥 Check In Today'}
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <FaQuestionCircle className="stat-card-icon purple" />
                            <span>Questions Answered</span>
                        </div>
                        <div className="stat-value">0</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <MdCheckCircle className="stat-card-icon green" />
                            <span>Accuracy</span>
                        </div>
                        <div className="stat-value">0%</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <FaTrophy className="stat-card-icon red" />
                            <span>Tests Completed</span>
                        </div>
                        <div className="stat-value">0</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <section className="quick-actions">
                    <h2 className="section-title">Study Center</h2>
                    <div className="actions-grid">
                        <div
                            className="action-card mock-test"
                            onClick={goToMockTests}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') goToMockTests();
                            }}
                        >
                            <div className="action-icon-wrapper">
                                <FaClipboardList className="action-icon" />
                            </div>
                            <div className="action-content">
                                <h3>Mock Tests</h3>
                                <p>Take full-length exams to simulate real test conditions.</p>
                                <button
                                    type="button"
                                    className="action-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToMockTests();
                                    }}
                                >
                                    Start Test →
                                </button>
                            </div>
                        </div>
                        <div
                            className="action-card practice"
                            onClick={goToPracticeQuestions}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') goToPracticeQuestions();
                            }}
                        >
                            <div className="action-icon-wrapper">
                                <FaPenFancy className="action-icon" />
                            </div>
                            <div className="action-content">
                                <h3>Practice Questions</h3>
                                <p>Solve topic-wise questions to strengthen your weak areas.</p>
                                <button
                                    type="button"
                                    className="action-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToPracticeQuestions();
                                    }}
                                >
                                    Start Practice →
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Updates Section: Assignments & Announcements */}
                <section className="updates-section">
                    <div className="updates-grid">
                        {/* Assignments Card */}
                        <div className="update-card assignments">
                            <div className="update-header">
                                <div className="update-title">
                                    <FaBookOpen className="update-icon" />
                                    <h3>Assignments</h3>
                                </div>
                                <span className="view-all">View All</span>
                            </div>
                            <div className="update-list">
                                {assignments.map(item => (
                                    <div key={item.id} className="update-item">
                                        <div className="update-info">
                                            <h4>{item.title}</h4>
                                            <div className="update-meta">
                                                <span className="subject-tag">{item.subject}</span>
                                                <span className="due-date">Due: {item.due}</span>
                                            </div>
                                            {item.status !== 'Submitted' && (
                                                <div className="assignment-upload">
                                                    <input
                                                        type="file"
                                                        id={`file-${item.id}`}
                                                        className="file-input"
                                                        onChange={(e) => handleFileUpload(item.id, e.target.files[0])}
                                                    />
                                                    <label htmlFor={`file-${item.id}`} className="upload-btn">
                                                        {item.file ? item.file.name : 'Upload File'}
                                                    </label>
                                                    {item.file && (
                                                        <button
                                                            className="submit-btn"
                                                            onClick={() => handleSubmitAssignment(item.id)}
                                                        >
                                                            Submit
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                                            {item.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Announcements Card */}
                        <div className="update-card announcements">
                            <div className="update-header">
                                <div className="update-title">
                                    <FaBullhorn className="update-icon" />
                                    <h3>Announcements</h3>
                                </div>
                                <span className="view-all">View All</span>
                            </div>
                            <div className="update-list">
                                {announcementsData.map(item => (
                                    <div key={item.id} className="update-item">
                                        <div className="update-info">
                                            <h4>{item.title}</h4>
                                            <p className="update-content">{item.content}</p>
                                            <span className="update-date">{item.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Resources Section: Timetable & Study Material */}
                <section className="updates-section">
                    <div className="updates-grid">
                        {/* Timetable Card */}
                        <div className="update-card timetable">
                            <div className="update-header">
                                <div className="update-title">
                                    <FaCalendarAlt className="update-icon" />
                                    <h3>Timetable</h3>
                                </div>
                                <span className="view-all">Full Schedule</span>
                            </div>
                            <div className="update-list">
                                {timetableData.map(item => (
                                    <div key={item.id} className="update-item">
                                        <div className="update-info">
                                            <h4>{item.subject}</h4>
                                            <div className="update-meta">
                                                <span className="subject-tag">{item.time}</span>
                                                <span className="due-date">{item.topic}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Study Material Card */}
                        <div className="update-card study-material">
                            <div className="update-header">
                                <div className="update-title">
                                    <FaFolderOpen className="update-icon" />
                                    <h3>Study Material</h3>
                                </div>
                                <span className="view-all">Browse All</span>
                            </div>
                            <div className="update-list">
                                {studyMaterialData.map(item => (
                                    <a
                                        key={item.id}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="update-item study-item"
                                    >
                                        <div className="update-info">
                                            <h4>{item.title}</h4>
                                            <div className="update-meta">
                                                <span className="subject-tag">{item.type}</span>
                                                <span className="due-date">{item.size}</span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Performance Analytics */}
                <section className="analytics-section">
                    <h2>Performance Analytics</h2>
                    <div className="analytics-grid">
                        {/* Performance Trend */}
                        <div className="chart-card">
                            <h3>Performance Trend</h3>
                            <p className="chart-subtitle">Accuracy over time</p>
                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                                        <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                        <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                background: '#1e1b4b',
                                                border: '1px solid rgba(139,92,246,0.3)',
                                                borderRadius: 8,
                                                color: '#fff',
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="accuracy"
                                            stroke="#a78bfa"
                                            strokeWidth={2}
                                            dot={{ fill: '#a78bfa', r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Topic Performance */}
                        <div className="chart-card">
                            <h3>Topic Performance</h3>
                            <p className="chart-subtitle">Accuracy by topic</p>
                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topicData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                                        <XAxis dataKey="topic" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                        <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                background: '#1e1b4b',
                                                border: '1px solid rgba(139,92,246,0.3)',
                                                borderRadius: 8,
                                                color: '#fff',
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="accuracy" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Question Difficulty */}
                        <div className="chart-card">
                            <h3>Question Difficulty</h3>
                            <p className="chart-subtitle">Distribution of attempted questions</p>
                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={difficultyData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {difficultyData.map((_, idx) => (
                                                <Cell key={idx} fill={PIE_COLORS[idx]} />
                                            ))}
                                        </Pie>
                                        <Legend
                                            wrapperStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: '#1e1b4b',
                                                border: '1px solid rgba(139,92,246,0.3)',
                                                borderRadius: 8,
                                                color: '#fff',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Time Spent */}
                        <div className="chart-card">
                            <h3>Time Spent</h3>
                            <p className="chart-subtitle">Estimated minutes per topic</p>
                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={timeSpentData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                                        <XAxis dataKey="topic" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                        <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                background: '#1e1b4b',
                                                border: '1px solid rgba(139,92,246,0.3)',
                                                borderRadius: 8,
                                                color: '#fff',
                                            }}
                                        />
                                        <Bar dataKey="minutes" fill="#e040a0" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
