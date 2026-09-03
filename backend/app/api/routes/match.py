"""
Skill Matching & Scoring API Route
----------------------------------
Java Equivalent: @RestController @RequestMapping("/api/match")
"""

import uuid
from fastapi import APIRouter, status
from app.models.schemas.match import SkillMatchRequest, SkillMatchResponse
from app.services.matching_service import MatchingService
from app.repositories.analysis_repository import AnalysisRepository

router = APIRouter(prefix="/match", tags=["Matching Engine"])


@router.post(
    "",
    response_model=SkillMatchResponse,
    status_code=status.HTTP_200_OK,
    summary="Evaluate Resume vs Job Match",
    description="Calculates keyword & semantic match, weighted match percentage, strengths, weaknesses, and ATS suggestions.",
)
async def evaluate_match(request: SkillMatchRequest) -> SkillMatchResponse:
    match_result = MatchingService.analyze_match(
        resume_text=request.resume_text,
        job_text=request.job_description,
    )

    # Persist in repository layer
    analysis_id = str(uuid.uuid4())
    AnalysisRepository.save_analysis(analysis_id, match_result.dict())

    return match_result
