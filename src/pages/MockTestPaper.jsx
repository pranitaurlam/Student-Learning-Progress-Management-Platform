import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaClipboardList, FaRegClock, FaListOl, FaPlay } from 'react-icons/fa';
import './MockTestPaper.css';

const SUBJECTS = [
  { key: 'ai-ml', name: 'AI/ML' },
  { key: 'dsa', name: 'DSA' },
  { key: 'web-dev', name: 'Web Dev' },
  { key: 'dbms', name: 'DBMS' },
  { key: 'python', name: 'Python' },
];

function getPaperMeta(paperNumber) {
  const idx = Math.max(0, (paperNumber ?? 1) - 1);
  const questions = 25 + (idx % 3) * 5;
  const durationMins = 30 + (idx % 4) * 15;
  return { questions, durationMins };
}

export default function MockTestPaper() {
  const { subject, paperId } = useParams();
  const subjectInfo = SUBJECTS.find((s) => s.key === subject);
  const paperNumber = Number(paperId);
  const paperOk = Number.isFinite(paperNumber) && paperNumber >= 1 && paperNumber <= 10;

  if (!subjectInfo || !paperOk) {
    return (
      <div className="mock-paper-page">
        <div className="container">
          <div className="mock-paper-card">
            <h2>Mock paper not found</h2>
            <p>Please go back and pick a subject paper (1 to 10).</p>
            <Link to="/mock-tests" className="mock-paper-back">
              <FaArrowLeft /> Back to Mock Tests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const meta = getPaperMeta(paperNumber);
  const title = `${subjectInfo.name} Mock Test Paper ${paperNumber}`;

  return (
    <div className="mock-paper-page">
      <div className="container">
        <div className="mock-paper-topbar">
          <Link to="/mock-tests" className="mock-paper-back">
            <FaArrowLeft /> Back
          </Link>
        </div>

        <div className="mock-paper-hero">
          <div className="mock-paper-icon">
            <FaClipboardList />
          </div>
          <div className="mock-paper-text">
            <h2>{title}</h2>
            <p>Paper preview (demo). You can wire real questions later.</p>
          </div>
        </div>

        <div className="mock-paper-grid">
          <div className="mock-paper-card">
            <h3>Paper details</h3>
            <div className="mock-paper-meta">
              <div className="mock-paper-meta-item">
                <FaListOl /> <span>{meta.questions} Questions</span>
              </div>
              <div className="mock-paper-meta-item">
                <FaRegClock /> <span>{meta.durationMins} Minutes</span>
              </div>
            </div>

            <button
              type="button"
              className="mock-paper-start"
              onClick={() => alert('Mock test engine not wired yet (demo).')}
            >
              <FaPlay /> Start Test
            </button>
          </div>

          <div className="mock-paper-card subtle">
            <h3>What happens next?</h3>
            <ul className="mock-paper-list">
              <li>Load questions for this subject + paper.</li>
              <li>Start timer and capture answers.</li>
              <li>Show score + solutions at the end.</li>
            </ul>
            <div className="mock-paper-links">
              <Link to="/dashboard" className="mock-paper-link">
                Go to Dashboard →
              </Link>
              <Link to="/mock-tests" className="mock-paper-link">
                Browse more papers →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

