import { useState, useRef, useEffect } from 'react';
import { IoSend, IoArrowBack } from 'react-icons/io5';
import './Messages.css';

const initialConversations = [
    // ── Mentors ──────────────────────────────────────────
    {
        id: 1,
        type: 'mentor',
        sender: 'Prof. Rohit Gupta',
        initials: 'RG',
        color: 'purple',
        subject: 'DBMS',
        time: '2 hours ago',
        preview: 'Keep up the good work and aim for good marks in mock tests!',
        unreadStatus: { student: true, staff: false },
        messages: [
            { from: 'mentor', text: 'Hi! I checked your recent mock test results.', time: '10:00 AM' },
            { from: 'mentor', text: 'Keep up the good work and aim for good marks in mock tests!', time: '10:02 AM' },
        ],
    },
    {
        id: 2,
        type: 'mentor',
        sender: 'Prof. DivyaShant',
        initials: 'DS',
        color: 'magenta',
        subject: 'Frontend – Batch 1',
        time: '5 hours ago',
        preview: 'Please submit your frontend assignment by end of this week.',
        unreadStatus: { student: true, staff: false },
        messages: [
            { from: 'mentor', text: 'Please submit your frontend assignment by end of this week.', time: '7:30 AM' },
        ],
    },
    {
        id: 3,
        type: 'mentor',
        sender: 'Prof. JayaPrasad',
        initials: 'JP',
        color: 'cyan',
        subject: 'DSA – Batch 3',
        time: 'Yesterday',
        preview: 'New mock test series for JEE 2026 is now available! Check it out.',
        unreadStatus: { student: false, staff: false },
        messages: [
            { from: 'mentor', text: 'New mock test series for JEE 2026 is now available! Check it out.', time: 'Yesterday' },
        ],
    },
    {
        id: 4,
        type: 'mentor',
        sender: 'Prof. Vishal',
        initials: 'VS',
        color: 'orange',
        subject: 'DSA – Batch 1',
        time: '2 days ago',
        preview: 'I reviewed your doubt — here is a step-by-step solution for Q12.',
        unreadStatus: { student: false, staff: false },
        messages: [
            { from: 'mentor', text: 'I reviewed your doubt — here is a step-by-step solution for Q12.', time: '2 days ago' },
        ],
    },
    {
        id: 5,
        type: 'mentor',
        sender: 'Prof. Nithin',
        initials: 'NT',
        color: 'purple',
        subject: 'DSA – Batch 2',
        time: '3 days ago',
        preview: "DSA revision session tonight at 8 PM. Don't miss it!",
        unreadStatus: { student: false, staff: false },
        messages: [
            { from: 'mentor', text: "DSA revision session tonight at 8 PM. Don't miss it!", time: '3 days ago' },
        ],
    },
    {
        id: 6,
        type: 'mentor',
        sender: 'Prof. Navneeth',
        initials: 'NV',
        color: 'magenta',
        subject: 'ML',
        time: '4 days ago',
        preview: 'Great effort this week! Keep pushing forward in your studies.',
        unreadStatus: { student: false, staff: false },
        messages: [
            { from: 'mentor', text: 'Great effort this week! Keep pushing forward in your studies.', time: '4 days ago' },
        ],
    },
    {
        id: 7,
        type: 'mentor',
        sender: 'Prof. Majeed',
        initials: 'MJ',
        color: 'cyan',
        subject: 'Frontend – Batch 2',
        time: '5 days ago',
        preview: 'Assignment 3 has been uploaded. Please complete it before Friday.',
        unreadStatus: { student: false, staff: false },
        messages: [
            { from: 'mentor', text: 'Assignment 3 has been uploaded. Please complete it before Friday.', time: '5 days ago' },
        ],
    },
    {
        id: 8,
        type: 'mentor',
        sender: 'Prof. Shubam',
        initials: 'SB',
        color: 'orange',
        subject: 'Frontend – Batch 3',
        time: '6 days ago',
        preview: "Great work on the React project! Let's discuss improvements next session.",
        unreadStatus: { student: false, staff: false },
        messages: [
            { from: 'mentor', text: "Great work on the React project! Let's discuss improvements next session.", time: '6 days ago' },
        ],
    },
];

/* ── LocalStorage Sync ── */
const STORAGE_KEY = 'mindforge_messages';

// Initialize or load from local storage
const loadConversations = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to load messages", e);
    }
    // Fallback to initial if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialConversations));
    return initialConversations;
};

export default function Messages() {
    const [conversations, setConversations] = useState(loadConversations());
    const [activeId, setActiveId] = useState(null);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const activeConv = conversations.find((c) => c.id === activeId);

    // Sync state changes to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }, [conversations]);

    // Periodically poll for updates from Staff replies
    useEffect(() => {
        const interval = setInterval(() => {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Simple equality check to avoid unnecessary re-renders
                if (JSON.stringify(parsed) !== JSON.stringify(conversations)) {
                    setConversations(parsed);
                }
            }
        }, 2000); // Check every 2s
        return () => clearInterval(interval);
    }, [conversations]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeConv?.messages]);

    const openConversation = (id) => {
        setActiveId(id);
        setInputText('');
        // mark as read for student view
        setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, unreadStatus: { ...c.unreadStatus, student: false } } : c))
        );
    };

    const sendMessage = () => {
        const text = inputText.trim();
        if (!text || !activeId) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setConversations((prev) =>
            prev.map((c) =>
                c.id === activeId
                    ? {
                        ...c,
                        preview: text,
                        time: 'Just now',
                        // mark unread for staff
                        unreadStatus: { ...c.unreadStatus, staff: true },
                        messages: [...c.messages, { from: 'student', text, time: timeStr }],
                    }
                    : c
            )
        );
        setInputText('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="messages-page">
            <div className="messages-layout">
                {/* Sidebar - Conversation List */}
                <div className={`messages-sidebar ${activeId ? 'hide-mobile' : ''}`}>
                    <div className="sidebar-header">
                        <h1>Messages</h1>
                    </div>

                    <div className="messages-list">
                        {conversations.map((m) => (
                            <div
                                key={m.id}
                                className={`message-item ${m.unreadStatus?.student ? 'unread' : ''} ${activeId === m.id ? 'active' : ''}`}
                                onClick={() => openConversation(m.id)}
                            >
                                <div className={`message-avatar ${m.color}`}>{m.initials}</div>
                                <div className="message-body">
                                    <div className="message-top">
                                        <span className="message-sender">{m.sender}</span>
                                        <span className="message-time">{m.time}</span>
                                    </div>
                                    <span className="message-subject">{m.subject}</span>
                                    <p className="message-preview">{m.preview}</p>
                                </div>
                                {m.unreadStatus?.student && <div className="unread-badge" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className={`chat-window ${activeId ? 'show' : ''}`}>
                    {!activeConv ? (
                        <div className="chat-empty">
                            <div className="chat-empty-icon">💬</div>
                            <h2>Select a conversation</h2>
                            <p>Click on a message to start chatting with your professor</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="chat-header">
                                <button className="back-btn" onClick={() => setActiveId(null)}>
                                    <IoArrowBack />
                                </button>
                                <div className={`message-avatar sm ${activeConv.color}`}>{activeConv.initials}</div>
                                <div className="chat-header-info">
                                    <span className="chat-name">{activeConv.sender}</span>
                                    <span className="chat-status">{activeConv.subject}</span>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="chat-messages">
                                {activeConv.messages.map((msg, i) => (
                                    <div key={i} className={`chat-bubble-wrap ${msg.from === 'student' ? 'me' : 'them'}`}>
                                        {msg.from === 'mentor' && (
                                            <div className={`bubble-avatar ${activeConv.color}`}>{activeConv.initials}</div>
                                        )}
                                        <div className="chat-bubble">
                                            <p>{msg.text}</p>
                                            <span className="bubble-time">{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Input */}
                            <div className="chat-input-bar">
                                <textarea
                                    ref={inputRef}
                                    className="chat-input"
                                    placeholder={`Message ${activeConv.sender}...`}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                />
                                <button
                                    className="send-btn"
                                    onClick={sendMessage}
                                    disabled={!inputText.trim()}
                                >
                                    <IoSend />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
