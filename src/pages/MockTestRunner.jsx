import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaRegClock, FaChevronLeft, FaChevronRight, FaFlag, FaCheckCircle, FaListOl, FaCode, FaPenNib } from 'react-icons/fa';
import mockTestData from '../data/mockTestData';
import './MockTestRunner.css';

/* ── Paper templates (must match MockTests.jsx) ── */
const PAPER_TEMPLATES = [
  { n: 1, difficulty: 'Easy', mcq: 20, coding: 3, descriptive: 2, durationMins: 30 },
  { n: 2, difficulty: 'Easy', mcq: 18, coding: 4, descriptive: 3, durationMins: 35 },
  { n: 3, difficulty: 'Easy', mcq: 20, coding: 3, descriptive: 2, durationMins: 40 },
  { n: 4, difficulty: 'Medium', mcq: 15, coding: 7, descriptive: 5, durationMins: 50 },
  { n: 5, difficulty: 'Medium', mcq: 15, coding: 8, descriptive: 5, durationMins: 55 },
  { n: 6, difficulty: 'Medium', mcq: 12, coding: 8, descriptive: 5, durationMins: 60 },
  { n: 7, difficulty: 'Medium', mcq: 10, coding: 10, descriptive: 5, durationMins: 60 },
  { n: 8, difficulty: 'Hard', mcq: 10, coding: 10, descriptive: 5, durationMins: 75 },
  { n: 9, difficulty: 'Hard', mcq: 8, coding: 12, descriptive: 5, durationMins: 90 },
  { n: 10, difficulty: 'Hard', mcq: 5, coding: 15, descriptive: 5, durationMins: 120 },
];

const DIFF_TIER = { Easy: 'easy', Medium: 'medium', Hard: 'hard' };

function pickN(pool, n) {
  if (!pool || pool.length === 0) return [];
  const result = [];
  for (let i = 0; i < n; i++) result.push(pool[i % pool.length]);
  return result;
}

function buildQuestions(subjectKey, template) {
  const data = mockTestData[subjectKey];
  if (!data) return [];
  const tier = DIFF_TIER[template.difficulty];
  const mcqPool = data.mcq.filter(q => q.difficulty === tier);
  const codingPool = data.coding.filter(q => q.difficulty === tier);
  const descPool = data.descriptive.filter(q => q.difficulty === tier);

  const mcqs = pickN(mcqPool, template.mcq).map((q, i) => ({ ...q, _type: 'mcq', _num: i + 1 }));
  const codes = pickN(codingPool, template.coding).map((q, i) => ({ ...q, _type: 'coding', _num: mcqs.length + i + 1 }));
  const descs = pickN(descPool, template.descriptive).map((q, i) => ({ ...q, _type: 'descriptive', _num: mcqs.length + codes.length + i + 1 }));

  return [...mcqs, ...codes, ...descs];
}

function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const TYPE_ICONS = { mcq: <FaListOl />, coding: <FaCode />, descriptive: <FaPenNib /> };
const TYPE_LABELS = { mcq: 'MCQ', coding: 'Coding', descriptive: 'Descriptive' };
const DIFF_COLOR = { Easy: 'easy', Medium: 'medium', Hard: 'hard' };

export default function MockTestRunner() {
  const { subject, paperId } = useParams();

  const template = PAPER_TEMPLATES.find(t => t.n === Number(paperId));
  const questions = useRef(template ? buildQuestions(subject, template) : []).current;
  const total = questions.length;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});      // idx -> answer
  const [visited, setVisited] = useState(new Set([0]));
  const [marked, setMarked] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState((template?.durationMins ?? 30) * 60);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Timer
  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, submitted]);

  const goTo = useCallback((idx) => {
    setCurrentIdx(idx);
    setVisited(v => new Set([...v, idx]));
    setPaletteOpen(false);
  }, []);

  const handleAnswer = (idx, value) => {
    setAnswers(a => ({ ...a, [idx]: value }));
  };

  const toggleMark = () => {
    setMarked(m => {
      const next = new Set(m);
      if (next.has(currentIdx)) next.delete(currentIdx);
      else next.add(currentIdx);
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    // ── Save result to localStorage for Dashboard analytics ──
    const mcqQs = questions.filter(q => q._type === 'mcq');
    const correct = mcqQs.filter(q => {
      const idx = questions.indexOf(q);
      return answers[idx] !== undefined && Number(answers[idx]) === q.correct;
    }).length;
    const attempted = Object.keys(answers).length;
    const subjectName = subject.toUpperCase().replace('-', '/');

    const record = {
      date: new Date().toISOString(),
      subject,
      subjectName,
      paperId: Number(paperId),
      difficulty: template.difficulty,
      total: questions.length,
      attempted,
      mcqTotal: mcqQs.length,
      mcqCorrect: correct,
      accuracy: mcqQs.length > 0 ? Math.round((correct / mcqQs.length) * 100) : 0,
      timeUsed: template.durationMins * 60 - timeLeft,
    };

    try {
      const prev = JSON.parse(localStorage.getItem('mindforge_test_history') || '[]');
      prev.push(record);
      localStorage.setItem('mindforge_test_history', JSON.stringify(prev));

      // ── LOG MISTAKES TO BACKEND ──
      const mistakes = mcqQs.filter(q => {
        const idx = questions.indexOf(q);
        const chosen = answers[idx];
        return chosen !== undefined && Number(chosen) !== q.correct;
      }).map(q => {
        const idx = questions.indexOf(q);
        return {
          userId: 'student_1',
          questionId: `${subject}-${paperId}-q${q._num}`,
          questionText: q.question,
          selectedAnswer: q.options[Number(answers[idx])],
          correctAnswer: q.options[q.correct],
          explanation: q.explanation,
          topic: subjectName,
          difficulty: q.difficulty.toLowerCase()
        };
      });

      mistakes.forEach(async (m) => {
        try {
          await fetch('http://localhost:5001/mistakes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(m)
          });
        } catch (err) { console.error('Failed to log mistake:', err); }
      });

      // ── SUBMIT RESULT TO LEADERBOARD ──
      const resultData = {
        userId: 'student_1',
        userName: 'Pranita Urlam',
        subject: subjectName,
        marks: correct,
        totalQuestions: mcqQs.length,
        accuracy: record.accuracy,
        timeSpent: record.timeUsed
      };

      fetch('http://localhost:5001/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData)
      }).catch(err => console.error('Failed to submit result:', err));

    } catch { /* ignore */ }

    setSubmitted(true);
    setShowConfirm(false);
  }, [answers, questions, subject, paperId, template, timeLeft]);

  // Result calculation
  const mcqQuestions = questions.filter(q => q._type === 'mcq');
  const mcqCorrect = mcqQuestions.filter((q, _) => {
    const idx = questions.indexOf(q);
    return answers[idx] !== undefined && Number(answers[idx]) === q.correct;
  }).length;
  const answered = Object.keys(answers).length;
  const notAnswered = total - answered;
  const markedCount = marked.size;

  // Question status helper
  function qStatus(idx) {
    const isAnswered = answers[idx] !== undefined;
    const isMarked = marked.has(idx);
    if (isAnswered && isMarked) return 'answered-marked';
    if (isAnswered) return 'answered';
    if (isMarked) return 'marked';
    if (visited.has(idx)) return 'visited';
    return 'not-visited';
  }

  if (!template || total === 0) {
    return (
      <div className="runner-error">
        <h2>Paper not found</h2>
        <Link to="/mock-tests">← Back to Mock Tests</Link>
      </div>
    );
  }

  /* ── RESULTS SCREEN ── */
  if (submitted) {
    const score = mcqCorrect;
    const maxMCQ = mcqQuestions.length;
    const percent = maxMCQ > 0 ? Math.round((score / maxMCQ) * 100) : 0;
    return (
      <div className="runner-result-page">
        <div className="runner-result-card">
          <div className="result-header">
            <div className="result-trophy">🏆</div>
            <h2>Test Submitted!</h2>
            <p className="result-sub">{subject.toUpperCase()} · Paper {paperId} · {template.difficulty}</p>
          </div>

          <div className="result-stats">
            <div className="result-stat">
              <span className="result-stat-value green">{score}/{maxMCQ}</span>
              <span className="result-stat-label">MCQ Score</span>
            </div>
            <div className="result-stat">
              <span className="result-stat-value blue">{percent}%</span>
              <span className="result-stat-label">Accuracy</span>
            </div>
            <div className="result-stat">
              <span className="result-stat-value purple">{answered}/{total}</span>
              <span className="result-stat-label">Attempted</span>
            </div>
            <div className="result-stat">
              <span className="result-stat-value orange">{notAnswered}</span>
              <span className="result-stat-label">Skipped</span>
            </div>
          </div>

          {/* MCQ Review */}
          {mcqQuestions.length > 0 && (
            <div className="result-review">
              <h3>MCQ Review</h3>
              {mcqQuestions.map((q) => {
                const idx = questions.indexOf(q);
                const chosen = answers[idx];
                const correct = q.correct;
                const isRight = Number(chosen) === correct;
                const isAnswered = chosen !== undefined;
                return (
                  <div key={idx} className={`review-item ${isAnswered ? (isRight ? 'correct' : 'wrong') : 'skipped'}`}>
                    <div className="review-q-header">
                      <span className="review-qnum">Q{q._num}</span>
                      <span className={`review-status ${isAnswered ? (isRight ? 'correct' : 'wrong') : 'skipped'}`}>
                        {isAnswered ? (isRight ? '✓ Correct' : '✗ Wrong') : '— Skipped'}
                      </span>
                    </div>
                    <p className="review-question">{q.question}</p>
                    <div className="review-options">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={`review-option ${oi === correct ? 'correct-opt' : ''} ${oi === Number(chosen) && !isRight ? 'wrong-opt' : ''}`}>
                          {oi === correct ? '✓ ' : oi === Number(chosen) && !isRight ? '✗ ' : '  '}
                          {opt}
                        </div>
                      ))}
                    </div>
                    <div className="review-explanation">💡 {q.explanation}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="result-actions">
            <Link to="/mock-tests" className="result-btn secondary">Browse Papers</Link>
            <Link to="/dashboard" className="result-btn primary">Dashboard →</Link>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const timerWarning = timeLeft <= 300;

  /* ── MAIN TEST UI ── */
  return (
    <div className="runner-page">
      {/* ── TOP BAR ── */}
      <header className="runner-header">
        <div className="runner-header-left">
          <Link to={`/mock-tests/${subject}/${paperId}`} className="runner-back-btn">✕</Link>
          <div className="runner-title">
            <span className="runner-subject">{subject.toUpperCase()}</span>
            <span className="runner-paper">Paper {paperId}</span>
            <span className={`runner-diff diff-${DIFF_COLOR[template.difficulty]}`}>{template.difficulty}</span>
          </div>
        </div>
        <div className={`runner-timer ${timerWarning ? 'warning' : ''}`}>
          <FaRegClock />
          <span>{formatTime(timeLeft)}</span>
        </div>
        <div className="runner-header-right">
          <button className="runner-palette-btn" onClick={() => setPaletteOpen(p => !p)}>
            ☰ Questions
          </button>
          <button className="runner-submit-btn" onClick={() => setShowConfirm(true)}>
            Submit Test
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="runner-body">
        {/* Question Panel */}
        <main className="runner-main">
          <div className="runner-q-header">
            <div className="runner-q-info">
              <span className="runner-q-num">Question {q._num} of {total}</span>
              <span className={`runner-q-type type-${q._type}`}>{TYPE_ICONS[q._type]} {TYPE_LABELS[q._type]}</span>
              <span className={`runner-q-diff diff-${q.difficulty}`}>{q.difficulty}</span>
            </div>
            <button
              className={`runner-mark-btn ${marked.has(currentIdx) ? 'active' : ''}`}
              onClick={toggleMark}
            >
              <FaFlag /> {marked.has(currentIdx) ? 'Marked' : 'Mark for Review'}
            </button>
          </div>

          <div className="runner-q-body">
            {/* Question text */}
            <div className="runner-q-text">
              {q.question.split('\n').map((line, i) => (
                <p key={i} className={line.startsWith('Example') || line.startsWith('Input') || line.startsWith('Output') ? 'q-example-label' : ''}>{line}</p>
              ))}
            </div>

            {/* MCQ */}
            {q._type === 'mcq' && (
              <div className="runner-mcq-options">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`mcq-option ${answers[currentIdx] === String(oi) ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`q-${currentIdx}`}
                      value={String(oi)}
                      checked={answers[currentIdx] === String(oi)}
                      onChange={() => handleAnswer(currentIdx, String(oi))}
                    />
                    <span className="mcq-option-letter">{String.fromCharCode(65 + oi)}</span>
                    <span className="mcq-option-text">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Coding */}
            {q._type === 'coding' && (
              <div className="runner-coding">
                <div className="coding-io-row">
                  <div className="coding-sample">
                    <div className="coding-sample-label">Sample Input</div>
                    <div className="coding-sample-box">{q.sampleInput}</div>
                  </div>
                  <div className="coding-sample">
                    <div className="coding-sample-label">Expected Output</div>
                    <div className="coding-sample-box">{q.sampleOutput}</div>
                  </div>
                </div>
                {q.hint && (
                  <details className="coding-hint">
                    <summary>💡 Hint</summary>
                    <p>{q.hint}</p>
                  </details>
                )}
                <div className="coding-editor-label">Your Solution</div>
                <textarea
                  className="coding-editor"
                  spellCheck={false}
                  placeholder={q.starterCode}
                  value={answers[currentIdx] ?? q.starterCode}
                  onChange={e => handleAnswer(currentIdx, e.target.value)}
                />
              </div>
            )}

            {/* Descriptive */}
            {q._type === 'descriptive' && (
              <div className="runner-descriptive">
                <div className="desc-guideline">
                  <span>📋</span> <strong>Key Points:</strong> {q.guideline}
                </div>
                <div className="coding-editor-label">Your Answer</div>
                <textarea
                  className="desc-editor"
                  placeholder="Write your detailed answer here..."
                  value={answers[currentIdx] ?? ''}
                  onChange={e => handleAnswer(currentIdx, e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Nav Buttons */}
          <div className="runner-nav">
            <button
              className="runner-nav-btn"
              disabled={currentIdx === 0}
              onClick={() => goTo(currentIdx - 1)}
            >
              <FaChevronLeft /> Previous
            </button>
            <div className="runner-nav-center">
              {answers[currentIdx] !== undefined ? (
                <span className="runner-answered-badge"><FaCheckCircle /> Answered</span>
              ) : (
                <span className="runner-unanswered-badge">Not Answered</span>
              )}
            </div>
            <button
              className="runner-nav-btn"
              disabled={currentIdx === total - 1}
              onClick={() => goTo(currentIdx + 1)}
            >
              Next <FaChevronRight />
            </button>
          </div>
        </main>

        {/* Question Palette Sidebar */}
        <aside className={`runner-palette ${paletteOpen ? 'open' : ''}`}>
          <div className="palette-header">
            <span>Question Palette</span>
            <button className="palette-close" onClick={() => setPaletteOpen(false)}>✕</button>
          </div>

          <div className="palette-legend">
            <span className="legend-item"><span className="legend-dot answered"></span>Answered</span>
            <span className="legend-item"><span className="legend-dot marked"></span>Marked</span>
            <span className="legend-item"><span className="legend-dot visited"></span>Visited</span>
            <span className="legend-item"><span className="legend-dot not-visited"></span>Not Visited</span>
          </div>

          {/* Group by type */}
          {['mcq', 'coding', 'descriptive'].map(type => {
            const typeQs = questions.filter(q => q._type === type);
            if (typeQs.length === 0) return null;
            return (
              <div key={type} className="palette-group">
                <div className="palette-group-label">{TYPE_ICONS[type]} {TYPE_LABELS[type]} ({typeQs.length})</div>
                <div className="palette-grid">
                  {typeQs.map(pq => {
                    const idx = questions.indexOf(pq);
                    const status = qStatus(idx);
                    return (
                      <button
                        key={idx}
                        className={`palette-btn ${status} ${currentIdx === idx ? 'current' : ''}`}
                        onClick={() => goTo(idx)}
                      >
                        {pq._num}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="palette-summary">
            <div className="ps-row"><span className="ps-dot answered"></span><span>Answered</span><b>{answered}</b></div>
            <div className="ps-row"><span className="ps-dot not-visited"></span><span>Not Visited</span><b>{total - visited.size}</b></div>
            <div className="ps-row"><span className="ps-dot marked"></span><span>Marked</span><b>{markedCount}</b></div>
          </div>

          <button className="palette-submit-btn" onClick={() => setShowConfirm(true)}>
            Submit Test
          </button>
        </aside>
      </div>

      {/* ── CONFIRM MODAL ── */}
      {showConfirm && (
        <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <h3>Submit Test?</h3>
            <div className="confirm-stats">
              <div className="cs-row"><span>Answered</span><b className="green">{answered}</b></div>
              <div className="cs-row"><span>Not Answered</span><b className="red">{notAnswered}</b></div>
              <div className="cs-row"><span>Marked for Review</span><b className="orange">{markedCount}</b></div>
              <div className="cs-row"><span>Time Remaining</span><b>{formatTime(timeLeft)}</b></div>
            </div>
            <p className="confirm-warning">Once submitted, you cannot change your answers.</p>
            <div className="confirm-btns">
              <button className="confirm-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="confirm-ok" onClick={handleSubmit}>Yes, Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
