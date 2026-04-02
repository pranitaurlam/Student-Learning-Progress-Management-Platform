import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaClipboardList,
  FaRegClock,
  FaListOl,
  FaPlay,
  FaCode,
  FaPenNib,
} from "react-icons/fa";
import "./MockTestPaper.css";

const SUBJECTS = [
  { key: "ai-ml",   name: "AI/ML"   },
  { key: "dsa",     name: "DSA"     },
  { key: "web-dev", name: "Web Dev" },
  { key: "dbms",    name: "DBMS"    },
  { key: "python",  name: "Python"  },
];

const PAPER_TEMPLATES = [
  { n: 1,  difficulty: "Easy",   mcq: 20, coding: 3,  descriptive: 2,  durationMins: 30  },
  { n: 2,  difficulty: "Easy",   mcq: 18, coding: 4,  descriptive: 3,  durationMins: 35  },
  { n: 3,  difficulty: "Easy",   mcq: 20, coding: 3,  descriptive: 2,  durationMins: 40  },
  { n: 4,  difficulty: "Medium", mcq: 15, coding: 7,  descriptive: 5,  durationMins: 50  },
  { n: 5,  difficulty: "Medium", mcq: 15, coding: 8,  descriptive: 5,  durationMins: 55  },
  { n: 6,  difficulty: "Medium", mcq: 12, coding: 8,  descriptive: 5,  durationMins: 60  },
  { n: 7,  difficulty: "Medium", mcq: 10, coding: 10, descriptive: 5,  durationMins: 60  },
  { n: 8,  difficulty: "Hard",   mcq: 10, coding: 10, descriptive: 5,  durationMins: 75  },
  { n: 9,  difficulty: "Hard",   mcq: 8,  coding: 12, descriptive: 5,  durationMins: 90  },
  { n: 10, difficulty: "Hard",   mcq: 5,  coding: 15, descriptive: 5,  durationMins: 120 },
];

const DIFF_EMOJI = { Easy: "🟢", Medium: "🟡", Hard: "🔴" };

export default function MockTestPaper() {
  const { subject, paperId } = useParams();
  const navigate = useNavigate();
  const subjectInfo = SUBJECTS.find((s) => s.key === subject);
  const paperNumber = Number(paperId);
  const template = PAPER_TEMPLATES.find((t) => t.n === paperNumber);

  if (!subjectInfo || !template) {
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

  const total = template.mcq + template.coding + template.descriptive;
  const title = `${subjectInfo.name} Mock Test — Paper ${template.n}`;

  return (
    <div className="mock-paper-page">
      <div className="container">
        <div className="mock-paper-topbar">
          <Link to="/mock-tests" className="mock-paper-back">
            <FaArrowLeft /> Back
          </Link>
          <span className={`mock-paper-diff-badge diff-${template.difficulty.toLowerCase()}`}>
            {DIFF_EMOJI[template.difficulty]} {template.difficulty}
          </span>
        </div>

        <div className="mock-paper-hero">
          <div className="mock-paper-icon">
            <FaClipboardList />
          </div>
          <div className="mock-paper-text">
            <h2>{title}</h2>
            <p>
              {template.difficulty} difficulty · {total} questions · {template.durationMins} minutes
            </p>
          </div>
        </div>

        <div className="mock-paper-grid">
          <div className="mock-paper-card">
            <h3>Paper Details</h3>
            <div className="mock-paper-meta">
              <div className="mock-paper-meta-item">
                <FaListOl /> <span>{template.mcq} MCQ Questions</span>
              </div>
              <div className="mock-paper-meta-item">
                <FaCode /> <span>{template.coding} Coding Questions</span>
              </div>
              <div className="mock-paper-meta-item">
                <FaPenNib /> <span>{template.descriptive} Descriptive Questions</span>
              </div>
              <div className="mock-paper-meta-item">
                <FaListOl /> <span>{total} Total Questions</span>
              </div>
              <div className="mock-paper-meta-item">
                <FaRegClock /> <span>{template.durationMins} Minutes</span>
              </div>
            </div>

            <button
              type="button"
              className="mock-paper-start"
              onClick={() => navigate(`/mock-tests/${subject}/${paperId}/start`)}
            >
              <FaPlay /> Start Test
            </button>
          </div>

          <div className="mock-paper-card subtle">
            <h3>What's in this paper?</h3>
            <ul className="mock-paper-list">
              <li>
                <strong>MCQs ({template.mcq}):</strong> Multiple choice — single correct answer, testing core concepts.
              </li>
              <li>
                <strong>Coding ({template.coding}):</strong> Write code to solve algorithmic / implementation problems.
              </li>
              <li>
                <strong>Descriptive ({template.descriptive}):</strong> Explain concepts, compare approaches, or justify decisions in writing.
              </li>
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
