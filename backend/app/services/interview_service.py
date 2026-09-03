"""
Interview Question Generator Service
-----------------------------------
Generates tailored interview preparation questions based on candidate resume, job requirements,
and project architectural choices.
"""

from typing import List, Optional
from app.services.llm_service import LLMService
from app.models.schemas.interview import InterviewPrepResponse, QuestionItem


class InterviewService:
    @staticmethod
    def generate_interview_prep(resume_text: str, job_text: str, missing_skills: Optional[List[str]] = None) -> InterviewPrepResponse:
        parsed_resume = LLMService.parse_resume_to_json(resume_text)
        candidate_name = parsed_resume.get("name", "Candidate")
        projects = parsed_resume.get("projects", [])
        tech_skills = parsed_resume.get("technical_skills", ["Java", "React", "Python", "SQL"])

        # 1. Technical Questions (Java, DSA, DBMS, OOP, APIs, Missing Skills)
        technical_questions = [
            QuestionItem(
                category="Technical / Java Core & Concurrency",
                question="How does Java handle concurrent requests in Spring Boot compared to Python FastAPI's asyncio event loop?",
                context_or_reason="Candidate has background in Java and FastAPI.",
                suggested_answer_topics=[
                    "Java Thread pools & ExecutorService",
                    "Virtual Threads (Java 21 Project Loom)",
                    "FastAPI asyncio single-thread event loop with non-blocking I/O",
                ],
            ),
            QuestionItem(
                category="Technical / Data Structures & Algorithms",
                question=r"What data structure would you choose to perform fast $O(1)$ skill lookups and $O(K \log N)$ similarity ranking?",
                context_or_reason="Relevant for skill matching algorithms.",
                suggested_answer_topics=[
                    "HashSet / HashMap for O(1) keyword matching",
                    "Min-Heap / PriorityQueue for Top-K nearest neighbors",
                    "Array vs Vector space trade-offs",
                ],
            ),
            QuestionItem(
                category="Technical / Database Management Systems (DBMS)",
                question="When would you choose MongoDB (NoSQL) over PostgreSQL/MySQL for storing resume analytics data?",
                context_or_reason="Candidate's resume lists MongoDB & SQL skills.",
                suggested_answer_topics=[
                    "Schema flexibility for variable resume fields",
                    "JSON document storage & indexing",
                    "ACID transactions vs Eventual Consistency",
                ],
            ),
            QuestionItem(
                category="Technical / Object-Oriented Programming (OOP) & Design",
                question="How did you apply SOLID principles when designing the backend service layer?",
                context_or_reason="Core engineering OOP question.",
                suggested_answer_topics=[
                    "Single Responsibility Principle (separating PDF extraction from LLM parsing)",
                    "Open/Closed Principle (abstracting LLM providers)",
                    "Dependency Injection in FastAPI / Spring",
                ],
            ),
            QuestionItem(
                category="Technical / REST APIs & Web Architecture",
                question="How do you handle large file uploads asynchronously without blocking the main event loop?",
                context_or_reason="Directly tests implementation of POST /api/resume/upload.",
                suggested_answer_topics=[
                    "FastAPI UploadFile spooling to disk",
                    "Async file streaming vs loading full byte array into memory",
                    "HTTP multipart/form-data protocol",
                ],
            ),
        ]

        # Add missing skill question if applicable
        if missing_skills:
            skill_target = missing_skills[0]
            technical_questions.append(
                QuestionItem(
                    category=f"Technical / Target Area ({skill_target})",
                    question=f"The job requires '{skill_target}'. How would you explain your learning curve and apply your experience in {tech_skills[0] if tech_skills else 'Java'} to master {skill_target} quickly?",
                    context_or_reason=f"Candidate currently lacks explicit '{skill_target}' keyword on resume.",
                    suggested_answer_topics=[
                        f"Transferable concepts from {tech_skills[0] if tech_skills else 'Java'}",
                        "Hands-on project prototyping approach",
                        "Design pattern equivalencies",
                    ],
                )
            )

        # 2. Project Questions (Architecture, Tech-choice, DB, Scalability, Security, Failure-handling)
        project_questions = []
        proj_name = projects[0]["title"] if projects else "AI Resume Intelligence & Interview Assistant"
        
        project_questions.extend([
            QuestionItem(
                category="Project / Architecture",
                question=f"Can you draw and walk through the end-to-end architecture of '{proj_name}' on a whiteboard?",
                context_or_reason="Tests high-level system design and data flow comprehension.",
                suggested_answer_topics=[
                    "React UI -> FastAPI REST -> PDF Service -> VectorStore -> LLM",
                    "Data flow from raw binary stream to structured JSON response",
                ],
            ),
            QuestionItem(
                category="Project / Technology Choice",
                question=f"Why did you choose PyMuPDF and FAISS for vector storage in '{proj_name}' instead of simple string regex matching?",
                context_or_reason="Justifies tech stack decisions.",
                suggested_answer_topics=[
                    "PyMuPDF C-speed vs PyPDF2 layout parsing",
                    "Semantic similarity capturing intent beyond exact keyword strings",
                    "FAISS fast vector index lookup",
                ],
            ),
            QuestionItem(
                category="Project / Database & Storage",
                question="How is resume metadata stored, and how do you ensure data isolation between different candidates?",
                context_or_reason="Tests database schema design.",
                suggested_answer_topics=[
                    "Repository pattern in MongoDB",
                    "UUID indexed resume IDs",
                    "Metadata encapsulation",
                ],
            ),
            QuestionItem(
                category="Project / Scalability & 10,000 Concurrent Uploads",
                question="How would you scale this application to handle 10,000 resume uploads per minute during peak hiring season?",
                context_or_reason="High-volume scalability system design question.",
                suggested_answer_topics=[
                    "Asynchronous message queue (RabbitMQ / Kafka / Celery)",
                    "Worker pool nodes for CPU-intensive PDF parsing & embeddings",
                    "Distributed vector database (Milvus / Qdrant / Pinecone)",
                ],
            ),
            QuestionItem(
                category="Project / Security & API Protection",
                question="How do you secure file uploads against malicious scripts and prevent API key leakage?",
                context_or_reason="AppSec & API security best practices.",
                suggested_answer_topics=[
                    "Strict MIME type and file extension validation",
                    "5MB file size upload throttling",
                    "Environment variables (.env) and never committing API keys to Git",
                ],
            ),
            QuestionItem(
                category="Project / Failure Handling & Hallucinations",
                question="What happens if the LLM produces invalid JSON or hallucinated skills? How does your system handle failure?",
                context_or_reason="Tests defensive programming and reliability.",
                suggested_answer_topics=[
                    "Pydantic strict schema validation error catching",
                    "Rule-based deterministic parser fallbacks",
                    "RAG context constraints with low temperature (0.2)",
                ],
            ),
        ])

        # 3. HR Questions
        hr_questions = [
            QuestionItem(
                category="HR / Cultural & Career",
                question="Tell me about yourself and why you transitioned from Java/MERN development to building AI-powered engineering systems.",
                context_or_reason="Evaluates candidate's background narrative and engineering passion.",
                suggested_answer_topics=[
                    "Strong foundation in core Java and MERN web development",
                    "Enthusiasm for leveraging Python for AI & Vector RAG applications",
                    "Ability to combine solid backend engineering with modern AI capabilities",
                ],
            ),
            QuestionItem(
                category="HR / Problem Solving",
                question="Describe a difficult technical bug you encountered while building this project and how you resolved it.",
                context_or_reason="Tests problem-solving perseverance and debugging methodology.",
                suggested_answer_topics=[
                    "Systematic log inspection",
                    "Investigating root cause rather than patching symptoms",
                    "Testing with empirical evidence",
                ],
            ),
        ]

        return InterviewPrepResponse(
            candidate_name=candidate_name,
            technical_questions=technical_questions,
            project_questions=project_questions,
            hr_questions=hr_questions,
        )
