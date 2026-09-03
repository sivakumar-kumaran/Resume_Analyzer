"""
Pydantic Schemas for Resume Upload & Metadata
----------------------------------------------
Java Equivalent: DTO classes (Data Transfer Objects)
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class EducationItem(BaseModel):
    degree: str = Field(..., example="Bachelor of Engineering in Computer Science")
    institution: str = Field(..., example="State University")
    year: Optional[str] = Field(None, example="2022 - 2026")
    gpa: Optional[str] = Field(None, example="3.8/4.0")


class ProjectItem(BaseModel):
    title: str = Field(..., example="E-Commerce Platform")
    tech_stack: List[str] = Field(default_factory=list, example=["React", "Node.js", "MongoDB"])
    description: str = Field(..., example="Built scalable microservices architecture.")


class ExperienceItem(BaseModel):
    role: str = Field(..., example="Software Developer Intern")
    company: str = Field(..., example="TechCorp")
    duration: Optional[str] = Field(None, example="Summer 2025")
    description: List[str] = Field(default_factory=list, example=["Developed REST APIs in Spring Boot."])


class ParsedResume(BaseModel):
    name: str = Field("Candidate", description="Full candidate name")
    email: Optional[str] = Field(None, description="Contact email")
    phone: Optional[str] = Field(None, description="Contact phone")
    education: List[EducationItem] = Field(default_factory=list)
    technical_skills: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)


class ResumeUploadResponse(BaseModel):
    resume_id: str = Field(...)
    filename: str = Field(...)
    file_size_bytes: int = Field(...)
    page_count: int = Field(...)
    text_length: int = Field(...)
    extracted_text: str = Field(...)
    message: str = Field(...)


class ResumeParseRequest(BaseModel):
    resume_text: str = Field(..., description="Raw text of the resume to be parsed into structured format")
