import { useState, useEffect } from 'react';
import { FaTrash, FaRedo, FaFilter, FaExclamationTriangle, FaCheckCircle, FaLightbulb, FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Mistakes.css';

const TOPICS = ['All', 'AI/ML', 'DSA', 'Web Dev', 'DBMS', 'Python'];

export default function Mistakes() {
    const navigate = useNavigate();
    const [mistakes, setMistakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterTopic, setFilterTopic] = useState('All');
    const userId = 'student_1'; // Consistent with static ID used in logging

    useEffect(() => {
        fetchMistakes();
    }, []);

    const fetchMistakes = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5001/mistakes/${userId}`);
            const data = await res.json();
            setMistakes(data);
        } catch (err) {
            console.error('Failed to fetch mistakes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRevised = async (id) => {
        try {
            await fetch(`http://localhost:5001/mistakes/${id}`, { method: 'DELETE' });
            setMistakes(mistakes.filter(m => m._id !== id));
        } catch (err) {
            console.error('Failed to delete mistake:', err);
        }
    };

    const handleReviseAll = async () => {
        if (!window.confirm('Mark all mistakes in this view as revised?')) return;

        const toDelete = filteredMistakes.map(m => m._id);
        for (const id of toDelete) {
            await fetch(`http://localhost:5001/mistakes/${id}`, { method: 'DELETE' });
        }
        setMistakes(mistakes.filter(m => !toDelete.includes(m._id)));
    };

    const filteredMistakes = filterTopic === 'All'
        ? mistakes
        : mistakes.filter(m => m.topic === filterTopic);

    // Bonus Logic: Weakest Topic
    const topicCounts = mistakes.reduce((acc, m) => {
        acc[m.topic] = (acc[m.topic] || 0) + 1;
        return acc;
    }, {});
    const weakestTopic = Object.keys(topicCounts).reduce((a, b) => topicCounts[a] > topicCounts[b] ? a : b, 'None');

    return (
        <div className="mistakes-page">
            <div className="container">
                <header className="mistakes-header">
                    <div className="header-text">
                        <h1>Error Log Book</h1>
                        <p>Track your mistakes, understand the logic, and turn weaknesses into strengths.</p>
                    </div>
                    <div className="mistakes-actions">
                        <button className="revise-all-btn" onClick={handleReviseAll} disabled={filteredMistakes.length === 0}>
                            Revise All {filterTopic !== 'All' ? `in ${filterTopic}` : ''}
                        </button>
                    </div>
                </header>

                {/* Stats Summary */}
                <div className="mistakes-stats">
                    <div className="m-stat-card">
                        <FaExclamationTriangle className="m-icon red" />
                        <div className="m-stat-info">
                            <span className="m-value">{mistakes.length}</span>
                            <span className="m-label">Total Errors</span>
                        </div>
                    </div>
                    <div className="m-stat-card">
                        <FaChartBar className="m-icon purple" />
                        <div className="m-stat-info">
                            <span className="m-value">{weakestTopic}</span>
                            <span className="m-label">Weakest Area</span>
                        </div>
                    </div>
                    <div className="m-stat-card">
                        <FaCheckCircle className="m-icon green" />
                        <div className="m-stat-info">
                            <span className="m-value">0</span>
                            <span className="m-label">Revised Today</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mistakes-filters">
                    <div className="filter-label"><FaFilter /> Filter by Topic:</div>
                    <div className="topic-chips">
                        {TOPICS.map(topic => (
                            <button
                                key={topic}
                                className={`topic-chip ${filterTopic === topic ? 'active' : ''}`}
                                onClick={() => setFilterTopic(topic)}
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="m-loading">Loading your mistakes...</div>
                ) : filteredMistakes.length > 0 ? (
                    <div className="mistakes-list">
                        {filteredMistakes.map(m => (
                            <div key={m._id} className="mistake-card">
                                <div className="m-card-header">
                                    <span className={`m-diff ${m.difficulty}`}>{m.difficulty}</span>
                                    <span className="m-topic-badge">{m.topic}</span>
                                    <span className="m-date">{new Date(m.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="m-card-body">
                                    <h3 className="m-question">{m.questionText}</h3>
                                    <div className="m-answers">
                                        <div className="m-ans-row wrong">
                                            <span className="ans-label">Your Answer:</span>
                                            <span className="ans-text">{m.selectedAnswer}</span>
                                        </div>
                                        <div className="m-ans-row correct">
                                            <span className="ans-label">Correct Answer:</span>
                                            <span className="ans-text">{m.correctAnswer}</span>
                                        </div>
                                    </div>
                                    <div className="m-explanation">
                                        <h4><FaLightbulb /> Explanation</h4>
                                        <p>{m.explanation}</p>
                                    </div>
                                </div>
                                <div className="m-card-footer">
                                    <button className="m-action-btn practice" onClick={() => navigate('/practice-questions')}>
                                        <FaRedo /> Practice Again
                                    </button>
                                    <button className="m-action-btn delete" onClick={() => handleMarkRevised(m._id)}>
                                        <FaTrash /> Mark as Revised
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-mistakes">
                        <div className="empty-emoji">🎉</div>
                        <h2>No mistakes yet!</h2>
                        <p>You're doing great. Keep practicing and keep your error log clean!</p>
                        <button className="m-start-btn" onClick={() => navigate('/mock-tests')}>Take a Mock Test</button>
                    </div>
                )}
            </div>
        </div>
    );
}
