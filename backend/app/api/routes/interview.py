"""
Interview Question Generator API Route
--------------------------------------
Java Equivalent: @RestController @RequestMapping("/api/interview")
"""

from fastapi import APIRouter, status
from app.models.schemas.interview import InterviewQuestionRequest, InterviewPrepResponse
from app.services.interview_service import InterviewService

router = APIRouter(prefix="/interview", tags=["Interview Assistant"])


@router.post(
    "/generate",
    response_model=InterviewPrepResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Targeted Interview Questions",
    description="Generates technical, project architectural, and HR questions based on candidate resume and missing skills.",
)
async def generate_interview_questions(request: InterviewQuestionRequest) -> InterviewPrepResponse:
    return InterviewService.generate_interview_prep(
        resume_text=request.resume_text,
        job_text=request.job_description,
        missing_skills=request.missing_skills or [],
    )
