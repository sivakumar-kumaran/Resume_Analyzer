"""
Job Description Analysis API Route
----------------------------------
Java Equivalent: @RestController @RequestMapping("/api/job")
"""

from fastapi import APIRouter, status
from app.models.schemas.job import JobAnalysisRequest, ParsedJobDescription
from app.services.llm_service import LLMService

router = APIRouter(prefix="/job", tags=["Job Description"])


@router.post(
    "/analyze",
    response_model=ParsedJobDescription,
    status_code=status.HTTP_200_OK,
    summary="Parse & Analyze Job Description",
    description="Parses job text into required skills, preferred skills, education, and responsibilities.",
)
async def analyze_job(request: JobAnalysisRequest) -> ParsedJobDescription:
    parsed_dict = LLMService.parse_job_description_to_json(request.job_description)
    if request.title and "title" not in parsed_dict:
        parsed_dict["title"] = request.title

    return ParsedJobDescription(**parsed_dict)
