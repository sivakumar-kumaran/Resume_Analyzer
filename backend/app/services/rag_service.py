"""
RAG Pipeline Service
--------------------
Executes Retrieval-Augmented Generation:
1. Index resume and job description chunks into VectorStore.
2. Performs vector similarity search for user query.
3. Constructs augmented prompt context.
4. Queries LLM with retrieved context to eliminate hallucinations.
5. Employs intelligent contextual synthesis when running offline.
"""

from typing import List, Dict, Any
import re
from app.vectorstore.vector_store import VectorStore
from app.services.llm_service import LLMService
from app.services.skill_normalizer import SkillNormalizer
from app.models.schemas.rag import RAGQueryResponse, RetrievedChunk


class RAGService:
    @staticmethod
    def answer_query(user_query: str, resume_text: str, job_text: str) -> RAGQueryResponse:
        # 1. Initialize Vector Store and index documents
        vector_store = VectorStore()
        vector_store.add_documents(resume_text, source_label="Resume Document")
        vector_store.add_documents(job_text, source_label="Job Description")

        # 2. Vector Search (Top-4 nearest chunks for richer context)
        top_chunks = vector_store.similarity_search(user_query, top_k=4)

        # 3. Construct Augmented Context Prompt
        context_str = "\n---\n".join([f"Source ({c['source']}, Score: {c['score']}):\n{c['text']}" for c in top_chunks])

        prompt = f"""
You are an expert AI Career Advisor and Technical Recruiter.
Answer the candidate's question accurately using the provided context snippets from their resume and the job description.
Structure your answer clearly with insightful bullet points, highlighting specific evidence from the context and actionable recommendations.

Retrieved Context:
{context_str}

Candidate Question:
{user_query}

Provide a structured, professional, and practical response.
"""

        # 4. Generate LLM Answer
        answer = LLMService.generate_completion(
            prompt=prompt,
            system_prompt="You are an expert RAG career intelligence assistant. Ground your response on the provided context."
        )

        if not answer:
            answer = RAGService._generate_contextual_synthesis(user_query, resume_text, job_text, top_chunks)

        retrieved_models = [
            RetrievedChunk(text=c["text"], score=c["score"], source=c["source"])
            for c in top_chunks
        ]

        return RAGQueryResponse(
            query=user_query,
            answer=answer,
            retrieved_chunks=retrieved_models,
        )

    @staticmethod
    def _generate_contextual_synthesis(
        user_query: str,
        resume_text: str,
        job_text: str,
        top_chunks: List[Dict[str, Any]],
    ) -> str:
        """
        Synthesizes a detailed, intelligent, context-grounded response from indexed chunks
        when the external LLM provider is offline.
        """
        resume_skills = set(SkillNormalizer.extract_canonical_skills(resume_text))
        job_skills = set(SkillNormalizer.extract_canonical_skills(job_text))

        matched = sorted(list(resume_skills.intersection(job_skills)))
        missing = sorted(list(job_skills.difference(resume_skills)))

        query_lower = user_query.lower()

        # Extract top snippet highlights
        resume_snippets = [c["text"] for c in top_chunks if c.get("source") == "Resume Document"]
        job_snippets = [c["text"] for c in top_chunks if c.get("source") == "Job Description"]

        primary_snippet = resume_snippets[0] if resume_snippets else (top_chunks[0]["text"] if top_chunks else "Document context")
        cleaned_snippet = " ".join(primary_snippet.split()[:40])

        job_skills_list = sorted(list(job_skills))

        if any(w in query_lower for w in ["missing", "gap", "lack", "fail", "why"]):
            missing_str = ", ".join(missing[:5]) if missing else "no major technical gaps identified"
            matched_str = ", ".join(matched[:5]) if matched else "Foundational stack"

            return (
                f"### 🎯 Skill Gap & Requirement Analysis\n\n"
                f"Based on the semantic retrieval between your resume and the target role:\n\n"
                f"**1. Core Requirements Identified as Missing / Unverified:**\n"
                f"- **Missing Skills:** {missing_str}\n"
                f"- *Reasoning:* These competencies are explicitly highlighted in the job description but lack dedicated project proof or keywords in your resume.\n\n"
                f"**2. Existing Strengths Retrieved from Resume:**\n"
                f"- **Validated Skills:** {matched_str}\n"
                f"- *Evidence:* \"{cleaned_snippet}...\"\n\n"
                f"**3. Recommended Action Plan:**\n"
                f"- **Quantify Projects:** Add measurable impact bullets for {missing[0] if missing else 'system architecture'} in your projects section.\n"
                f"- **Keyword Placement:** Ensure missing tools are listed under a dedicated **'Technical Skills'** category for ATS parsers."
            )

        elif any(w in query_lower for w in ["project", "portfolio", "build"]):
            return (
                f"### 🚀 Project Evaluation & Alignment\n\n"
                f"**1. Current Project Highlights Retrieved:**\n"
                f"- Relevant context: \"{cleaned_snippet}...\"\n"
                f"- Demonstrates hands-on full-stack capabilities with modern frameworks.\n\n"
                f"**2. How to Elevate Your Projects for this Role:**\n"
                f"- Incorporate target requirements ({', '.join(missing[:3]) if missing else 'Distributed Caching / CI/CD'}).\n"
                f"- Detail architectural challenges (e.g., database schema optimization, non-blocking I/O, API latency reduction)."
            )

        elif any(w in query_lower for w in ["interview", "question", "prep", "prepare"]):
            return (
                f"### 📋 Strategic Interview Preparation Guidance\n\n"
                f"**1. High-Probability Interview Topics:**\n"
                f"- Deep-dive discussion on: \"{cleaned_snippet}...\"\n"
                f"- Technical questions addressing job requirements in {', '.join(job_skills_list[:4]) if job_skills_list else 'Software Engineering'}.\n\n"
                f"**2. Key Talking Points to Prepare:**\n"
                f"- Walk through system trade-offs and concurrency handling.\n"
                f"- Articulate how your past experience translates directly to the employer's tech stack."
            )

        else:
            return (
                f"### 💡 Career Intelligence Assessment for: \"{user_query}\"\n\n"
                f"**1. Retrieved Context Highlights:**\n"
                f"- Relevant experience snippet: \"{cleaned_snippet}...\"\n\n"
                f"**2. Alignment Assessment:**\n"
                f"- **Matching Proficiencies:** {', '.join(matched[:4]) if matched else 'Core engineering fundamentals'}\n"
                f"- **Target Job Demands:** {', '.join(job_skills_list[:4]) if job_skills_list else 'Software engineering stack'}\n\n"
                f"**3. Strategic Recommendation:**\n"
                f"- Align your resume summary and project bullet points with the employer's core stack to boost your match score."
            )
