require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const os = require('os');
const path = require('path');
const Database = require('better-sqlite3');
const plannerRoutes = require('./routes/plannerRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const attendancePath = path.resolve(__dirname, 'data', 'attendance.json');
const dbPath = path.resolve(__dirname, 'data', 'mindforge.db');

app.use(cors());
app.use(express.json());

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

if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const resultsDb = new Database(dbPath);
resultsDb.exec(`
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

const insertMockResultStmt = resultsDb.prepare(`
    INSERT INTO mock_results (
        created_at, student_name, subject, subject_name, paper_id, difficulty,
        total, attempted, mcq_total, mcq_correct, accuracy, time_used
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertPracticeResultStmt = resultsDb.prepare(`
    INSERT INTO practice_results (
        created_at, student_name, subject, question_id, question_text, correct, difficulty
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const selectMockResultsStmt = resultsDb.prepare(`
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

const selectPracticeResultsStmt = resultsDb.prepare(`
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

// Root route for health check
app.get('/api/health', (req, res) => {
    res.send('MindForge Mistakes API is running...');
});

app.get('/api/network-info', (req, res) => {
    const ips = getLanIps();
    res.json({
        ips,
        preferredHost: ips[0] || 'localhost',
    });
});

app.get('/api/attendance', (req, res) => {
    res.json(readJsonFile(attendancePath, []));
});

app.post('/api/attendance', (req, res) => {
    const attendanceLog = readJsonFile(attendancePath, []);
    attendanceLog.unshift({
        ...req.body,
        id: Date.now(),
        createdAt: new Date().toISOString(),
    });
    writeJsonFile(attendancePath, attendanceLog);
    res.json({ success: true });
});

app.get('/api/mock-results', (req, res) => {
    res.json(selectMockResultsStmt.all());
});

app.post('/api/mock-results', (req, res) => {
    const record = req.body;
    insertMockResultStmt.run(
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
    res.json({ success: true });
});

app.get('/api/practice-results', (req, res) => {
    const rows = selectPracticeResultsStmt.all().map((row) => ({
        ...row,
        correct: Boolean(row.correct),
    }));
    res.json(rows);
});

app.post('/api/practice-results', (req, res) => {
    const record = req.body;
    insertPracticeResultStmt.run(
        record.date || new Date().toISOString(),
        record.studentName || 'Student',
        record.subject || 'General',
        record.questionId || '',
        record.questionText || '',
        record.correct ? 1 : 0,
        record.difficulty || null
    );
    res.json({ success: true });
});

app.use('/planner', plannerRoutes);
app.use('/messages', messageRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
    });
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindforge')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
