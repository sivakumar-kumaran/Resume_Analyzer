"""
Pydantic Schemas for Interview Question Generator
--------------------------------------------------
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class QuestionItem(BaseModel):
    category: str = Field(..., example="Technical / Java")
    question: str = Field(...)
    context_or_reason: str = Field(..., description="Why this question is relevant to the candidate's resume or missing skills")
    suggested_answer_topics: List[str] = Field(default_factory=list, description="Key concepts or topics to cover in answer")


class InterviewQuestionRequest(BaseModel):
    resume_text: str = Field(...)
    job_description: str = Field(...)
    missing_skills: Optional[List[str]] = Field(default_factory=list)


class InterviewPrepResponse(BaseModel):
    candidate_name: str = Field(...)
    technical_questions: List[QuestionItem] = Field(default_factory=list)
    project_questions: List[QuestionItem] = Field(default_factory=list)
    hr_questions: List[QuestionItem] = Field(default_factory=list)
