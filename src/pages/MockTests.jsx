import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaChevronDown, FaChevronUp, FaRegClock, FaListOl } from 'react-icons/fa';
import './MockTests.css';

const SUBJECTS = [
  { key: 'ai-ml', name: 'AI/ML', accent: 'blue' },
  { key: 'dsa', name: 'DSA', accent: 'purple' },
  { key: 'web-dev', name: 'Web Dev', accent: 'pink' },
  { key: 'dbms', name: 'DBMS', accent: 'yellow' },
  { key: 'python', name: 'Python', accent: 'green' },
];

function buildPapers(subjectKey, subjectName) {
  return Array.from({ length: 10 }, (_, idx) => {
    const n = idx + 1;
    const questions = 25 + (idx % 3) * 5; // 25/30/35
    const durationMins = 30 + (idx % 4) * 15; // 30/45/60/75
    return {
      id: String(n),
      title: `${subjectName} Mock Test Paper ${n}`,
      meta: { questions, durationMins },
      href: `/mock-tests/${encodeURIComponent(subjectKey)}/${encodeURIComponent(String(n))}`,
    };
  });
}

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
              <p>Choose a subject and open any of the 10 mock test papers.</p>
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
            return (
              <section key={s.key} className={`subject-card accent-${s.accent}`}>
                <div className="subject-header">
                  <div className="subject-heading">
                    <h3>{s.name}</h3>
                    <span className="subject-count">{papers.length} papers</span>
                  </div>
                  <button
                    type="button"
                    className="subject-toggle"
                    onClick={() => setOpenSubjectKey(isOpen ? null : s.key)}
                    aria-expanded={isOpen}
                    aria-controls={`papers-${s.key}`}
                  >
                    {isOpen ? (
                      <>
                        Hide <FaChevronUp />
                      </>
                    ) : (
                      <>
                        Open <FaChevronDown />
                      </>
                    )}
                  </button>
                </div>

                <div id={`papers-${s.key}`} className={`papers-wrap ${isOpen ? 'open' : ''}`}>
                  <div className="papers-grid">
                    {papers.map((p) => (
                      <Link key={p.id} to={p.href} className="paper-card">
                        <div className="paper-title">{p.title}</div>
                        <div className="paper-meta">
                          <span className="paper-chip">
                            <FaListOl /> {p.meta.questions} Qs
                          </span>
                          <span className="paper-chip">
                            <FaRegClock /> {p.meta.durationMins} mins
                          </span>
                        </div>
                        <div className="paper-open">Open →</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

