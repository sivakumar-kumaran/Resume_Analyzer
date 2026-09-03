"""
Pydantic Schemas for RAG (Retrieval-Augmented Generation) Pipeline
------------------------------------------------------------------
"""

from typing import List
from pydantic import BaseModel, Field


class RAGQueryRequest(BaseModel):
    user_query: str = Field(..., example="Why am I missing skills for this job?")
    resume_text: str = Field(...)
    job_description: str = Field(...)


class RetrievedChunk(BaseModel):
    text: str = Field(...)
    score: float = Field(..., description="Cosine similarity score")
    source: str = Field(..., example="job_requirements / resume_experience")


class RAGQueryResponse(BaseModel):
    query: str = Field(...)
    answer: str = Field(..., description="LLM generated answer based on retrieved context")
    retrieved_chunks: List[RetrievedChunk] = Field(default_factory=list)
