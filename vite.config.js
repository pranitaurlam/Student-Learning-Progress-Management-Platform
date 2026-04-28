import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import os from 'os';
import path from 'path';
import Database from 'better-sqlite3';

const ensureJsonFile = (filePath, fallback) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
  }
};

const readJsonFile = (filePath, fallback) => {
  ensureJsonFile(filePath, fallback);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return fallback;
  }
};

const writeJsonFile = (filePath, value) => {
  ensureJsonFile(filePath, []);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
};

const getLanIps = () => {
  const interfaces = os.networkInterfaces();
  const ips = [];

  Object.values(interfaces).forEach((entries) => {
    (entries || []).forEach((entry) => {
      if (entry.family === 'IPv4' && !entry.internal) {
        ips.push(entry.address);
      }
    });
  });

  return [...new Set(ips)];
};

const createResultsDb = () => {
  const dbPath = path.resolve('server/data/mindforge.db');
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS mock_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      student_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      subject_name TEXT,
      paper_id INTEGER,
      difficulty TEXT,
      total INTEGER,
      attempted INTEGER,
      mcq_total INTEGER,
      mcq_correct INTEGER,
      accuracy INTEGER,
      time_used INTEGER
    );

    CREATE TABLE IF NOT EXISTS practice_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      student_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      question_id TEXT NOT NULL,
      question_text TEXT,
      correct INTEGER NOT NULL,
      difficulty TEXT
    );
  `);

  const insertMock = db.prepare(`
    INSERT INTO mock_results (
      created_at, student_name, subject, subject_name, paper_id, difficulty,
      total, attempted, mcq_total, mcq_correct, accuracy, time_used
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPractice = db.prepare(`
    INSERT INTO practice_results (
      created_at, student_name, subject, question_id, question_text, correct, difficulty
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const selectMock = db.prepare(`
    SELECT
      id,
      created_at AS date,
      student_name AS studentName,
      subject,
      subject_name AS subjectName,
      paper_id AS paperId,
      difficulty,
      total,
      attempted,
      mcq_total AS mcqTotal,
      mcq_correct AS mcqCorrect,
      accuracy,
      time_used AS timeUsed
    FROM mock_results
    ORDER BY id DESC
  `);

  const selectPractice = db.prepare(`
    SELECT
      id,
      created_at AS date,
      student_name AS studentName,
      subject,
      question_id AS questionId,
      question_text AS questionText,
      correct,
      difficulty
    FROM practice_results
    ORDER BY id DESC
  `);

  return {
    insertMockResult(record) {
      insertMock.run(
        record.date || new Date().toISOString(),
        record.studentName || 'Student',
        record.subject || 'General',
        record.subjectName || null,
        record.paperId ?? null,
        record.difficulty || null,
        record.total ?? 0,
        record.attempted ?? 0,
        record.mcqTotal ?? 0,
        record.mcqCorrect ?? 0,
        record.accuracy ?? 0,
        record.timeUsed ?? 0
      );
    },
    insertPracticeResult(record) {
      insertPractice.run(
        record.date || new Date().toISOString(),
        record.studentName || 'Student',
        record.subject || 'General',
        record.questionId || '',
        record.questionText || '',
        record.correct ? 1 : 0,
        record.difficulty || null
      );
    },
    getMockResults() {
      return selectMock.all();
    },
    getPracticeResults() {
      return selectPractice.all().map((row) => ({
        ...row,
        correct: Boolean(row.correct),
      }));
    },
  };
};

const resultsApi = () => {
  const resultsDb = createResultsDb();

  return {
    name: 'results-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0];

        if (url === '/api/mock-results' && req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(resultsDb.getMockResults()));
          return;
        }

        if (url === '/api/mock-results' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              resultsDb.insertMockResult(JSON.parse(body));
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Bad Request' }));
            }
          });
          return;
        }

        if (url === '/api/practice-results' && req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(resultsDb.getPracticeResults()));
          return;
        }

        if (url === '/api/practice-results' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              resultsDb.insertPracticeResult(JSON.parse(body));
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Bad Request' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
};

const attendanceApi = () => {
  const attendancePath = path.resolve('server/data/attendance.json');

  return {
    name: 'attendance-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0];

        if (url === '/api/network-info' && req.method === 'GET') {
          const ips = getLanIps();
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            ips,
            preferredHost: ips[0] || server.config.server.host || 'localhost',
          }));
          return;
        }

        if (url === '/api/attendance' && req.method === 'DELETE') {
          writeJsonFile(attendancePath, []);
          console.log(`[Attendance] All records purged by staff`);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
          return;
        }

        if (url === '/api/attendance' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              console.log(`[Attendance] Received submission from ${data.name} for ${data.subject}`);
              
              const attendanceLog = readJsonFile(attendancePath, []);
              const newEntry = {
                ...data,
                id: Date.now(),
                createdAt: new Date().toISOString(),
              };
              attendanceLog.unshift(newEntry);
              writeJsonFile(attendancePath, attendanceLog);
              
              console.log(`[Attendance] Successfully recorded entry for ${data.name}`);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, entryId: newEntry.id }));
            } catch (err) {
              console.error(`[Attendance] Failed to process submission:`, err);
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Malformed request' }));
            }
          });
          return;
        }

        if (url === '/api/attendance' && req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(readJsonFile(attendancePath, [])));
          return;
        }

        next();
      });
    }
  };
};

const recordingsApi = () => {
  const recordingsDir = path.resolve('public/recordings');
  const indexPath = path.join(recordingsDir, 'index.json');

  const getIndex = () => {
    if (!fs.existsSync(indexPath)) return [];
    try {
      return JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    } catch {
      return [];
    }
  };

  const saveIndex = (index) => {
    if (!fs.existsSync(recordingsDir)) fs.mkdirSync(recordingsDir, { recursive: true });
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  };

  return {
    name: 'recordings-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0];

        if (url === '/api/recordings' && req.method === 'POST') {
          const id = Date.now();
          const filePath = path.join(recordingsDir, `${id}.webm`);
          const writeStream = fs.createWriteStream(filePath);

          req.pipe(writeStream);
          req.on('end', () => {
            const stats = fs.statSync(filePath);
            const metadata = {
              id,
              subject: req.headers['x-subject'] ? decodeURIComponent(req.headers['x-subject']) : 'General',
              topic: req.headers['x-topic'] ? decodeURIComponent(req.headers['x-topic']) : 'Recorded Session',
              date: new Date().toLocaleDateString(),
              videoUrl: `/recordings/${id}.webm`,
              size: stats.size
            };
            const index = getIndex();
            index.push(metadata);
            saveIndex(index);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, id }));
          });
          return;
        }

        if (url === '/api/recordings' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(getIndex()));
          return;
        }

        if (url.startsWith('/api/recordings/') && req.method === 'DELETE') {
          const id = parseInt(url.split('/').pop(), 10);
          const index = getIndex();
          const filtered = index.filter((recording) => recording.id !== id);
          const filePath = path.join(recordingsDir, `${id}.webm`);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (err) {
              console.error('Delete failed:', err);
            }
          }
          saveIndex(filtered);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
          return;
        }

        next();
      });
    }
  };
};

export default defineConfig({
  plugins: [react(), attendanceApi(), resultsApi(), recordingsApi()],
  server: {
    host: true,
    proxy: {
      '/api_dev': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
});
