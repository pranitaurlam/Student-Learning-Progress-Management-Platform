import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import './index.css';
import Register from './pages/Register'; 

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-chat" element={<AIDoubtChat />} />

        <Route path="/messages" element={<Messages />} />
        <Route path="/mock-tests" element={<MockTests />} />
        <Route path="/mock-tests/:subject/:paperId" element={<MockTestPaper />} />
        <Route path="/mock-tests/:subject/:paperId/start" element={<MockTestRunner />} />
        <Route path="/practice-questions" element={<PracticeQuestions />} />
        <Route path="/practice-questions/:subjectId/:questionId" element={<QuestionDetail />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/register" element={<Register />} />  
      </Routes>
    </BrowserRouter>
  );
}
