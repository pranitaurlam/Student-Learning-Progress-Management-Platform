import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaChevronDown, FaChevronUp, FaRegClock, FaListOl, FaCode, FaPenNib } from 'react-icons/fa';
import './MockTests.css';

const SUBJECTS = [
  { key: 'ai-ml',   name: 'AI/ML',   accent: 'blue'   },
  { key: 'dsa',     name: 'DSA',     accent: 'purple' },
  { key: 'web-dev', name: 'Web Dev', accent: 'pink'   },
  { key: 'dbms',    name: 'DBMS',    accent: 'yellow' },
  { key: 'python',  name: 'Python',  accent: 'green'  },
];

// Each paper has a fixed difficulty + question-type breakdown
const PAPER_TEMPLATES = [
  { n: 1,  difficulty: 'Easy',   mcq: 20, coding: 3,  descriptive: 2,  durationMins: 30  },
  { n: 2,  difficulty: 'Easy',   mcq: 18, coding: 4,  descriptive: 3,  durationMins: 35  },
  { n: 3,  difficulty: 'Easy',   mcq: 20, coding: 3,  descriptive: 2,  durationMins: 40  },
  { n: 4,  difficulty: 'Medium', mcq: 15, coding: 7,  descriptive: 5,  durationMins: 50  },
  { n: 5,  difficulty: 'Medium', mcq: 15, coding: 8,  descriptive: 5,  durationMins: 55  },
  { n: 6,  difficulty: 'Medium', mcq: 12, coding: 8,  descriptive: 5,  durationMins: 60  },
  { n: 7,  difficulty: 'Medium', mcq: 10, coding: 10, descriptive: 5,  durationMins: 60  },
  { n: 8,  difficulty: 'Hard',   mcq: 10, coding: 10, descriptive: 5,  durationMins: 75  },
  { n: 9,  difficulty: 'Hard',   mcq: 8,  coding: 12, descriptive: 5,  durationMins: 90  },
  { n: 10, difficulty: 'Hard',   mcq: 5,  coding: 15, descriptive: 5,  durationMins: 120 },
];

function buildPapers(subjectKey, subjectName) {
  return PAPER_TEMPLATES.map((t) => ({
    id: String(t.n),
    title: `${subjectName} Paper ${t.n}`,
    difficulty: t.difficulty,
    meta: {
      mcq: t.mcq,
      coding: t.coding,
      descriptive: t.descriptive,
      total: t.mcq + t.coding + t.descriptive,
      durationMins: t.durationMins,
    },
    href: `/mock-tests/${encodeURIComponent(subjectKey)}/${encodeURIComponent(String(t.n))}`,
  }));
}

const DIFFICULTY_ORDER = ['Easy', 'Medium', 'Hard'];

export default function MockTests() {
  const [openSubjectKey, setOpenSubjectKey] = useState(SUBJECTS[0]?.key ?? null);

  const subjectPapers = useMemo(() => {
    const map = new Map();
    for (const s of SUBJECTS) map.set(s.key, buildPapers(s.key, s.name));
    return map;
  }, []);

  return (
    <div className="mock-tests-page">
      <div className="container">
        <div className="mock-tests-header">
          <div className="mock-tests-title">
            <div className="mock-tests-icon">
              <FaClipboardList />
            </div>
            <div>
              <h2>Mock Tests</h2>
              <p>Choose a subject — papers progress from Easy to Hard with MCQs, Coding & Descriptive questions.</p>
            </div>
          </div>
          <div className="mock-tests-actions">
            <Link to="/dashboard" className="mock-tests-back">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="subjects-grid">
          {SUBJECTS.map((s) => {
            const isOpen = openSubjectKey === s.key;
            const papers = subjectPapers.get(s.key) ?? [];

            // Group papers by difficulty
            const grouped = DIFFICULTY_ORDER.map((diff) => ({
              diff,
              papers: papers.filter((p) => p.difficulty === diff),
            }));

            return (
              <section key={s.key} className={`subject-card accent-${s.accent}`}>
                <div className="subject-header">
                  <div className="subject-heading">
                    <h3>{s.name}</h3>
                    <span className="subject-count">{papers.length} papers · Easy → Hard</span>
                  </div>
                  <button
                    type="button"
                    className="subject-toggle"
                    onClick={() => setOpenSubjectKey(isOpen ? null : s.key)}
                    aria-expanded={isOpen}
                    aria-controls={`papers-${s.key}`}
                  >
                    {isOpen ? (<>Hide <FaChevronUp /></>) : (<>Open <FaChevronDown /></>)}
                  </button>
                </div>

                <div id={`papers-${s.key}`} className={`papers-wrap ${isOpen ? 'open' : ''}`}>
                  {grouped.map(({ diff, papers: diffPapers }) => (
                    <div key={diff} className="difficulty-section">
                      <div className={`difficulty-label diff-${diff.toLowerCase()}`}>
                        {diff === 'Easy' && '🟢'} {diff === 'Medium' && '🟡'} {diff === 'Hard' && '🔴'} {diff}
                      </div>
                      <div className="papers-grid">
                        {diffPapers.map((p) => (
                          <Link key={p.id} to={p.href} className={`paper-card diff-border-${diff.toLowerCase()}`}>
                            <div className="paper-title">{p.title}</div>
                            <div className="paper-type-chips">
                              <span className="paper-chip chip-mcq">
                                <FaListOl /> {p.meta.mcq} MCQs
                              </span>
                              <span className="paper-chip chip-coding">
                                <FaCode /> {p.meta.coding} Coding
                              </span>
                              <span className="paper-chip chip-desc">
                                <FaPenNib /> {p.meta.descriptive} Descriptive
                              </span>
                            </div>
                            <div className="paper-meta">
                              <span className="paper-chip">
                                <FaListOl /> {p.meta.total} Total Qs
                              </span>
                              <span className="paper-chip">
                                <FaRegClock /> {p.meta.durationMins} mins
                              </span>
                            </div>
                            <div className="paper-open">Start →</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
