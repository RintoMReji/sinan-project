from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key="YOUR_GEMINI_KEY")

class PlanRequest(BaseModel):
    topic: str
    duration: str = "1 week"

@app.get("/")
def read_root():
    return {"message": "AI Server is running!"}

@app.post("/generate-plan")
def generate_plan(request: PlanRequest):
    model = genai.GenerativeModel("gemini-3.5-flash")
    response = model.generate_content(
        f"Create a study plan for {request.topic} over {request.duration}."
    )
    return {"plan": response.text}
