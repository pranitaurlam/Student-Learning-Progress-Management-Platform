import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    FaFire,
    FaQuestionCircle,
    FaTrophy,
    FaClipboardList,
    FaPenFancy,
    FaBookOpen,
    FaBullhorn,
    FaCalendarAlt,
    FaFolderOpen,
    FaVideo,
    FaAward,
} from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
} from "recharts";
import "./Dashboard.css";

const PIE_COLORS = ["#22c55e", "#f97316", "#ef4444"];

const SUBJECT_LABELS = {
    "ai-ml": "AI/ML",
    "dsa": "DSA",
    "web-dev": "Web Dev",
    "dbms": "DBMS",
    "python": "Python",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem("mindforge_test_history") || "[]");
    } catch {
        return [];
    }
}

function computeAnalytics(history) {
    if (history.length === 0) {
        return {
            performanceData: DAYS.map((d) => ({ day: d, accuracy: 0 })),
            topicData: Object.values(SUBJECT_LABELS).map((t) => ({ topic: t, accuracy: 0 })),
            difficultyData: [
                { name: "Easy", value: 0 },
                { name: "Medium", value: 0 },
                { name: "Hard", value: 0 },
            ],
            timeSpentData: Object.values(SUBJECT_LABELS).map((t) => ({ topic: t, minutes: 0 })),
            totalQuestions: 0,
            avgAccuracy: 0,
            testsCompleted: history.length,
        };
    }

    // Performance Trend — accuracy per day of week (last 7 unique days attempted)
    const byDay = {};
    history.forEach((r) => {
        const d = DAYS[new Date(r.date).getDay()];
        if (!byDay[d]) byDay[d] = { sum: 0, count: 0 };
        byDay[d].sum += r.accuracy;
        byDay[d].count += 1;
    });
    const performanceData = DAYS.map((d) =>
        byDay[d]
            ? { day: d, accuracy: Math.round(byDay[d].sum / byDay[d].count) }
            : { day: d, accuracy: 0 }
    );

    // Topic Performance — avg accuracy per subject
    const bySubject = {};
    history.forEach((r) => {
        const label = SUBJECT_LABELS[r.subject] || r.subject;
        if (!bySubject[label]) bySubject[label] = { sum: 0, count: 0 };
        bySubject[label].sum += r.accuracy;
        bySubject[label].count += 1;
    });
    const topicData = Object.entries(SUBJECT_LABELS).map(([, label]) => ({
        topic: label,
        accuracy: bySubject[label]
            ? Math.round(bySubject[label].sum / bySubject[label].count)
            : 0,
    }));

    // Difficulty distribution — count of tests per difficulty
    const diffCount = { Easy: 0, Medium: 0, Hard: 0 };
    history.forEach((r) => {
        if (diffCount[r.difficulty] !== undefined) diffCount[r.difficulty]++;
    });
    const diffTotal = Object.values(diffCount).reduce((a, b) => a + b, 0) || 1;
    const difficultyData = [
        { name: "Easy", value: Math.round((diffCount.Easy / diffTotal) * 100) },
        { name: "Medium", value: Math.round((diffCount.Medium / diffTotal) * 100) },
        { name: "Hard", value: Math.round((diffCount.Hard / diffTotal) * 100) },
    ];

    // Time Spent — total seconds per subject → minutes
    const timeBySubject = {};
    history.forEach((r) => {
        const label = SUBJECT_LABELS[r.subject] || r.subject;
        timeBySubject[label] = (timeBySubject[label] || 0) + (r.timeUsed || 0);
    });
    const timeSpentData = Object.entries(SUBJECT_LABELS).map(([, label]) => ({
        topic: label,
        minutes: Math.round((timeBySubject[label] || 0) / 60),
    }));

    // Summary stats
    const totalQuestions = history.reduce((s, r) => s + r.attempted, 0);
    const avgAccuracy = Math.round(
        history.reduce((s, r) => s + r.accuracy, 0) / history.length
    );

    return {
        performanceData,
        topicData,
        difficultyData,
        timeSpentData,
        totalQuestions,
        avgAccuracy,
        testsCompleted: history.length,
    };
}

const assignmentsData = [
    {
        id: 1,
        title: "Neural Networks Basics",
        subject: "AI/ML",
        due: "Today, 11:59 PM",
        status: "Pending",
    },
    {
        id: 2,
        title: "Binary Trees Implementation",
        subject: "DSA",
        due: "Tomorrow",
        status: "Pending",
    },
    {
        id: 3,
        title: "React Hooks Deep Dive",
        subject: "Web Dev",
        due: "In 2 days",
        status: "In Progress",
    },
];

const announcementsData = [
    {
        id: 1,
        title: "Hackathon Registration Open",
        date: "Just now",
        content: "Register for the upcoming code-fest!",
    },
    {
        id: 2,
        title: "New Python Course Added",
        date: "2 hours ago",
        content: "Explore the new advanced Python modules.",
    },
    {
        id: 3,
        title: "Server Maintenance",
        date: "Yesterday",
        content: "Scheduled maintenance on Sunday 2 AM.",
    },
];

// Dynamic Timetable is now used

const studyMaterialData = [
    {
        id: 1,
        title: "DBMS Full Notes.pdf",
        size: "2.5 MB",
        type: "PDF",
        url: "/study-materials/dbms-notes.html",
    },
    {
        id: 2,
        title: "Python Cheatsheet.pdf",
        size: "1.2 MB",
        type: "PDF",
        url: "/study-materials/python-cheatsheet.html",
    },
    {
        id: 3,
        title: "AI Research Paper.pdf",
        size: "500 KB",
        type: "PDF",
        url: "/study-materials/ai-research-paper.html",
    },
];

function getStreakData() {
    const getDefaultStreak = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return {
            streak: 0,
            longest: 0,
            points: 0,
            lastDate: yesterday.toDateString(),
            pressedToday: false,
        };
    };

    const saved = localStorage.getItem("mindforge_streak");
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
    const [analytics, setAnalytics] = useState(() => computeAnalytics(loadHistory()));
    const [timetable, setTimetable] = useState([]);
    const [recordings, setRecordings] = useState([]);

    useEffect(() => {
        const loadTt = () => {
            const stored = localStorage.getItem('mindforge_timetable');
            if (stored) setTimetable(JSON.parse(stored));
        };
        const loadRecordings = () => {
            const request = indexedDB.open('mindforge_db', 1);
            request.onsuccess = e => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('recordings')) return;
                const tx = db.transaction('recordings', 'readonly');
                const store = tx.objectStore('recordings');
                const getReq = store.getAll();
                getReq.onsuccess = () => {
                    // sort by newest first
                    const recs = (getReq.result || []).sort((a, b) => b.id - a.id);
                    // Create ObjectURLs directly
                    const mappedRecs = recs.map(r => ({ ...r, videoUrl: URL.createObjectURL(r.blob) }));
                    setRecordings(mappedRecs);
                };
            };
        };

        loadTt();
        loadRecordings();
        const interval = setInterval(() => {
            loadTt();
            loadRecordings();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Re-compute analytics whenever the page becomes visible (user returns from a test)
    useEffect(() => {
        const refresh = () => setAnalytics(computeAnalytics(loadHistory()));
        window.addEventListener("focus", refresh);
        return () => window.removeEventListener("focus", refresh);
    }, []);
    const [assignments, setAssignments] = useState([
        {
            id: 1,
            title: "Neural Networks Basics",
            subject: "AI/ML",
            due: "Today, 11:59 PM",
            status: "Pending",
            file: null,
        },
        {
            id: 2,
            title: "Binary Trees Implementation",
            subject: "DSA",
            due: "Tomorrow",
            status: "Pending",
            file: null,
        },
        {
            id: 3,
            title: "React Hooks Deep Dive",
            subject: "Web Dev",
            due: "In 2 days",
            status: "In Progress",
            file: null,
        },
    ]);

    const goToMockTests = () => navigate("/mock-tests");
    const goToPracticeQuestions = () => navigate("/practice-questions");

    useEffect(() => {
        const { pressedToday, ...rest } = streakData;
        localStorage.setItem("mindforge_streak", JSON.stringify(rest));
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
        setAssignments((prev) =>
            prev.map((item) => (item.id === id ? { ...item, file: file } : item)),
        );
    };

    const handleSubmitAssignment = (id) => {
        setAssignments((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, status: "Submitted" } : item,
            ),
        );
        alert("Assignment Submitted Successfully!");
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
                            <p>
                                Ask our AI Tutor for instant explanations and step-by-step help.
                            </p>
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
                        className={`streak-btn ${streakData.pressedToday ? "disabled" : ""}`}
                        onClick={handleStreakPress}
                        disabled={streakData.pressedToday}
                    >
                        {streakData.pressedToday
                            ? "✅ Checked In Today!"
                            : "🔥 Check In Today"}
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <FaQuestionCircle className="stat-card-icon purple" />
                            <span>Questions Answered</span>
                        </div>
                        <div className="stat-value">{analytics.totalQuestions}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <MdCheckCircle className="stat-card-icon green" />
                            <span>Accuracy</span>
                        </div>
                        <div className="stat-value">{analytics.testsCompleted > 0 ? `${analytics.avgAccuracy}%` : "0%"}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <FaTrophy className="stat-card-icon red" />
                            <span>Tests Completed</span>
                        </div>
                        <div className="stat-value">{analytics.testsCompleted}</div>
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
                                if (e.key === "Enter" || e.key === " ") goToMockTests();
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
                                if (e.key === "Enter" || e.key === " ") goToPracticeQuestions();
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
                        <div
                            className="action-card live-class"
                            onClick={() => navigate("/live-class")}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") navigate("/live-class");
                            }}
                        >
                            <div className="action-icon-wrapper">
                                <FaVideo className="action-icon" />
                            </div>
                            <div className="action-content">
                                <h3>Live Class</h3>
                                <p>Join an ongoing or upcoming live lecture with your instructors.</p>
                                <button
                                    type="button"
                                    className="action-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate("/live-class");
                                    }}
                                >
                                    Join Class →
                                </button>
                            </div>
                        </div>
                        <div
                            className="action-card certificates"
                            onClick={() => navigate("/certificates")}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") navigate("/certificates");
                            }}
                        >
                            <div className="action-icon-wrapper">
                                <FaAward className="action-icon" />
                            </div>
                            <div className="action-content">
                                <h3>Certificates</h3>
                                <p>View earned certificates and upload external ones.</p>
                                <button
                                    type="button"
                                    className="action-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate("/certificates");
                                    }}
                                >
                                    View Now →
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
                                {assignments.map((item) => (
                                    <div key={item.id} className="update-item">
                                        <div className="update-info">
                                            <h4>{item.title}</h4>
                                            <div className="update-meta">
                                                <span className="subject-tag">{item.subject}</span>
                                                <span className="due-date">Due: {item.due}</span>
                                            </div>
                                            {item.status !== "Submitted" && (
                                                <div className="assignment-upload">
                                                    <input
                                                        type="file"
                                                        id={`file-${item.id}`}
                                                        className="file-input"
                                                        onChange={(e) =>
                                                            handleFileUpload(item.id, e.target.files[0])
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`file-${item.id}`}
                                                        className="upload-btn"
                                                    >
                                                        {item.file ? item.file.name : "Upload File"}
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
                                        <div
                                            className={`status-badge ${item.status.toLowerCase().replace(" ", "-")}`}
                                        >
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
                                {announcementsData.map((item) => (
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
                                {timetable.length > 0 ? timetable.slice(0, 3).map((item) => (
                                    <div key={item.id} className="update-item">
                                        <div className="update-info">
                                            <h4>{item.subject}</h4>
                                            <div className="update-meta">
                                                <span className="subject-tag">{item.time}</span>
                                                <span className="due-date">{item.topic}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="empty-msg" style={{ padding: '20px', fontSize: '0.8rem', opacity: 0.5 }}>No classes scheduled today.</p>
                                )}
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
                                {studyMaterialData.map((item) => (
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

                        {/* Recorded Classes Card */}
                        <div className="update-card recorded-classes">
                            <div className="update-header">
                                <div className="update-title">
                                    <FaVideo className="update-icon" style={{ color: '#ef4444' }} />
                                    <h3>Recorded Classes</h3>
                                </div>
                                <span className="view-all">View Archive</span>
                            </div>
                            <div className="update-list">
                                {recordings.length > 0 ? recordings.map((item) => (
                                    <a
                                        key={item.id}
                                        href={item.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="update-item study-item"
                                    >
                                        <div className="update-info">
                                            <h4>{item.subject} - {item.topic}</h4>
                                            <div className="update-meta">
                                                <span className="subject-tag">Video Recording</span>
                                                <span className="due-date">{item.date}</span>
                                            </div>
                                        </div>
                                    </a>
                                )) : (
                                    <p className="empty-msg" style={{ padding: '20px', fontSize: '0.8rem', opacity: 0.5 }}>No recorded sessions available yet.</p>
                                )}
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
                                    <LineChart data={analytics.performanceData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.08)"
                                        />
                                        <XAxis
                                            dataKey="day"
                                            stroke="rgba(255,255,255,0.4)"
                                            fontSize={12}
                                        />
                                        <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                background: "#1e1b4b",
                                                border: "1px solid rgba(139,92,246,0.3)",
                                                borderRadius: 8,
                                                color: "#fff",
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="accuracy"
                                            stroke="#a78bfa"
                                            strokeWidth={2}
                                            dot={{ fill: "#a78bfa", r: 4 }}
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
                                    <BarChart data={analytics.topicData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.08)"
                                        />
                                        <XAxis
                                            dataKey="topic"
                                            stroke="rgba(255,255,255,0.4)"
                                            fontSize={12}
                                        />
                                        <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                background: "#1e1b4b",
                                                border: "1px solid rgba(139,92,246,0.3)",
                                                borderRadius: 8,
                                                color: "#fff",
                                            }}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="accuracy"
                                            fill="#7c3aed"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Question Difficulty */}
                        <div className="chart-card">
                            <h3>Question Difficulty</h3>
                            <p className="chart-subtitle">
                                Distribution of attempted questions
                            </p>
                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.difficultyData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {analytics.difficultyData.map((_, idx) => (
                                                <Cell key={idx} fill={PIE_COLORS[idx]} />
                                            ))}
                                        </Pie>
                                        <Legend
                                            wrapperStyle={{
                                                color: "rgba(255,255,255,0.7)",
                                                fontSize: 12,
                                            }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: "#1e1b4b",
                                                border: "1px solid rgba(139,92,246,0.3)",
                                                borderRadius: 8,
                                                color: "#fff",
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
                                    <BarChart data={analytics.timeSpentData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.08)"
                                        />
                                        <XAxis
                                            dataKey="topic"
                                            stroke="rgba(255,255,255,0.4)"
                                            fontSize={12}
                                        />
                                        <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                background: "#1e1b4b",
                                                border: "1px solid rgba(139,92,246,0.3)",
                                                borderRadius: 8,
                                                color: "#fff",
                                            }}
                                        />
                                        <Bar
                                            dataKey="minutes"
                                            fill="#e040a0"
                                            radius={[4, 4, 0, 0]}
                                        />
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
