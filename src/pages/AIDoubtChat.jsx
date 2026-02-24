import { useState } from 'react';
import './AIDoubtChat.css';

const initialMessages = [
    {
        sender: 'bot',
        text: "👋 Hi! I'm your AI Doubt Chat assistant. Ask me anything about your studies — from solving equations to explaining complex theories. I'm here to help you learn step by step!",
    },
];

const suggestedTopics = [
    'Explain Newton\'s 3rd Law',
    'Solve quadratic equations',
    'What is photosynthesis?',
    'Binary search algorithm',
    'Chemical bonding basics',
];

export default function AIDoubtChat() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');

    const handleSend = () => {
        const text = input.trim();
        if (!text) return;
        setMessages((prev) => [...prev, { sender: 'user', text }]);
        setInput('');

        // Simulated bot reply
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'bot',
                    text: `Great question! Let me think about "${text}"...\n\nThis is a simulated response. In a production app this would connect to an AI backend to provide detailed explanations and step-by-step solutions.`,
                },
            ]);
        }, 800);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const handleTopicClick = (topic) => {
        setInput(topic);
    };

    return (
        <div className="chat-page">
            <div className="chat-container">
                <div className="chat-header">
                    <h1>AI Doubt Chat</h1>
                    <p>Get instant explanations and step-by-step help</p>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-bubble ${msg.sender}`}>
                            <div className="chat-bubble-label">
                                {msg.sender === 'bot' ? '🤖 AI Tutor' : '🧑‍🎓 You'}
                            </div>
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className="suggested-topics">
                    {suggestedTopics.map((t, i) => (
                        <button key={i} className="topic-chip" onClick={() => handleTopicClick(t)}>
                            {t}
                        </button>
                    ))}
                </div>

                <div className="chat-input-row">
                    <input
                        type="text"
                        placeholder="Type your doubt here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="chat-send-btn" onClick={handleSend}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
