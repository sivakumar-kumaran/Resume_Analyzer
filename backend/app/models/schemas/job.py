"""
Pydantic Schemas for Job Description Parsing
---------------------------------------------
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class JobAnalysisRequest(BaseModel):
    job_description: str = Field(..., description="Raw text of the job description")
    title: Optional[str] = Field(None, description="Optional job title")


class ParsedJobDescription(BaseModel):
    title: str = Field("Software Engineer", description="Extracted or inferred job title")
    required_skills: List[str] = Field(default_factory=list, description="Must-have technical and domain skills")
    preferred_skills: List[str] = Field(default_factory=list, description="Nice-to-have skills")
    education_requirements: List[str] = Field(default_factory=list, description="Education requirements (Degree, Major)")
    experience_requirements: List[str] = Field(default_factory=list, description="Years of experience or background requirements")
    responsibilities: List[str] = Field(default_factory=list, description="Key duties and responsibilities")
