import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaUserGraduate, FaChartLine, FaArrowUp, FaUsers } from 'react-icons/fa';
import './Leaderboard.css';

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = 'student_1';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [lbRes, rankRes] = await Promise.all([
                fetch('http://localhost:5001/results/leaderboard'),
                fetch(`http://localhost:5001/results/rank/${userId}`)
            ]);

            const lbData = await lbRes.json();
            const rankData = await rankRes.json();

            setLeaderboard(lbData);
            setUserRank(rankData);
        } catch (err) {
            console.error('Failed to fetch leaderboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="leaderboard-page">
            <div className="container">
                <header className="lb-header">
                    <div className="lb-header-content">
                        <h1>Elite Leaderboard</h1>
                        <p>See where you stand among the top performers at MindForge Academy.</p>
                    </div>
                </header>

                <div className="lb-grid">
                    {/* Ranking Summary */}
                    <div className="rank-summary">
                        <div className="rank-card main">
                            <div className="rank-icon-circle">
                                <FaTrophy />
                            </div>
                            <div className="rank-info">
                                <span className="rank-number">#{userRank?.rank || '--'}</span>
                                <span className="rank-label">Your Current Rank</span>
                            </div>
                            <div className="rank-percentile">
                                <FaChartLine /> Top {userRank?.total ? Math.round((userRank.rank / userRank.total) * 100) : '--'}%
                            </div>
                        </div>

                        <div className="rank-stats">
                            <div className="lb-stat-small">
                                <FaUsers />
                                <div>
                                    <b>{userRank?.total || 0}</b>
                                    <span>Participants</span>
                                </div>
                            </div>
                            <div className="lb-stat-small">
                                <FaArrowUp />
                                <div>
                                    <b>{userRank?.userBest?.accuracy || 0}%</b>
                                    <span>Best Accuracy</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Performers Table */}
                    <div className="lb-main-table">
                        <div className="table-header">
                            <h3><FaMedal /> Top Performers</h3>
                        </div>

                        {loading ? (
                            <div className="lb-loading">Calculating standings...</div>
                        ) : (
                            <div className="lb-list">
                                {leaderboard.map((entry, index) => (
                                    <div key={entry._id} className={`lb-item ${entry.userId === userId ? 'is-user' : ''}`}>
                                        <div className={`lb-rank rank-${index + 1}`}>
                                            {index < 3 ? <FaMedal /> : index + 1}
                                        </div>
                                        <div className="lb-user">
                                            <div className="lb-avatar">
                                                <FaUserGraduate />
                                            </div>
                                            <div className="lb-user-info">
                                                <span className="lb-username">{entry.userName}</span>
                                                <span className="lb-subject">{entry.subject}</span>
                                            </div>
                                        </div>
                                        <div className="lb-score">
                                            <span className="score-val">{entry.marks} pts</span>
                                            <span className="accuracy-val">{entry.accuracy}% Acc.</span>
                                        </div>
                                    </div>
                                ))}
                                {leaderboard.length === 0 && (
                                    <div className="lb-empty">No results recorded yet. Start a test to jump on the board!</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
