# 🚀 MindForge Academy: Deep-Dive Interview Guide

This document is your complete companion for understanding and explaining the **MindForge Academy** codebase during an interview.

---

## 1. PROJECT OVERVIEW
**MindForge Academy** is a unified Learning Management System (LMS) designed to be a "Student Command Center." 

- **Purpose**: To provide students with a single platform for tracking progress, resolving doubts with AI, joining live sessions, and practicing for exams.
- **Real-world Use Case**: High-end coaching institutes or university portals where students need real-time interaction and automated progress tracking.
- **Architecture Flow**:
  1. **Frontend**: React handles the user interface and local state.
  2. **API Layer**: React communicates with the backend via RESTful APIs (`fetch`).
  3. **Backend**: An Express.js server (and Vite Middleware) handles business logic, security, and data orchestration.
  4. **Database**: A hybrid of SQLite (for structured results), MongoDB (for global data), and JSON/IndexedDB (for logs and media).

---

## 2. TECH STACK BREAKDOWN

### 🖥️ Frontend: React (Vite)
- **What it is**: A library for building user interfaces using "Components."
- **Why React?**: Because it uses a **Virtual DOM**, making updates fast and efficient. Alternatives like Angular are much heavier and harder for beginners.
- **Pros**: Large community, reusable components, easy to learn.

### 🌐 Backend: Express.js
- **What it is**: A web framework for Node.js.
- **Why Express?**: It is the industry standard. It's simple, fast, and unopinionated, meaning you have full control over your routes.
- **Pros**: Middleware support, huge ecosystem, easy to scale.

### 🗄️ Database: The Hybrid Approach
Your project uses a mix of databases to play to their strengths:
- **SQLite (Primary Results)**: Used for `mock_results` and `practice_results`.
  - **Why?**: It's a "serverless" relational database. No setup required, data is stored in a single file (`mindforge.db`). Perfect for fast local development.
- **MongoDB (Global State)**: Used for core application data.
  - **Why?**: It's a NoSQL database that stores data in JSON-like documents. Great for flexible data structures.
- **IndexedDB (Browser Storage)**: Used in the frontend to store video recordings.
  - **Why?**: Allows storing large files (like `.webm` videos) directly in the student's browser so they don't lose recordings even if the server is offline.

### 📡 Communication: Trystero & WebRTC
- **What it is**: A Peer-to-Peer (P2P) communication library.
- **Why?**: Instead of paying for expensive video servers (like Zoom), we use **WebRTC** to send video directly from the teacher to the student. Trystero manages the "handshake" between them.

### 🎨 Styling: Vanilla CSS & Glassmorphism
- **What it is**: Custom CSS files for every page.
- **Why?**: To achieve a unique, premium "Glassmorphism" look (translucent backgrounds) which is hard to do with generic frameworks like Bootstrap.

---

## 3. FOLDER STRUCTURE EXPLANATION

- **`src/pages/`**: The "screens" of your app. Each file here represents a URL route (e.g., `/dashboard` -> `Dashboard.jsx`).
- **`src/components/`**: Reusable parts. The `Navbar.jsx` is used on every page so we don't rewrite it.
- **`server/`**: The "Brain" of the project.
  - `index.js`: Where the server starts, connects to databases, and defines endpoints.
  - `data/`: Where your SQLite database and JSON logs live.
- **`public/`**: Static images and the `recordings/` folder where live class videos are temporarily stored.

---

## 4. FILE-BY-FILE BREAKDOWN (Important Files)

### 📄 `vite.config.js`
- **Purpose**: Usually just for config, but in your project, it acts as a **Development Backend**.
- **Logic**: It uses "Middleware" to intercept requests like `/api/ai-chat`. This allows your AI Tutor to work perfectly even if your main Express server isn't running.

### 📄 `AIDoubtChat.jsx`
- **Purpose**: The AI Tutor page.
- **Logic**: Uses the **Gemini API**. It has a special "Fallback" logic: If the primary API fails (Error 429), it switches to a free open-source AI endpoint so the user never sees an error.
- **Interview Question**: *"How do you handle API failures?"* -> *"I use a try-catch block to detect errors and trigger a secondary fallback API."*

### 📄 `Staff.jsx`
- **Purpose**: The Teacher's Control Panel.
- **Logic**: Generates a **QR Code** for attendance. It uses a timer to refresh the QR every 30 seconds for security (preventing students from sharing a screenshot of the QR).

---

## 5. REACT CONCEPTS (Explained for Beginners)

### 🪝 Hooks
1. **`useState`**: Think of this as the "Short-term Memory" of a component. It stores things like your current chat message or the countdown timer.
2. **`useEffect`**: The "Observer." It watches for changes. We use it to fetch data from the database the moment a page opens.
3. **`useRef`**: The "Direct Access" tool. We use it to scroll to the bottom of the chat automatically or to capture video streams.

---

## 6. INTERVIEW QUESTIONS & ANSWERS

### Q: "Why did you use SQLite and MongoDB together?"
**A**: "I chose a polyglot approach. MongoDB provides flexibility for global user data, while SQLite is extremely efficient for structured, high-frequency relational data like mock test scores. It allowed me to have a zero-config setup for the analytics engine."

### Q: "How does the AI Tutor work?"
**A**: "It sends the student's question to a backend proxy. The proxy uses the Google Gemini API to generate a response. I implemented a secondary fallback to an open LLM API to ensure 99.9% availability during peak traffic."

### Q: "How did you handle real-time video in the Live Room?"
**A**: "I implemented WebRTC for P2P streaming. To simplify the connection logic between students and teachers, I utilized Trystero, which handles the signaling process without needing a dedicated signaling server."

---

## 7. FINAL CHEAT SHEET: "Explain your project"
> "My project, MindForge Academy, is a Student Learning Progress Management Platform. It's built using the MERN stack architecture but optimized with SQLite for local analytics. The standout features are a P2P Live Room for virtual classes and an AI Doubt Solver with an automated fallback mechanism. I focused on visual excellence using a Glassmorphism UI and optimized performance by using IndexedDB for browser-side media storage."

---
