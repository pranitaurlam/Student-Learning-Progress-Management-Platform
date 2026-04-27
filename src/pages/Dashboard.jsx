
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import {
  FaFire,
  FaQuestionCircle,
  FaTrophy,
  FaClipboardList,
  FaPenFancy,
  FaFolderOpen,
} from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import "./Dashboard.css";

const PIE_COLORS = ["#22c55e", "#f97316", "#ef4444"];

const SUBJECT_LABELS = {
  "ai-ml": "AI/ML",
  dsa: "DSA",
  "web-dev": "Web Dev",
  dbms: "DBMS",
  python: "Python",
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
      topicData: Object.values(SUBJECT_LABELS).map((t) => ({
        topic: t,
        accuracy: 0,
      })),
      difficultyData: [
        { name: "Easy", value: 0 },
        { name: "Medium", value: 0 },
        { name: "Hard", value: 0 },
      ],
      timeSpentData: Object.values(SUBJECT_LABELS).map((t) => ({
        topic: t,
        minutes: 0,
      })),
      totalQuestions: 0,
      avgAccuracy: 0,
      testsCompleted: 0,
    };
  }

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

  const timeBySubject = {};
  history.forEach((r) => {
    const label = SUBJECT_LABELS[r.subject] || r.subject;
    timeBySubject[label] = (timeBySubject[label] || 0) + (r.timeUsed || 0);
  });

  const timeSpentData = Object.entries(SUBJECT_LABELS).map(([, label]) => ({
    topic: label,
    minutes: Math.round((timeBySubject[label] || 0) / 60),
  }));

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

      if (data.lastDate === today) {
        return { ...data, pressedToday: true };
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

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

function getSolvedDatesFromHistory() {
  const history = loadHistory();

  return history.reduce((acc, item) => {
    if (!item.date) return acc;

    const dateKey = new Date(item.date).toISOString().split("T")[0];

    if (!acc[dateKey]) acc[dateKey] = 0;

    acc[dateKey] += item.attempted || 1;
    return acc;
  }, {});
}

function getCalendarDays() {
  const today = new Date();
  const days = [];

  for (let i = 34; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    days.push({
      date,
      dateKey: date.toISOString().split("T")[0],
      day: date.getDate(),
    });
  }

  return days;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [streakData, setStreakData] = useState(getStreakData);
  const [analytics, setAnalytics] = useState(() =>
    computeAnalytics(loadHistory())
  );
  const [solvedDates, setSolvedDates] = useState(getSolvedDatesFromHistory);

  const [studyMaterials, setStudyMaterials] = useState([]);
  const [materialSearch, setMaterialSearch] = useState("");
  const [materialFilter, setMaterialFilter] = useState("All");

  const [focusSubject, setFocusSubject] = useState("Python");
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [focusSecondsLeft, setFocusSecondsLeft] = useState(25 * 60);
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusSessions, setFocusSessions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mindforge_focus_sessions") || "[]");
    } catch {
      return [];
    }
  });
  const [distractionCount, setDistractionCount] = useState(0);

  const [xp, setXp] = useState(
    Number(localStorage.getItem("mindforge_xp") || 0)
  );

  const xpPerLevel = 100;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const currentLevelXP = xp % xpPerLevel;
  const progressPercent = (currentLevelXP / xpPerLevel) * 100;

  const calendarDays = getCalendarDays();

  useEffect(() => {
    const interval = setInterval(() => {
      setXp(Number(localStorage.getItem("mindforge_xp") || 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8002/study-materials")
      .then((res) => res.json())
      .then((data) => setStudyMaterials(data))
      .catch((err) => console.error("Study material fetch error:", err));
  }, []);

  const filteredStudyMaterials = studyMaterials.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
      item.subject.toLowerCase().includes(materialSearch.toLowerCase());

    const matchesFilter =
      materialFilter === "All" || item.subject === materialFilter;

    return matchesSearch && matchesFilter;
  });

  const materialSubjects = [
    "All",
    ...new Set(studyMaterials.map((item) => item.subject)),
  ];

  const formatFocusTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startFocusSession = () => {
    setFocusSecondsLeft(focusMinutes * 60);
    setDistractionCount(0);
    setFocusRunning(true);
  };

  const stopFocusSession = () => {
    setFocusRunning(false);
  };

  const saveCompletedFocusSession = () => {
    const newSession = {
      subject: focusSubject,
      minutes: focusMinutes,
      distractions: distractionCount,
      date: new Date().toISOString(),
    };

    const updatedSessions = [...focusSessions, newSession];
    setFocusSessions(updatedSessions);
    localStorage.setItem(
      "mindforge_focus_sessions",
      JSON.stringify(updatedSessions)
    );

    setFocusRunning(false);
    alert("Focus session completed successfully!");
  };

  useEffect(() => {
    if (!focusRunning) return;

    if (focusSecondsLeft <= 0) {
      saveCompletedFocusSession();
      return;
    }

    const timer = setInterval(() => {
      setFocusSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [focusRunning, focusSecondsLeft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (focusRunning && document.hidden) {
        setDistractionCount((prev) => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [focusRunning]);

  useEffect(() => {
    const axisColor = "rgba(255,255,255,0.4)";
    const gridColor = "rgba(255,255,255,0.08)";

    const tooltipStyle = {
      backgroundColor: "#1e1b4b",
      titleColor: "#fff",
      bodyColor: "#ccc",
      borderColor: "rgba(139,92,246,0.3)",
      borderWidth: 1,
    };

    const axisOpts = {
      ticks: { color: axisColor, font: { size: 12 } },
      grid: { color: gridColor },
    };

    const charts = [];

    const makeChart = (id, type, labels, datasets, extra = {}) => {
      const canvas = document.getElementById(id);
      if (!canvas) return;

      charts.push(
        new Chart(canvas, {
          type,
          data: { labels, datasets },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: tooltipStyle },
            ...extra,
          },
        })
      );
    };

    makeChart(
      "chart-trend",
      "line",
      analytics.performanceData.map((d) => d.day),
      [
        {
          label: "Accuracy %",
          data: analytics.performanceData.map((d) => d.accuracy),
          borderColor: "#a78bfa",
          backgroundColor: "rgba(167,139,250,0.15)",
          pointBackgroundColor: "#a78bfa",
          tension: 0.3,
          fill: true,
        },
      ],
      { scales: { x: axisOpts, y: { ...axisOpts, min: 0, max: 100 } } }
    );

    makeChart(
      "chart-topic",
      "bar",
      analytics.topicData.map((d) => d.topic),
      [
        {
          data: analytics.topicData.map((d) => d.accuracy),
          backgroundColor: "#7c3aed",
          borderRadius: 4,
        },
      ],
      { scales: { x: axisOpts, y: { ...axisOpts, min: 0, max: 100 } } }
    );

    makeChart(
      "chart-diff",
      "doughnut",
      analytics.difficultyData.map((d) => d.name),
      [
        {
          data: analytics.difficultyData.map((d) => d.value),
          backgroundColor: PIE_COLORS,
          borderWidth: 2,
          borderColor: "#1e1b4b",
        },
      ],
      {
        cutout: "60%",
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "rgba(255,255,255,0.7)",
              font: { size: 12 },
            },
          },
        },
      }
    );

    makeChart(
      "chart-time",
      "bar",
      analytics.timeSpentData.map((d) => d.topic),
      [
        {
          data: analytics.timeSpentData.map((d) => d.minutes),
          backgroundColor: "#e040a0",
          borderRadius: 4,
        },
      ],
      { scales: { x: axisOpts, y: { ...axisOpts, min: 0 } } }
    );

    return () => charts.forEach((c) => c.destroy());
  }, [analytics]);

  useEffect(() => {
    const refresh = () => {
      const history = loadHistory();
      setAnalytics(computeAnalytics(history));
      setSolvedDates(getSolvedDatesFromHistory());
    };

    window.addEventListener("focus", refresh);

    const handleStorage = (e) => {
      if (e.key === "mindforge_test_history") refresh();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    const { pressedToday, ...rest } = streakData;
    localStorage.setItem("mindforge_streak", JSON.stringify(rest));
  }, [streakData]);

  const goToMockTests = () => navigate("/mock-tests");
  const goToPracticeQuestions = () => navigate("/practice-questions");

  const handleStreakPress = () => {
    const today = new Date().toDateString();

    if (streakData.lastDate === today) return;

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

  return (
    <div className="dashboard-page">
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
            className={`streak-btn ${
              streakData.pressedToday ? "disabled" : ""
            }`}
            onClick={handleStreakPress}
            disabled={streakData.pressedToday}
          >
            {streakData.pressedToday
              ? "✅ Checked In Today!"
              : "🔥 Check In Today"}
          </button>
        </div>

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
            <div className="stat-value">
              {analytics.testsCompleted > 0
                ? `${analytics.avgAccuracy}%`
                : "0%"}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <FaTrophy className="stat-card-icon red" />
              <span>Tests Completed</span>
            </div>
            <div className="stat-value">{analytics.testsCompleted}</div>
          </div>
        </div>

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
                if (e.key === "Enter" || e.key === " ")
                  goToPracticeQuestions();
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

        <section className="updates-section">
          <div className="updates-grid">
            {/* <div className="update-card assignments">
              <div className="update-header">
                <div className="update-title">
                  <FaTrophy className="update-icon" />
                  <h3>Gamification</h3>
                </div>
                <span className="view-all">Level System</span>
              </div>

              <div className="update-list">
                <div className="update-item gamification-box">
                  <div className="update-info">
                    <h4>Level {level}</h4>

                    <p className="update-content">
                      Earn XP by solving problems and level up your skills.
                    </p>

                    <div className="update-meta" style={{ marginTop: "10px" }}>
                      <span className="subject-tag">
                        XP: {currentLevelXP} / {xpPerLevel}
                      </span>
                      <span className="due-date">Total XP: {xp}</span>
                    </div>

                    <div
                      style={{
                        marginTop: "12px",
                        width: "100%",
                        height: "10px",
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${progressPercent}%`,
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #a855f7, #ec4899)",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>

                    <p className="update-content" style={{ marginTop: "12px" }}>
                      🔥 Keep solving questions to reach Level {level + 1}
                    </p>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="update-card assignments">
  <div className="update-header">
    <div className="update-title">
      <FaTrophy className="update-icon" />
      <h3>Gamification</h3>
    </div>
    <span className="view-all">Level System</span>
  </div>

  <div className="update-list">
    <div className="update-item gamification-box">
      <div className="update-info gamification-content">
        <div className="level-badge">🏆</div>

        <h4>Level {level}</h4>

        <p className="update-content">
          Earn XP by solving problems and level up your skills.
        </p>

        <div className="update-meta" style={{ marginTop: "10px" }}>
          <span className="subject-tag">
            XP: {currentLevelXP} / {xpPerLevel}
          </span>
          <span className="due-date">Total XP: {xp}</span>
        </div>

        <div className="xp-bar">
          <div
            className="xp-progress"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="gamification-bottom">
          <div className="achievement-card">
            <span>🔥</span>
            <p>Reach Level {level + 1}</p>
          </div>

          <div className="achievement-card">
            <span>⚡</span>
            <p>{xpPerLevel - currentLevelXP} XP left</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

            <div className="update-card announcements">
              <div className="update-header">
                <div className="update-title">
                  <FaFire className="update-icon" />
                  <h3>Study Mode</h3>
                </div>
                <span className="view-all">Focus Session</span>
              </div>

              <div className="update-list">
                <div className="update-item">
                  <div className="update-info">
                    <h4>Pomodoro Focus Timer</h4>
                    <p className="update-content">
                      Stay focused and avoid switching tabs while studying.
                    </p>

                    <select
                      value={focusSubject}
                      onChange={(e) => setFocusSubject(e.target.value)}
                      disabled={focusRunning}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.08)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.1)",
                        marginTop: "10px",
                        outline: "none",
                      }}
                    >
                      <option style={{ color: "black" }}>Python</option>
                      <option style={{ color: "black" }}>DSA</option>
                      <option style={{ color: "black" }}>DBMS</option>
                      <option style={{ color: "black" }}>AI/ML</option>
                      <option style={{ color: "black" }}>Web Dev</option>
                    </select>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      {[25, 45, 60].map((min) => (
                        <button
                          key={min}
                          disabled={focusRunning}
                          onClick={() => {
                            setFocusMinutes(min);
                            setFocusSecondsLeft(min * 60);
                          }}
                          className="upload-btn"
                          style={{
                            borderColor:
                              focusMinutes === min
                                ? "#e040a0"
                                : "rgba(255,255,255,0.2)",
                          }}
                        >
                          {min} min
                        </button>
                      ))}
                    </div>

                    <div
                      style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        marginTop: "15px",
                        color: "#fff",
                      }}
                    >
                      {formatFocusTime(focusSecondsLeft)}
                    </div>

                    <div className="update-meta" style={{ marginTop: "10px" }}>
                      <span className="subject-tag">
                        Distractions: {distractionCount}
                      </span>
                      <span className="due-date">
                        Sessions: {focusSessions.length}
                      </span>
                    </div>

                    <p className="update-content" style={{ marginTop: "10px" }}>
                      {focusRunning
                        ? "🚫 Distraction Blocker Active"
                        : "Choose a duration and start your focus session."}
                    </p>

                    <div style={{ marginTop: "12px" }}>
                      {!focusRunning ? (
                        <button
                          className="submit-btn"
                          onClick={startFocusSession}
                        >
                          Start Focus
                        </button>
                      ) : (
                        <button className="upload-btn" onClick={stopFocusSession}>
                          Stop
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="updates-section">
          <div className="updates-grid">
            <div className="update-card timetable">
              <div className="update-header">
                <div className="update-title">
                  <FaFire className="update-icon" />
                  <h3>Study Streak Calendar</h3>
                </div>
                <span className="view-all">Last 35 Days</span>
              </div>

              <div className="update-list">
                <p className="update-content">
                  Green boxes show the days when problems were solved.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, minmax(24px, 1fr))",
                    gap: "8px",
                    marginTop: "14px",
                  }}
                >
                  {calendarDays.map((item) => {
                    const solvedCount = solvedDates[item.dateKey] || 0;

                    return (
                      <div
                        key={item.dateKey}
                        title={`${item.dateKey} - ${solvedCount} problems solved`}
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "600",
                          color:
                            solvedCount > 0
                              ? "#ffffff"
                              : "rgba(255,255,255,0.55)",
                          background:
                            solvedCount >= 10
                              ? "#15803d"
                              : solvedCount >= 5
                              ? "#16a34a"
                              : solvedCount >= 1
                              ? "#22c55e"
                              : "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {item.day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="update-card study-material">
              <div className="update-header">
                <div className="update-title">
                  <FaFolderOpen className="update-icon" />
                  <h3>Study Material</h3>
                </div>
                <span className="view-all">Browse All</span>
              </div>

              <div className="update-list">
                <input
                  type="text"
                  placeholder="Search language/material..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    marginBottom: "10px",
                    outline: "none",
                  }}
                />

                <select
                  value={materialFilter}
                  onChange={(e) => setMaterialFilter(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    marginBottom: "12px",
                    outline: "none",
                  }}
                >
                  {materialSubjects.map((subject) => (
                    <option
                      key={subject}
                      value={subject}
                      style={{ color: "black" }}
                    >
                      {subject}
                    </option>
                  ))}
                </select>

                <div
                  style={{
                    maxHeight: "330px",
                    overflowY: "auto",
                    paddingRight: "6px",
                  }}
                >
                  {filteredStudyMaterials.length > 0 ? (
                    filteredStudyMaterials.map((item) => (
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
                            <span className="subject-tag">{item.subject}</span>
                            <span className="due-date">{item.type}</span>
                            <span className="due-date">{item.level}</span>
                          </div>
                        </div>
                      </a>
                    ))
                  ) : (
                    <p className="update-content">No study material found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="analytics-section">
          <h2>Performance Analytics</h2>

          <div className="analytics-grid">
            <div className="chart-card">
              <h3>Performance Trend</h3>
              <p className="chart-subtitle">Accuracy over time</p>

              <div className="chart-wrapper">
                <canvas
                  id="chart-trend"
                  role="img"
                  aria-label="Line chart of accuracy per day of week"
                />
              </div>
            </div>

            <div className="chart-card">
              <h3>Topic Performance</h3>
              <p className="chart-subtitle">Accuracy by topic</p>

              <div className="chart-wrapper">
                <canvas
                  id="chart-topic"
                  role="img"
                  aria-label="Bar chart of accuracy by topic"
                />
              </div>
            </div>

            <div className="chart-card">
              <h3>Question Difficulty</h3>
              <p className="chart-subtitle">
                Distribution of attempted questions
              </p>

              <div className="chart-wrapper">
                <canvas
                  id="chart-diff"
                  role="img"
                  aria-label="Donut chart of difficulty distribution"
                />
              </div>
            </div>

            <div className="chart-card">
              <h3>Time Spent</h3>
              <p className="chart-subtitle">Estimated minutes per topic</p>

              <div className="chart-wrapper">
                <canvas
                  id="chart-time"
                  role="img"
                  aria-label="Bar chart of time spent per topic"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
