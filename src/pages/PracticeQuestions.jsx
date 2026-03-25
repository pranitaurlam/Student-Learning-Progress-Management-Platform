import { useState } from 'react';
import { FaChevronRight, FaDatabase, FaProjectDiagram, FaLaptopCode, FaBrain } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import subjectsData from '../data/questionsData';
import './PracticeQuestions.css';

const ICONS = {
    FaDatabase: <FaDatabase />,
    FaProjectDiagram: <FaProjectDiagram />,
    FaLaptopCode: <FaLaptopCode />,
    FaBrain: <FaBrain />,
};

export default function PracticeQuestions() {
    const [selectedSubject, setSelectedSubject] = useState(subjectsData[0]);
    const navigate = useNavigate();

    const handleOpenQuestion = (subjectId, questionId) => {
        navigate(`/practice-questions/${subjectId}/${questionId}`);
    };

    const getDiffClass = (d) => d.toLowerCase();

    return (
        <div className="practice-page pb-20">
            <div className="practice-header">
                <div className="container">
                    <h1>Practice Questions</h1>
                    <p>Select a subject, then click a question to view the full problem.</p>
                </div>
            </div>

            <div className="container practice-content">
                <div className="subjects-sidebar">
                    <h3>Subjects</h3>
                    <div className="subjects-list">
                        {subjectsData.map(subject => (
                            <button
                                key={subject.id}
                                className={`subject-btn ${selectedSubject.id === subject.id ? 'active' : ''}`}
                                onClick={() => setSelectedSubject(subject)}
                            >
                                <span className="subject-icon" style={{ color: subject.color }}>
                                    {ICONS[subject.iconName]}
                                </span>
                                <span className="subject-name">{subject.name}</span>
                                <FaChevronRight className="subject-arrow" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="papers-main">
                    <div className="papers-header" style={{ borderBottomColor: selectedSubject.color }}>
                        <h2>{selectedSubject.name}</h2>
                        <p>{selectedSubject.description}</p>
                    </div>

                    <div className="papers-grid">
                        {selectedSubject.questions.map((q) => (
                            <div
                                key={q.id}
                                className="paper-card clickable"
                                onClick={() => handleOpenQuestion(selectedSubject.id, q.id)}
                            >
                                <div className="paper-info">
                                    <h4>{q.title}</h4>
                                    <span className="problem-code">{q.code}</span>
                                    <div className="paper-meta">
                                        <span className={`difficulty-badge ${getDiffClass(q.difficulty)}`}>
                                            {q.difficulty}
                                        </span>
                                        <span>•</span>
                                        <span>Rating: {q.rating}</span>
                                    </div>
                                </div>
                                <button
                                    className="start-paper-btn"
                                    style={{ backgroundColor: selectedSubject.color }}
                                    onClick={(e) => { e.stopPropagation(); handleOpenQuestion(selectedSubject.id, q.id); }}
                                >
                                    View Question →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
