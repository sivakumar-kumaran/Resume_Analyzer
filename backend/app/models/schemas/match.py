"""
Pydantic Schemas for Skill Matching & Match Scoring
---------------------------------------------------
"""

from typing import List, Dict
from pydantic import BaseModel, Field


class MatchScoreBreakdown(BaseModel):
    technical_skills: float = Field(..., description="Technical skills score (40% weight)")
    experience: float = Field(..., description="Experience match score (20% weight)")
    projects: float = Field(..., description="Projects relevance score (20% weight)")
    education: float = Field(..., description="Education alignment score (10% weight)")
    other_requirements: float = Field(..., description="Certifications & soft skills score (10% weight)")
    overall_score: float = Field(..., description="Total calculated weighted match score (0-100%)")


class SkillMatchRequest(BaseModel):
    resume_text: str = Field(...)
    job_description: str = Field(...)


class SkillMatchResponse(BaseModel):
    candidate_name: str = Field(...)
    job_title: str = Field(...)
    overall_match_score: float = Field(..., description="Deterministic overall match percentage (0 - 100%)")
    score_breakdown: MatchScoreBreakdown = Field(...)
    keyword_matched_skills: List[str] = Field(default_factory=list)
    semantic_matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    ats_suggestions: List[str] = Field(default_factory=list)
    recommended_improvements: List[str] = Field(default_factory=list)
