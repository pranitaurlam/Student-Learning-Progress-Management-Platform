import { useState, useRef, useEffect } from 'react';
import './AIDoubtChat.css';

const initialMessages = [
    {
        sender: 'bot',
        text: "👋 Hi! I'm your AI Doubt Chat assistant. Ask me anything about your studies — from solving equations to explaining complex theories. I'm here to help you learn step by step!",
    },
];

const suggestedTopics = [
    "Explain Newton's 3rd Law",
    'Solve quadratic equations',
    'What is photosynthesis?',
    'Binary search algorithm',
    'Chemical bonding basics',
];

export default function AIDoubtChat() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Auto scroll to latest message
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        const text = input.trim();
        if (!text) return;

        // Add user message to chat
        setMessages((prev) => [...prev, { sender: 'user', text }]);
        setInput('');

        // Show "Thinking..." placeholder
        setMessages((prev) => [...prev, { sender: 'bot', text: 'Thinking...' }]);
        setLoading(true);
        setError(null);

        // Call FastAPI backend
        fetchAIReply(text)
            .then((reply) => {
                // Replace "Thinking..." with actual reply
                setMessages((prev) => {
                    const msgs = [...prev];
                    const idx = msgs.map((m) => m.text).lastIndexOf('Thinking...');
                    if (idx !== -1 && msgs[idx].sender === 'bot') {
                        msgs[idx] = { sender: 'bot', text: reply };
                    } else {
                        msgs.push({ sender: 'bot', text: reply });
                    }
                    return msgs;
                });
            })
            .catch((err) => {
                console.error('AI reply error:', err);
                // Replace "Thinking..." with error message
                setMessages((prev) => {
                    const msgs = [...prev];
                    const idx = msgs.map((m) => m.text).lastIndexOf('Thinking...');
                    const errorText =
                        err?.message || 'Failed to get response. Please try again!';
                    if (idx !== -1 && msgs[idx].sender === 'bot') {
                        msgs[idx] = { sender: 'bot', text: `❌ Error: ${errorText}` };
                    } else {
                        msgs.push({ sender: 'bot', text: `❌ Error: ${errorText}` });
                    }
                    return msgs;
                });
                setError(err?.message || String(err));
            })
            .finally(() => setLoading(false));
    };

    // Send on Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !loading) handleSend();
    };

    // Click suggested topic → fill input
    const handleTopicClick = (topic) => {
        setInput(topic);
    };

    return (
        <div className="chat-page">
            <div className="chat-container">

                {/* Header */}
                <div className="chat-header">
                    <h1>AI Doubt Chat</h1>
                    <p>Get instant explanations and step-by-step help</p>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-bubble ${msg.sender}`}>
                            <div className="chat-bubble-label">
                                {msg.sender === 'bot' ? '🤖 AI Tutor' : '🧑‍🎓 You'}
                            </div>
                            {/* Newlines show properly */}
                            {msg.text.split('\n').map((line, j) => (
                                <span key={j}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </div>
                    ))}
                    {/* Auto scroll ref */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Topics */}
                <div className="suggested-topics">
                    {suggestedTopics.map((t, i) => (
                        <button
                            key={i}
                            className="topic-chip"
                            onClick={() => handleTopicClick(t)}
                            disabled={loading}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="chat-error" role="alert">
                        ⚠️ {error}
                    </div>
                )}

                {/* Input Row */}
                <div className="chat-input-row">
                    <input
                        type="text"
                        placeholder="Type your doubt here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <button
                        className="chat-send-btn"
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                    >
                        {loading ? 'Thinking...' : 'Send →'}
                    </button>
                </div>

            </div>
        </div>
    );
}

// FastAPI backend se reply fetch karna
async function fetchAIReply(userText) {
    const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),  // backend expects "message"
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Server returned an error');
    }

    const data = await res.json();
    return data.reply;  // backend returns "reply"
}
