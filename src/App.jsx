import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AIDoubtChat from './pages/AIDoubtChat';

import Messages from './pages/Messages';
import Login from './pages/Login';
import MockTests from './pages/MockTests';
import MockTestPaper from './pages/MockTestPaper';
import MockTestRunner from './pages/MockTestRunner';
import PracticeQuestions from './pages/PracticeQuestions';
import QuestionDetail from './pages/QuestionDetail';
import Planner from './pages/Planner';
import LiveClass from "./pages/LiveClass";
import LiveRoom from "./pages/LiveRoom";
import Certificates from './pages/Certificates';
import Staff from './pages/Staff';
import AttendanceForm from './pages/AttendanceForm';
import StudyTimer from './pages/StudyTimer';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('mindforge_is_logged_in') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Staff Route Component
const StaffRoute = ({ children }) => {
  const isStaff = localStorage.getItem('mindforge_is_staff') === 'true';
  return isStaff ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Student Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/ai-chat" element={<ProtectedRoute><AIDoubtChat /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/mock-tests" element={<ProtectedRoute><MockTests /></ProtectedRoute>} />
        <Route path="/mock-tests/:subject/:paperId" element={<ProtectedRoute><MockTestPaper /></ProtectedRoute>} />
        <Route path="/mock-tests/:subject/:paperId/start" element={<ProtectedRoute><MockTestRunner /></ProtectedRoute>} />
        <Route path="/practice-questions" element={<ProtectedRoute><PracticeQuestions /></ProtectedRoute>} />
        <Route path="/practice-questions/:subjectId/:questionId" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
        <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
        <Route path="/live-class" element={<ProtectedRoute><LiveClass /></ProtectedRoute>} />
        <Route path="/live-room/:sessionId" element={<ProtectedRoute><LiveRoom /></ProtectedRoute>} />
        <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><AttendanceForm /></ProtectedRoute>} />
        <Route path="/focus" element={<ProtectedRoute><StudyTimer /></ProtectedRoute>} />
        
        {/* Staff Route */}
        <Route path="/staff" element={<StaffRoute><Staff /></StaffRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
