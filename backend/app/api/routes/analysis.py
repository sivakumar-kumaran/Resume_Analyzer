"""
Analysis Retrieval API Route
----------------------------
Java Equivalent: @RestController @RequestMapping("/api/analysis")
"""

from fastapi import APIRouter, HTTPException, status
from app.repositories.analysis_repository import AnalysisRepository

router = APIRouter(prefix="/analysis", tags=["Analysis Repository"])


@router.get(
    "/{analysis_id}",
    status_code=status.HTTP_200_OK,
    summary="Get Saved Analysis Document",
    description="Fetches stored resume analysis document by ID from MongoDB / repository layer.",
)
async def get_analysis(analysis_id: str):
    doc = AnalysisRepository.get_analysis_by_id(analysis_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis document with ID '{analysis_id}' not found.",
        )
    return doc
