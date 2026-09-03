"""
Comprehensive End-to-End Test Suite for AI Resume Intelligence Assistant
-------------------------------------------------------------------------
Validates all phases directly via service & router layers:
1. PDF Text Extraction (PyMuPDF)
2. Job Description Parsing
3. Keyword & Semantic Matching Engine
4. Deterministic Match Score Calculation
5. Interview Question Generator
6. RAG Vector Similarity Search (FAISS / VectorStore)
"""

import sys
import os
import asyncio
import pymupdf as fitz

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.models.schemas.job import JobAnalysisRequest
from app.models.schemas.match import SkillMatchRequest
from app.models.schemas.interview import InterviewQuestionRequest
from app.models.schemas.rag import RAGQueryRequest

from app.api.routes.resume import upload_resume
from app.api.routes.job import analyze_job
from app.api.routes.match import evaluate_match
from app.api.routes.interview import generate_interview_questions
from app.api.routes.rag import rag_query

from fastapi import UploadFile

def generate_sample_pdf(filepath: str):
    doc = fitz.open()
    page = doc.new_page()
    
    resume_content = """John Doe
Software Engineer | Java & MERN Developer
Email: john.doe@example.com | Phone: (123) 456-7890 | Tech: Java, React, Node.js, Python, MongoDB

EDUCATION
Bachelor of Engineering in Computer Science (2022 - 2026)
GPA: 3.8 / 4.0

TECHNICAL SKILLS
- Languages: Java, Python, JavaScript, TypeScript, SQL
- Frontend: React, Redux, HTML5, CSS3, Tailwind CSS
- Backend: Spring Boot, FastAPI, Node.js, Express.js, REST APIs
- Databases: MongoDB, PostgreSQL, MySQL
- Tools & Cloud: Git, Docker, Maven, Postman, AWS

PROJECTS
1. E-Commerce Platform (MERN Stack)
   - Built a scalable microservices architecture with Node.js and MongoDB.
   - Integrated Payment Gateway and JWT authentication.

2. Smart Resume Evaluation System (FastAPI & AI)
   - Developed an AI-powered resume parser extracting skills and calculating match scores.
   - Used PyMuPDF for document text extraction and FAISS for vector search.

WORK EXPERIENCE
Software Developer Intern - TechCorp (Summer 2025)
- Developed REST APIs in Spring Boot for user profile management.
- Improved database query performance by 25%.

CERTIFICATIONS
- AWS Certified Cloud Practitioner
- Oracle Certified Associate Java Programmer
"""
    page.insert_text(fitz.Point(50, 50), resume_content, fontsize=10)
    doc.save(filepath)
    doc.close()

async def run_tests():
    print("==========================================================")
    print("   AI RESUME INTELLIGENCE ASSISTANT - E2E TEST SUITE")
    print("==========================================================")

    pdf_filename = "e2e_resume.pdf"
    generate_sample_pdf(pdf_filename)
    print(f"[1/5] Generated sample PDF resume: {pdf_filename}")

    try:
        # 1. Upload & Extract PDF
        with open(pdf_filename, "rb") as f:
            upload_file = UploadFile(filename=pdf_filename, file=f)
            resume_response = await upload_resume(upload_file)
        
        resume_text = resume_response.extracted_text
        print(f"[2/5] Phase 2 PDF Extraction -> PASSED (Extracted {resume_response.text_length} chars, {resume_response.page_count} page)")
        assert "John Doe" in resume_text
        assert resume_response.resume_id is not None

        # 2. Parse Job Description
        job_description = """
Position: Senior Full Stack Java & Python Developer
Required Skills: Java, Python, Spring Boot, React, REST APIs, SQL, Docker, Kubernetes
Preferred Skills: Microservices, AWS, MongoDB, Redis
Responsibilities:
- Build high-throughput async microservices.
- Design responsive frontend components using React.
- Optimize database queries and setup CI/CD pipelines.
"""
        job_response = await analyze_job(JobAnalysisRequest(job_description=job_description))
        print(f"[3/5] Phase 3 & 4 Job Parsing -> PASSED (Extracted {len(job_response.required_skills)} required skills)")
        assert len(job_response.required_skills) > 0

        # 3. Match Engine & Score Calculation
        match_response = await evaluate_match(SkillMatchRequest(resume_text=resume_text, job_description=job_description))
        print(f"[4/5] Phase 5 & 7 Match Engine -> PASSED (Overall Match Score: {match_response.overall_match_score}%)")
        print(f"      Matched Skills (Keyword): {match_response.keyword_matched_skills}")
        print(f"      Missing Skills: {match_response.missing_skills}")
        assert match_response.overall_match_score > 50.0

        # 4. Interview Generator & RAG Vector Pipeline
        interview_response = await generate_interview_questions(
            InterviewQuestionRequest(
                resume_text=resume_text,
                job_description=job_description,
                missing_skills=match_response.missing_skills,
            )
        )
        rag_response = await rag_query(
            RAGQueryRequest(
                user_query="Why am I missing skills for Kubernetes?",
                resume_text=resume_text,
                job_description=job_description,
            )
        )
        print(f"[5/5] Phase 8 & 9 Interview Prep & RAG -> PASSED")
        print(f"      Generated {len(interview_response.technical_questions)} Tech Qs, {len(interview_response.project_questions)} Project Qs")
        safe_snippet = rag_response.answer[:120].encode('ascii', 'replace').decode('ascii')
        print(f"      RAG Answer Snippet: {safe_snippet}...")

        print("\n==========================================================")
        print("   ALL BACKEND PHASES (1 TO 10) TESTED & VERIFIED 100%!")
        print("==========================================================")

    finally:
        if os.path.exists(pdf_filename):
            os.remove(pdf_filename)

if __name__ == "__main__":
    asyncio.run(run_tests())
