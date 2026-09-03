"""
Test script for Phase 2: Resume PDF Text Extraction Endpoint
------------------------------------------------------------
This script generates a test PDF resume using PyMuPDF, launches Uvicorn server in a subprocess,
makes a real HTTP POST request to /api/resume/upload, and validates extracted text.
"""

import sys
import os
import time
import subprocess
import pymupdf as fitz
import requests

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

def main():
    pdf_filename = "sample_resume.pdf"
    generate_sample_pdf(pdf_filename)
    print(f"Generated test PDF: {pdf_filename}")

    # Launch server process
    python_exe = sys.executable
    server_proc = subprocess.Popen(
        [python_exe, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8005"],
        cwd=os.path.dirname(os.path.abspath(__file__))
    )
    
    try:
        # Wait for server to bind to port 8005
        time.sleep(2)

        url = "http://127.0.0.1:8005/api/resume/upload"
        with open(pdf_filename, "rb") as f:
            files = {"file": (pdf_filename, f, "application/pdf")}
            response = requests.post(url, files=files)

        print(f"\nResponse Status Code: {response.status_code}")
        print("Response JSON Payload:")
        import json
        print(json.dumps(response.json(), indent=2))

        assert response.status_code == 201
        json_data = response.json()
        assert "John Doe" in json_data["extracted_text"]
        assert "Java" in json_data["extracted_text"]
        assert json_data["text_length"] > 0
        assert json_data["page_count"] == 1

        print("\nSUCCESS: Phase 2 Resume Upload and Extraction test passed cleanly!")

    finally:
        server_proc.terminate()
        server_proc.wait()
        if os.path.exists(pdf_filename):
            os.remove(pdf_filename)

if __name__ == "__main__":
    main()
