import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AIDoubtChat from './pages/AIDoubtChat';
import DoctorChat from './pages/DoctorChat';
import Messages from './pages/Messages';
import Login from './pages/Login';
import MockTests from './pages/MockTests';
import MockTestPaper from './pages/MockTestPaper';
import PracticeQuestions from './pages/PracticeQuestions';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-chat" element={<AIDoubtChat />} />
        <Route path="/doctor-chat" element={<DoctorChat />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/mock-tests" element={<MockTests />} />
        <Route path="/mock-tests/:subject/:paperId" element={<MockTestPaper />} />
        <Route path="/practice-questions" element={<PracticeQuestions />} />
      </Routes>
    </BrowserRouter>
  );
}
