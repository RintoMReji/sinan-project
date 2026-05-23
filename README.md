StudyFlow – Personalized Study Plan Generator

StudyFlow is a smart and customizable web app designed to help students create and manage personalized study plans. Built with modern web technologies and an AI-powered backend, StudyFlow helps users stay organized, motivated, and productive in their academic journey.

Features
-  Dynamic study plan generation based on goals and timeline  
-  Smart AI suggestions (via integrated AI backend)  
-  Progress tracking and history view  
-  User profile and customization options  
-  Quiz and feedback system for better learning  
-  Organized UI with modern, responsive design

Tech Stack

Frontend:
- HTML5, CSS3, JavaScript
- Responsive Design

Backend:
- Node.js / Express
- AI logic for study recommendations

Other:
- `.env` for sensitive configs (not pushed)
- Modular folder structure


📂 Project Structure

```bash
StudyFlow/
├── .env               # Environment variables (ignored)
├── .gitignore
├── ai-server/         # AI backend logic
├── index.html         # Landing page
├── dashboard.html     # Main dashboard
├── history.html       # Study history
├── plan.html          # Generated plan
├── settings.html      # Preferences
├── profile.html       # User profile
├── quiz.html          # Quiz component
├── script.js          # App logic
├── server.js          # Node.js backend
├── style.css          # Main styling
└── models/            # Data models (if any)


Local Setup
Clone the repo:

bash
Copy
Edit
git clone https://github.com/sabith-22/StudyFlow.git
cd StudyFlow
Install dependencies (if any):

bash
Copy
Edit
npm install

If you want to run the AI backend, install Python dependencies too:

bash
Copy
Edit
cd ai-server
py -m pip install --upgrade pip
py -m pip install -r requirements.txt

If `py` is not available, use:

bash
Copy
Edit
python -m pip install -r requirements.txt

Create a .env file:
env
Copy
Edit
API_KEY=your_api_key_here
PORT=5000
Run the app:

bash
Copy
Edit
node server.js
 Live Demo
Visit the Live App
(Replace this with your deployed link if available)

Screenshots

Contributing
Pull requests are welcome! If you’d like to improve StudyFlow, please fork the repo and submit a PR.

License
This project is licensed under the MIT License.

Author
Mohammed Sabith
````md
# StudyFlow - Run Guide

## 1. Start MongoDB

Open VS Code terminal and run:

```powershell
"C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "C:\data\db"
````

Keep this terminal open.

---

## 2. Start Backend

Open a new terminal:

```powershell
cd C:\sinan\StudyFlow
node server.js
```

Expected:


MongoDB connected
Server running on http://localhost:5000


---

## 3. Start Frontend

Open another terminal:

cd C:\sinan\StudyFlow

npx live-server

## 4. Open App

Open the URL shown in terminal.

Usually:

```text
http://localhost:3000
```

or

```text
http://127.0.0.1:8080
```

---

## Environment Variable

`.env`

```env
MONGO_URI=mongodb://127.0.0.1:27017/studyflow
```

```
```

