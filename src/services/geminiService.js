const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-pro';

export async function fetchGeminiReply(userText, context = '') {
    const apiKey = GEMINI_API_KEY;
    const model = GEMINI_MODEL;

    if (!apiKey || apiKey === 'PASTE_YOUR_GEMINI_API_KEY_HERE' || apiKey === '') {
        throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in .env');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const body = {
        contents: [
            {
                parts: [
                    {
                        text: context ? `Context: ${context}\n\nQuestion: ${userText}` : userText,
                    },
                ],
            },
        ],
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': apiKey,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API Error: ${res.status}`);
        }

        const data = await res.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText) return candidateText;
        throw new Error('No response from AI');
    } catch (err) {
        console.error('Gemini Service Error:', err);
        throw err;
    }
}
