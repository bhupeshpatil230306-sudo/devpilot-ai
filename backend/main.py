from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
import os

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://devpilot-ai-rose.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise Exception("GEMINI_API_KEY not found in environment variables.")

# Initialize Gemini Client
client = genai.Client(api_key=GEMINI_API_KEY)


# -----------------------------
# Request Model
# -----------------------------
class Prompt(BaseModel):
    tool: str
    text: str


# -----------------------------
# Home Route
# -----------------------------
@app.get("/")
def home():
    return {
        "message": "Welcome to DevPilot AI Backend 🚀"
    }


# -----------------------------
# Generate Route
# -----------------------------
@app.post("/generate")
def generate(prompt: Prompt):

    try:

        tool_prompts = {

            "Linux Commands": """
You are a Senior Linux Administrator.

Explain Linux commands clearly.

Always provide:
- Command
- Explanation
- Example
- Best Practices
""",

            "Dockerfile Generator": """
You are a Senior Docker Engineer.

Generate production-ready Dockerfiles.

Also provide:
- .dockerignore
- Build Command
- Run Command
- Optimization Tips
""",

            "GitHub Actions": """
You are a Senior DevOps Engineer.

Generate complete GitHub Actions workflow YAML.

Also explain every important step.
""",

            "Error Debugger": """
You are a Senior Software Debugger.

Always explain:
- Root Cause
- Why it happened
- Solution
- Correct Code
- Prevention Tips
""",

            "Bash Script": """
You are a Linux Automation Engineer.

Generate safe, production-ready Bash scripts.

Explain how to execute the script.
"""
        }

        tool_prompt = f"""
{tool_prompts.get(prompt.tool, "")}

User Request:
{prompt.text}

GENERAL INSTRUCTIONS

- Always respond in VALID Markdown.
- Start with a short explanation.
- Wrap EVERY code snippet inside triple backticks.
- Always specify the language after the opening backticks.
- Never return raw code.
- End with best practices.

Language identifiers:

- Linux Commands → bash
- Dockerfile Generator → dockerfile
- GitHub Actions → yaml
- Bash Script → bash
- Python → python
- JSON → json
- HTML → html
- CSS → css
- JavaScript → javascript
- SQL → sql

Generate complete, production-ready solutions.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash"
            contents=tool_prompt,
        )

        if not response or not response.text:
            raise HTTPException(
                status_code=500,
                detail="Gemini returned an empty response."
            )

        return {
            "response": response.text
        }

    except Exception as e:
        print("ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )