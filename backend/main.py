from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# ✅ CORS - React frontend ko backend se baat karne do
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite React app ka address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Request format
# Frontend bhejta hai: { "message": "user ka question" }
class ChatMessage(BaseModel):
    message: str

# ✅ Home route - server check karne ke liye
@app.get("/")
def home():
    return {"message": "FastAPI Student Solver Running!"}

# ✅ Main endpoint - frontend /api/ai-chat pe POST karta hai
@app.post("/api/ai-chat")
def ai_chat(chat: ChatMessage):
    q = chat.message.lower()

    # ---------- Math ----------
    if "add" in q or "addition" in q:
        reply = "This looks like an addition problem!\nFor example: 5 + 3 = 8.\nAdd all the numbers together to get the sum!"

    elif "subtract" in q or "minus" in q:
        reply = "This is a subtraction problem!\nFor example: 10 - 3 = 7.\nTake away the smaller number from the bigger one!"

    elif "multiply" in q or "multiplication" in q:
        reply = "This is a multiplication problem!\nFor example: 4 x 5 = 20.\nMultiplication is just repeated addition!"

    elif "divide" in q or "division" in q:
        reply = "This is a division problem!\nFor example: 10 / 2 = 5.\nDivision means splitting into equal parts!"

    elif "quadratic" in q:
        reply = "Quadratic equations are in the form: ax2 + bx + c = 0\nUse the formula:\nx = (-b +- sqrt(b2 - 4ac)) / 2a\nStep 1: Find a, b, c\nStep 2: Put in formula\nStep 3: Solve!"

    # ---------- Physics ----------
    elif "newton" in q:
        reply = "Newton's Laws of Motion:\n1st Law: Object stays at rest or in motion unless a force acts on it.\n2nd Law: F = ma (Force = mass x acceleration)\n3rd Law: Every action has an equal and opposite reaction!"

    elif "gravity" in q:
        reply = "Gravity is the force that pulls objects toward each other!\nOn Earth: g = 9.8 m/s2\nFormula: F = mg\nThe heavier the object, the more gravitational force!"

    elif "physics" in q:
        reply = "Physics question detected!\nKey formulas:\n- F = ma (Force)\n- v = u + at (Velocity)\n- E = mc2 (Energy)\n- KE = 1/2 mv2 (Kinetic Energy)\nWhich topic exactly do you need help with?"

    # ---------- Chemistry ----------
    elif "photosynthesis" in q:
        reply = "Photosynthesis is how plants make their own food!\nFormula: 6CO2 + 6H2O + Sunlight -> C6H12O6 + 6O2\nSimple words: Plants take Carbon Dioxide + Water + Sunlight and make Glucose + Oxygen!"

    elif "chemical bonding" in q or "bonding" in q:
        reply = "Chemical Bonding basics:\n- Ionic Bond: electrons transfer (Metal + Non-metal)\n- Covalent Bond: electrons share (Non-metal + Non-metal)\n- Metallic Bond: free electrons (Metal + Metal)\nRemember: Ionic = Transfer, Covalent = Share!"

    elif "chemistry" in q:
        reply = "Chemistry question!\nRemember:\n- Balance your equations\n- Check the periodic table for valency\n- Ionic compounds dissolve in water\n- Organic compounds contain Carbon!\nWhich topic do you need help with?"

    # ---------- Biology ----------
    elif "cell" in q:
        reply = "A cell is the basic unit of life!\nAnimal Cell has: Nucleus, Mitochondria, Cell Membrane, Ribosomes\nPlant Cell also has: Cell Wall, Chloroplasts, Large Vacuole\nKey difference: Plant cells have Cell Wall and Chloroplasts!"

    elif "biology" in q:
        reply = "Biology question!\nFocus on:\n- Diagrams (label everything!)\n- Cell structure and functions\n- DNA and genetics\n- Ecosystems and food chains\nWhich topic exactly are you studying?"

    # ---------- Programming ----------
    elif "binary search" in q:
        reply = "Binary Search Algorithm:\nWorks only on SORTED arrays!\nSteps:\n1. Find the middle element\n2. If target == middle -> Found!\n3. If target < middle -> Search LEFT half\n4. If target > middle -> Search RIGHT half\n5. Repeat until found!\nTime Complexity: O(log n) - Very fast!"

    elif "python" in q:
        reply = "Python question!\nKey concepts:\n- Variables: x = 5\n- Loops: for i in range(10)\n- Functions: def myFunc():\n- Lists: [1, 2, 3]\n- Dictionaries: {'key': 'value'}\nWhat specific concept do you need help with?"

    elif "javascript" in q or " js " in q:
        reply = "JavaScript question!\nKey concepts:\n- Variables: let x = 5\n- Functions: function myFunc() {}\n- Arrays: [1, 2, 3]\n- Objects: {name: 'John'}\n- DOM: document.getElementById()\nUse console.log() to debug!"

    elif "react" in q:
        reply = "React question!\nKey concepts:\n- useState: data yaad rakhne ke liye\n- useEffect: side effects ke liye\n- props: parent se child ko data bhejne ke liye\n- components: reusable UI pieces\n- JSX: HTML + JavaScript!\nWhat specific part do you need help with?"

    elif "html" in q:
        reply = "HTML question!\nKey tags:\n- Structure: div, section, main\n- Headings: h1 to h6\n- Text: p, span\n- Links: a href\n- Images: img src\n- Forms: form, input, button\nRemember: HTML = Structure, CSS = Style, JS = Behaviour!"

    elif "css" in q:
        reply = "CSS question!\nKey concepts:\n- Selectors: .class, #id, element\n- Flexbox: display flex for layouts\n- Grid: display grid for complex layouts\n- Media Queries: for responsive design\n- Variables: --my-color: red\nWhat specific styling issue do you have?"

    elif "database" in q or "sql" in q:
        reply = "Database/SQL question!\nKey commands:\n- SELECT * FROM table (data padhna)\n- INSERT INTO table VALUES (data daalna)\n- UPDATE table SET (data badalna)\n- DELETE FROM table (data hatana)\n- JOIN: do tables ko jodhna\nWhich SQL concept do you need help with?"

    # ---------- General Questions ----------
    elif "what is" in q:
        reply = f"Great definition question!\nYou asked: '{chat.message}'\nTry breaking it into 3 parts:\n1. What is it? (Definition)\n2. How does it work? (Process)\n3. Give an example! (Application)\nCheck your textbook for the exact definition!"

    elif "how to" in q or "how does" in q:
        reply = f"Process question!\nYou asked: '{chat.message}'\nBreak it into steps:\nStep 1 -> Step 2 -> Step 3\nAlways ask: What is the input? What happens in between? What is the output?\nWhich subject is this from?"

    elif "why" in q:
        reply = f"Cause and Effect question!\nYou asked: '{chat.message}'\nThink about it this way:\n- What happened?\n- What caused it?\n- What is the result?\nUnderstanding 'why' means understanding the reason behind it!"

    elif "explain" in q:
        reply = f"Explanation question!\nYou asked: '{chat.message}'\nTry understanding in 3 parts:\n1. What is it?\n2. How does it work?\n3. Real life example?\nWhich subject is this topic from?"

    elif "solve" in q:
        reply = f"Problem solving question!\nYou asked: '{chat.message}'\nSteps to solve any problem:\n1. Read carefully\n2. Write what is GIVEN\n3. Write what is ASKED\n4. Find the right formula\n5. Substitute values\n6. Solve step by step!\nShow your work always!"

    # ---------- Fallback ----------
    else:
        reply = f"I received your question: '{chat.message}'.\nI am still learning new topics!\nTips to get a better answer:\n- Add keywords like 'what is', 'explain', 'how to'\n- Mention the subject name\n- Break your question into smaller parts\nOr ask your teacher for detailed help!"

    # ✅ Frontend expects: { "reply": "..." }
    return {"reply": reply}