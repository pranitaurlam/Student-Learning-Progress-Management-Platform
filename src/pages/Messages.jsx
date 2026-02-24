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
        unread: true,
        messages: [
            { from: 'them', text: 'Hi! I checked your recent mock test results.', time: '10:00 AM' },
            { from: 'them', text: 'Keep up the good work and aim for good marks in mock tests!', time: '10:02 AM' },
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
        unread: true,
        messages: [
            { from: 'them', text: 'Please submit your frontend assignment by end of this week.', time: '7:30 AM' },
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
        unread: false,
        messages: [
            { from: 'them', text: 'New mock test series for JEE 2026 is now available! Check it out.', time: 'Yesterday' },
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
        unread: false,
        messages: [
            { from: 'them', text: 'I reviewed your doubt — here is a step-by-step solution for Q12.', time: '2 days ago' },
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
        unread: false,
        messages: [
            { from: 'them', text: "DSA revision session tonight at 8 PM. Don't miss it!", time: '3 days ago' },
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
        unread: false,
        messages: [
            { from: 'them', text: 'Great effort this week! Keep pushing forward in your studies.', time: '4 days ago' },
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
        unread: false,
        messages: [
            { from: 'them', text: 'Assignment 3 has been uploaded. Please complete it before Friday.', time: '5 days ago' },
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
        unread: false,
        messages: [
            { from: 'them', text: "Great work on the React project! Let's discuss improvements next session.", time: '6 days ago' },
        ],
    },
];

export default function Messages() {
    const [conversations, setConversations] = useState(initialConversations);
    const [activeId, setActiveId] = useState(null);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const activeConv = conversations.find((c) => c.id === activeId);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeConv?.messages]);

    const openConversation = (id) => {
        setActiveId(id);
        setInputText('');
        // mark as read
        setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
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
                        messages: [...c.messages, { from: 'me', text, time: timeStr }],
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
                                className={`message-item ${m.unread ? 'unread' : ''} ${activeId === m.id ? 'active' : ''}`}
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
                                {m.unread && <div className="unread-badge" />}
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
                                    <div key={i} className={`chat-bubble-wrap ${msg.from === 'me' ? 'me' : 'them'}`}>
                                        {msg.from === 'them' && (
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
