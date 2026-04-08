import { useState, useRef, useEffect } from 'react';
import './AIDoubtChat.css';

// NOTE (important): Calling Gemini directly from client-side code requires
// embedding your API key in the built app, which is insecure. Prefer a
// server-side proxy. If you still want to run client-only, set
// VITE_GEMINI_API_KEY in your environment (vite will inject it at build time).

const initialMessages = [
    {
        id: 'm0',
        sender: 'bot',
        text:
            "👋 Hi! I'm your AI Doubt Chat assistant. Ask me anything about your studies — from solving equations to explaining complex theories. I'm here to help you learn step by step!",
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

    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text) return;

        const userMsg = { id: `u-${Date.now()}`, sender: 'user', text };
        const botPending = { id: `b-${Date.now()}`, sender: 'bot', text: 'Thinking...', pending: true };

        setMessages((prev) => [...prev, userMsg, botPending]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const reply = await fetchGeminiReply(text);
            setMessages((prev) => prev.map((m) => (m.id === botPending.id ? { ...m, text: reply, pending: false } : m)));
        } catch (err) {
            console.error('Gemini error:', err);
            const errText = err?.message || 'Failed to get response';
            setMessages((prev) => prev.map((m) => (m.id === botPending.id ? { ...m, text: `❌ Error: ${errText}`, pending: false } : m)));
            setError(errText);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !loading) handleSend();
    };

    const handleTopicClick = (topic) => setInput(topic);

    return (
        <div className="chat-page">
            <div className="chat-container">

                <div className="chat-header">
                    <h1>AI Doubt Chat</h1>
                    <p>Get instant explanations and step-by-step help</p>
                </div>

                <div className="chat-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`chat-bubble ${msg.sender} ${msg.pending ? 'pending' : ''}`}>
                            <div className="chat-bubble-label">{msg.sender === 'bot' ? '🤖 AI Tutor' : '🧑‍🎓 You'}</div>
                            {msg.text.split('\n').map((line, i) => (
                                <span key={i}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="suggested-topics">
                    {suggestedTopics.map((t, i) => (
                        <button key={i} className="topic-chip" onClick={() => handleTopicClick(t)} disabled={loading}>
                            {t}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="chat-error" role="alert">⚠️ {error}</div>
                )}

                <div className="chat-input-row">
                    <input
                        type="text"
                        placeholder="Type your doubt here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <button className="chat-send-btn" onClick={handleSend} disabled={loading || !input.trim()}>
                        {loading ? 'Thinking...' : 'Send →'}
                    </button>
                </div>

            </div>
        </div>
    );
}

// WARNING: putting your Gemini API key directly in source is insecure. Anyone with access
// to your frontend bundle can extract and use it. Only do this for local testing or demos.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // <-- Put your API key here
const GEMINI_MODEL = 'gemini-flash-latest'; // example model from Google sample

/**
 * Attempt to use the official @google/genai client (like your sample) via dynamic import.
 * If the client cannot be loaded (likely in many browser builds), fall back to the
 * plain REST Generative Language endpoint.
 *
 * Note: @google/genai is typically intended for Node/server environments. Dynamic import
 * may still fail in the browser due to package dependencies. We keep a REST fallback
 * so the component can still work in client-only environments.
 */
async function fetchGeminiReply(userText) {
    const apiKey = GEMINI_API_KEY;
    const model = GEMINI_MODEL;

    if (!apiKey || apiKey === 'PASTE_YOUR_GEMINI_API_KEY_HERE') {
        throw new Error('Gemini API key not provided in the JSX file. Paste your key into GEMINI_API_KEY.');
    }

    // First try: dynamic import of the official client
    try {
        // dynamic import so bundlers don't always try to include the package
        const mod = await import('@google/genai');
        const { GoogleGenAI } = mod;
        if (typeof GoogleGenAI === 'function' || typeof GoogleGenAI === 'object') {
            // Some builds expect { apiKey } or other options — try common constructor shape
            const ai = new GoogleGenAI({ apiKey });

            // Sample call based on your snippet
            const response = await ai.models.generateContent({
                model,
                contents: userText,
            });

            // Common return shapes: response.text or response.output or nested content
            if (response?.text) return response.text;
            if (response?.output && Array.isArray(response.output) && response.output[0]?.content) {
                // flatten content
                const out = response.output[0].content.map((c) => c.text || c).join('\n');
                return out;
            }

            // Fallback: stringify
            return JSON.stringify(response, null, 2);
        }
    } catch (clientErr) {
        // Likely the package isn't installable/usable in the browser; we'll fall back to REST
        console.warn('Could not use @google/genai client in browser, falling back to REST API:', clientErr?.message || clientErr);
    }

    // REST fallback (Generative Language API) - using the same shape as your curl example
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    // Body shape matches your curl: { contents: [ { parts: [ { text } ] } ] }
    const body = {
        contents: [
            {
                parts: [
                    {
                        text: userText,
                    },
                ],
            },
        ],
    };

    try {
        console.log('[AI] REST call to:', url);
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': apiKey,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const text = await res.text().catch(() => 'NO_BODY');
            console.error('[AI] REST error status:', res.status, res.statusText, 'body:', text);
            throw new Error(`REST API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log('[AI] REST response:', data);

        // Typical generateContent response: .candidates[0].output[0].content or .candidates
        // Try a few common locations
        const candidateText =
            data?.candidates?.[0]?.content?.map((c) => c.text || c).join('\n') ||
            data?.candidates?.[0]?.output?.map((o) => (o.text || JSON.stringify(o))).join('\n') ||
            data?.candidates?.[0]?.output?.[0]?.content?.map((c) => c.text || c).join('\n') ||
            data?.candidates?.[0]?.content?.[0]?.text ||
            data?.outputs?.[0]?.content?.[0]?.text;

        if (candidateText) return candidateText;

        // As a last resort, try to extract text from top-level fields
        if (typeof data === 'string') return data;
        return JSON.stringify(data, null, 2);
    } catch (networkErr) {
        console.error('[AI] Network/Fetch error:', networkErr);
        console.error('navigator.onLine:', typeof navigator !== 'undefined' ? navigator.onLine : 'unknown');
        console.error('If you see "TypeError: Failed to fetch" in the browser, it commonly means a CORS or network issue.');

        // Local fallback to `/api/ai-chat` (your existing FastAPI canned replies)
        try {
            console.log('[AI] Attempting fallback to local /api/ai-chat endpoint...');
            const fb = await fetch('/api/ai-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userText }) });
            if (fb.ok) {
                const fbData = await fb.json();
                console.warn('[AI] Using local fallback /api/ai-chat (not Gemini):', fbData);
                return fbData.reply || JSON.stringify(fbData);
            }
            const fbText = await fb.text().catch(() => 'NO_BODY');
            console.warn('[AI] Local fallback returned non-ok status:', fb.status, fb.statusText, fbText);
        } catch (fbErr) {
            console.warn('[AI] Local fallback failed:', fbErr);
        }

        throw new Error(networkErr?.message || String(networkErr));
    }
}
