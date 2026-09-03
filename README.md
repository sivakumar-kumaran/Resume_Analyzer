# 🚀 AI Resume Intelligence & Interview Assistant

An end-to-end full-stack AI platform for resume parsing, job match evaluation, RAG-powered career Q&A, and customized interview preparation.

---

## 🌟 Key Features
- **PDF Resume Parser**: Extracts structured candidate information using PyMuPDF and Google Gemini LLM.
- **Job Requirement Analyzer**: Identifies required & preferred tech skills from unstructured job descriptions.
- **Skill Match Engine**: Calculates deterministic match score, missing skills gap analysis, and keyword matches.
- **RAG Career Assistant**: Retrieval-Augmented Generation over parsed resume & job context.
- **Live Mock Interview Prep**: Generates personalized technical, algorithmic, DBMS, and behavioral questions.
- **Interactive Fullscreen Interview Mode**: Immersive timer, camera preview, and voice response controls.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Vanilla CSS (Tailored Design System, Glassmorphism, Dark/Light Themes)
- **Icons**: Lucide React
- **Deployment**: Vercel

### Backend
- **Framework**: Python 3.10+ / FastAPI / Uvicorn
- **AI / LLM**: Google Gemini (`gemini-2.5-flash`)
- **Database**: MongoDB Atlas
- **Vector Search / RAG**: Normalized dense vector embeddings + Cosine similarity
- **Deployment**: Render

---

## 🚀 Getting Started Locally

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Deployment

### Render (Backend)
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Vercel (Frontend)
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_URL=https://<your-render-backend>.onrender.com`

---

## 📄 License
MIT License.
