"""
RAG Vector Search Q&A API Route
--------------------------------
Java Equivalent: @RestController @RequestMapping("/api/rag")
"""

from fastapi import APIRouter, status
from app.models.schemas.rag import RAGQueryRequest, RAGQueryResponse
from app.services.rag_service import RAGService

router = APIRouter(prefix="/rag", tags=["RAG Vector Search"])


@router.post(
    "/query",
    response_model=RAGQueryResponse,
    status_code=status.HTTP_200_OK,
    summary="Query Candidate RAG System",
    description="Vector searches top-K resume and job chunks, constructs context, and generates grounded LLM answer.",
)
async def rag_query(request: RAGQueryRequest) -> RAGQueryResponse:
    return RAGService.answer_query(
        user_query=request.user_query,
        resume_text=request.resume_text,
        job_text=request.job_description,
    )
