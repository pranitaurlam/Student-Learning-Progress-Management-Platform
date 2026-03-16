import { useState } from 'react';
import { FaBook, FaChevronRight, FaPlayCircle } from 'react-icons/fa';
import './PracticeQuestions.css';

const subjectsData = [
    {
        id: 'aiml',
        name: 'AI / Machine Learning',
        description: 'Practice fundamental algorithms, neural networks, and model training concepts.',
        icon: <FaBook />,
        color: '#8b5cf6',
        papers: Array.from({ length: 10 }, (_, i) => ({
            id: `aiml-${i + 1}`,
            title: `Practice Paper ${i + 1}`,
            questions: 20,
            time: '30 mins',
            difficulty: i < 3 ? 'Easy' : i < 7 ? 'Medium' : 'Hard'
        }))
    },
    {
        id: 'dsa',
        name: 'Data Structures & Algorithms',
        description: 'Master arrays, trees, graphs, and dynamic programming challenges.',
        icon: <FaBook />,
        color: '#f97316',
        papers: Array.from({ length: 10 }, (_, i) => ({
            id: `dsa-${i + 1}`,
            title: `Practice Paper ${i + 1}`,
            questions: 20,
            time: '45 mins',
            difficulty: i < 3 ? 'Easy' : i < 7 ? 'Medium' : 'Hard'
        }))
    },
    {
        id: 'webdev',
        name: 'Web Development',
        description: 'Test your knowledge on HTML, CSS, React, and server-side concepts.',
        icon: <FaBook />,
        color: '#3b82f6',
        papers: Array.from({ length: 10 }, (_, i) => ({
            id: `webdev-${i + 1}`,
            title: `Practice Paper ${i + 1}`,
            questions: 15,
            time: '25 mins',
            difficulty: i < 4 ? 'Easy' : i < 8 ? 'Medium' : 'Hard'
        }))
    },
    {
        id: 'dbms',
        name: 'Database Management Systems',
        description: 'Practice SQL queries, normalization, and database design principles.',
        icon: <FaBook />,
        color: '#10b981',
        papers: Array.from({ length: 10 }, (_, i) => ({
            id: `dbms-${i + 1}`,
            title: `Practice Paper ${i + 1}`,
            questions: 25,
            time: '40 mins',
            difficulty: i < 3 ? 'Easy' : i < 7 ? 'Medium' : 'Hard'
        }))
    },
    {
        id: 'python',
        name: 'Python Programming',
        description: 'Solve problems using Python syntax, data structures, and OOP features.',
        icon: <FaBook />,
        color: '#eab308',
        papers: Array.from({ length: 10 }, (_, i) => ({
            id: `py-${i + 1}`,
            title: `Practice Paper ${i + 1}`,
            questions: 20,
            time: '30 mins',
            difficulty: i < 4 ? 'Easy' : i < 7 ? 'Medium' : 'Hard'
        }))
    }
];

export default function PracticeQuestions() {
    const [selectedSubject, setSelectedSubject] = useState(subjectsData[0]);

    const handleStartPaper = (paperId) => {
        alert(`Starting ${paperId}. Good luck!`);
    };

    return (
        <div className="practice-page pb-20">
            <div className="practice-header">
                <div className="container">
                    <h1>Practice Questions</h1>
                    <p>Select a subject to view available practice papers and sharpen your skills.</p>
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
                                    {subject.icon}
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
                        {selectedSubject.papers.map(paper => (
                            <div key={paper.id} className="paper-card">
                                <div className="paper-info">
                                    <h4>{paper.title}</h4>
                                    <div className="paper-meta">
                                        <span className={`difficulty-badge ${paper.difficulty.toLowerCase()}`}>
                                            {paper.difficulty}
                                        </span>
                                        <span>•</span>
                                        <span>{paper.questions} Qs</span>
                                        <span>•</span>
                                        <span>{paper.time}</span>
                                    </div>
                                </div>
                                <button
                                    className="start-paper-btn"
                                    style={{ backgroundColor: selectedSubject.color }}
                                    onClick={() => handleStartPaper(paper.id)}
                                >
                                    <FaPlayCircle /> Start
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
