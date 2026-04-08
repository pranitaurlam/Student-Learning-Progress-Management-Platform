import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCode, FaStar, FaCheckCircle, FaTimesCircle, FaLightbulb, FaPlay } from 'react-icons/fa';
import subjectsData from '../data/questionsData';
import './QuestionDetail.css';

export default function QuestionDetail() {
    const { subjectId, questionId } = useParams();
    const [selectedOption, setSelectedOption] = useState(null);
    const [userCode, setUserCode] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [error, setError] = useState(null);
    const [studentName, setStudentName] = useState(localStorage.getItem('mindforge_student_name') || '');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    // Ensure student name exists
    useEffect(() => {
        if (!studentName) {
            const name = prompt("Please enter your name to track your practice score:");
            if (name) {
                setStudentName(name);
                localStorage.setItem('mindforge_student_name', name);
            } else {
                setStudentName('Student');
            }
        }
    }, [studentName]);

    const subject = subjectsData.find(s => s.id === subjectId);
    const question = subject?.questions.find(q => q.id === parseInt(questionId));

    useEffect(() => {
        if (question?.type === 'code') {
            setUserCode(question.starterCode);
        }
        setSelectedOption(null);
        setSubmitted(false);
        setTestResults(null);
        setError(null);
    }, [question]);

    const isCorrectMCQ = submitted && selectedOption === question?.correctOption;

    const handleSubmitMCQ = () => {
        if (selectedOption === null) return;
        setSubmitted(true);

        // ── SAVE PRACTICE SCORE TO HISTORY ──
        const isCorrect = selectedOption === question.correctOption;
        try {
            const prev = JSON.parse(localStorage.getItem('mindforge_practice_history') || '[]');
            prev.push({
                date: new Date().toISOString(),
                studentName: studentName || 'Student',
                subject: subject.name,
                questionId: `${subjectId}-${questionId}`,
                questionText: question.statement,
                correct: isCorrect,
                difficulty: question.difficulty,
            });
            localStorage.setItem('mindforge_practice_history', JSON.stringify(prev));
        } catch { /* ignore */ }

        // ── LOG MISTAKE IF INCORRECT ──
        if (selectedOption !== question.correctOption) {
            const mistake = {
                userId: 'student_1',
                questionId: `${subjectId}-${questionId}`,
                questionText: question.statement,
                selectedAnswer: question.options[selectedOption],
                correctAnswer: question.options[question.correctOption],
                explanation: question.explanation,
                topic: subject.name,
                difficulty: question.difficulty.toLowerCase()
            };

            fetch(`${API_URL}/mistakes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mistake)
            }).catch(err => console.error('Failed to log mistake:', err));
        }
    };

    const handleRunCode = () => {
        try {
            setError(null);
            const script = `
                ${userCode}
                return {
                    results: [
                        ${question.testCases.map(tc => `
                            (function() {
                                try {
                                    const result = ${tc.input.includes('let') || tc.input.includes('class') || tc.input.includes('const') ? tc.input : `typeof ${question.starterCode.match(/function\s+(\w+)/)?.[1] || question.starterCode.match(/class\s+(\w+)/)?.[1]} === 'function' || typeof ${question.starterCode.match(/function\s+(\w+)/)?.[1] || question.starterCode.match(/class\s+(\w+)/)?.[1]} === 'object' ? ${question.starterCode.match(/function\s+(\w+)/)?.[1] || question.starterCode.match(/class\s+(\w+)/)?.[1]}(${tc.input}) : eval('${tc.input}')`};
                                    return {
                                        input: \`${tc.input}\`,
                                        expected: \`${JSON.stringify(tc.expected)}\`,
                                        actual: JSON.stringify(result),
                                        passed: JSON.stringify(result) === JSON.stringify(${JSON.stringify(tc.expected)})
                                    };
                                } catch (e) {
                                    return { 
                                        input: \`${tc.input}\`,
                                        expected: \`${JSON.stringify(tc.expected)}\`,
                                        actual: "Error: " + e.message,
                                        passed: false 
                                    };
                                }
                            })()
                        `).join(',')}
                    ]
                };
            `;

            // Basic execution wrapper
            const executor = new Function(script);
            const executionOutput = executor();
            setTestResults(executionOutput.results);
            setSubmitted(true);

            // ── LOG MISTAKE IF ANY TEST CASE FAILED ──
            const failed = executionOutput.results.some(r => !r.passed);
            if (failed) {
                const mistake = {
                    userId: 'student_1',
                    questionId: `${subjectId}-${questionId}`,
                    questionText: question.statement,
                    selectedAnswer: "Code Submission (Failed Test Cases)",
                    correctAnswer: "See Solution / Pass All Test Cases",
                    explanation: "Code failed some test cases. Review logic and try again.",
                    topic: subject.name,
                    difficulty: question.difficulty.toLowerCase()
                };

                fetch(`${API_URL}/mistakes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(mistake)
                }).catch(err => console.error('Failed to log mistake:', err));
            }
        } catch (e) {
            setError(e.message);
        }
    };

    const handleReset = () => {
        setSelectedOption(null);
        setSubmitted(false);
        setTestResults(null);
        setError(null);
        if (question?.type === 'code') {
            setUserCode(question.starterCode);
        }
    };

    if (!subject || !question) {
        return (
            <div className="question-detail-page">
                <div className="container qd-not-found">
                    <h2>Question Not Found</h2>
                    <Link to="/practice-questions" className="back-link"><FaArrowLeft /> Back to Practice Questions</Link>
                </div>
            </div>
        );
    }

    const currentIdx = subject.questions.findIndex(q => q.id === parseInt(questionId));
    const prevQ = subject.questions[currentIdx - 1];
    const nextQ = subject.questions[currentIdx + 1];

    return (
        <div className="question-detail-page">
            <div className="container">
                <Link to="/practice-questions" className="back-link">
                    <FaArrowLeft /> Back to {subject.name}
                </Link>

                <div className="qd-header" style={{ borderLeftColor: subject.color }}>
                    <div className="qd-title-row">
                        <h1>{question.title}</h1>
                        <span className="problem-code-lg" style={{ color: subject.color }}>{question.code}</span>
                    </div>
                    <div className="qd-badges">
                        <span className={`difficulty-badge ${question.difficulty.toLowerCase()}`}>
                            {question.difficulty}
                        </span>
                        <span className="rating-badge">
                            <FaStar /> {question.rating}
                        </span>
                        <span className="qd-progress">
                            {currentIdx + 1} / {subject.questions.length}
                        </span>
                    </div>
                </div>

                <div className="qd-content-grid">
                    <div className="qd-left-panel">
                        <div className="qd-section">
                            <h3><FaCode /> Problem Statement</h3>
                            <div className="qd-statement">
                                {question.statement.split('\n').map((line, i) => {
                                    if (line.trim() === '') return <br key={i} />;
                                    return (
                                        <p key={i} dangerouslySetInnerHTML={{
                                            __html: line
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/`([^`]+)`/g, '<code>$1</code>')
                                        }} />
                                    );
                                })}
                            </div>
                        </div>

                        {question.type === 'mcq' && (
                            <div className="qd-section">
                                <h3>Choose Your Answer</h3>
                                <div className="options-list">
                                    {question.options.map((opt, idx) => {
                                        let cls = 'option-btn';
                                        if (submitted) {
                                            if (idx === question.correctOption) cls += ' correct';
                                            else if (idx === selectedOption) cls += ' wrong';
                                        } else if (idx === selectedOption) {
                                            cls += ' selected';
                                        }
                                        return (
                                            <button
                                                key={idx}
                                                className={cls}
                                                onClick={() => !submitted && setSelectedOption(idx)}
                                                disabled={submitted}
                                            >
                                                <span className="option-label">{String.fromCharCode(65 + idx)}.</span>
                                                <span className="option-text">{opt}</span>
                                                {submitted && idx === question.correctOption && (
                                                    <FaCheckCircle className="option-icon correct-icon" />
                                                )}
                                                {submitted && idx === selectedOption && idx !== question.correctOption && (
                                                    <FaTimesCircle className="option-icon wrong-icon" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {!submitted ? (
                                    <button
                                        className="submit-answer-btn"
                                        onClick={handleSubmitMCQ}
                                        disabled={selectedOption === null}
                                        style={{ background: selectedOption !== null ? subject.color : undefined }}
                                    >
                                        Submit Answer
                                    </button>
                                ) : (
                                    <div className={`result-banner ${isCorrectMCQ ? 'result-correct' : 'result-wrong'}`}>
                                        {isCorrectMCQ ? (
                                            <><FaCheckCircle /> Correct! Well done!</>
                                        ) : (
                                            <><FaTimesCircle /> Incorrect. The right answer is <strong>{String.fromCharCode(65 + question.correctOption)}. {question.options[question.correctOption]}</strong></>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {submitted && question.type === 'mcq' && (
                            <div className="qd-section explanation-section">
                                <h3><FaLightbulb /> Explanation</h3>
                                <p className="explanation-text">{question.explanation}</p>
                            </div>
                        )}
                    </div>

                    {question.type === 'code' && (
                        <div className="qd-right-panel">
                            <div className="qd-section editor-section">
                                <div className="editor-header">
                                    <h3><FaCode /> Code Editor</h3>
                                    <button
                                        className="run-code-btn"
                                        onClick={handleRunCode}
                                        style={{ background: subject.color }}
                                    >
                                        <FaPlay /> Run Code
                                    </button>
                                </div>
                                <textarea
                                    className="code-editor"
                                    value={userCode}
                                    onChange={(e) => setUserCode(e.target.value)}
                                    spellCheck="false"
                                />
                            </div>

                            {submitted && (
                                <div className="qd-section results-section">
                                    <h3>Test Results</h3>
                                    {error ? (
                                        <div className="error-banner">
                                            <FaTimesCircle /> {error}
                                        </div>
                                    ) : (
                                        <div className="test-cases-list">
                                            {testResults?.map((res, i) => (
                                                <div key={i} className={`test-case-item ${res.passed ? 'passed' : 'failed'}`}>
                                                    <div className="tc-header">
                                                        <span>Test Case {i + 1}</span>
                                                        {res.passed ? <FaCheckCircle /> : <FaTimesCircle />}
                                                    </div>
                                                    <div className="tc-details">
                                                        <div><strong>Input:</strong> <code>{res.input}</code></div>
                                                        <div><strong>Expected:</strong> <code>{res.expected}</code></div>
                                                        <div><strong>Actual:</strong> <code className={res.passed ? 'text-green' : 'text-red'}>{res.actual}</code></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="qd-nav">
                    {prevQ ? (
                        <Link
                            to={`/practice-questions/${subject.id}/${prevQ.id}`}
                            className="qd-nav-btn"
                            onClick={handleReset}
                        >
                            ← Previous
                        </Link>
                    ) : <span />}
                    <button className="qd-nav-btn reset-btn" onClick={handleReset}>Try Again</button>
                    {nextQ ? (
                        <Link
                            to={`/practice-questions/${subject.id}/${nextQ.id}`}
                            className="qd-nav-btn"
                            onClick={handleReset}
                        >
                            Next →
                        </Link>
                    ) : (
                        <Link to="/practice-questions" className="qd-nav-btn">
                            All Questions
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
