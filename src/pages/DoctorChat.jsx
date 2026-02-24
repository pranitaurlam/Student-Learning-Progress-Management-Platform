import { useState } from 'react';
import './DoctorChat.css';
import { FaUserMd, FaPaperPlane } from 'react-icons/fa';

const initialMessages = [
    {
        sender: 'doctor',
        text: "Hello! I'm the Doctor Application Chat. How can I assist you with your health or study-related stress today?",
    },
];

export default function DoctorChat() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');

    const handleSend = () => {
        const text = input.trim();
        if (!text) return;
        setMessages((prev) => [...prev, { sender: 'user', text }]);
        setInput('');

        // Simulated doctor reply
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'doctor',
                    text: `I understand you said: "${text}". I am here to listen and help. (This is a simplified doctor chat simulation).`,
                },
            ]);
        }, 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="doctor-chat-page">
            <div className="chat-container">
                <div className="chat-header doctor-header">
                    <div className="header-icon">
                        <FaUserMd />
                    </div>
                    <div>
                        <h1>Doctor Chat</h1>
                        <p>Professional consultation & support</p>
                    </div>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-bubble ${msg.sender}`}>
                            <div className="chat-bubble-label">
                                {msg.sender === 'doctor' ? '👨‍⚕️ Dr. Smith' : '🧑‍🎓 You'}
                            </div>
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className="chat-input-row">
                    <input
                        type="text"
                        placeholder="Describe your symptoms or concerns..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="chat-send-btn doctor-send-btn" onClick={handleSend}>
                        <FaPaperPlane /> Send
                    </button>
                </div>
            </div>
        </div>
    );
}
