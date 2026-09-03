from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.api.routes.resume import router as resume_router
from app.api.routes.job import router as job_router
from app.api.routes.match import router as match_router
from app.api.routes.interview import router as interview_router
from app.api.routes.rag import router as rag_router
from app.api.routes.analysis import router as analysis_router
from app.api.routes.auth import router as auth_router


# Pydantic schema for structured health check response
class HealthCheckResponse(BaseModel):
    status: str
    message: str
    version: str


# Initialize FastAPI App
app = FastAPI(
    title="AI Resume Intelligence & Interview Assistant API",
    description="Backend service for resume parsing, RAG evaluation, skill matching, auth, and interview question generation.",
    version="1.0.0",
)

# Enable CORS for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All API Routers
app.include_router(auth_router, prefix="/api")
app.include_router(resume_router, prefix="/api")
app.include_router(job_router, prefix="/api")
app.include_router(match_router, prefix="/api")
app.include_router(interview_router, prefix="/api")
app.include_router(rag_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")


@app.get("/", summary="Root Endpoint")
async def root():
    return {
        "project": "AI Resume Intelligence & Interview Assistant",
        "status": "online",
        "docs_url": "/docs",
    }


@app.get(
    "/api/health",
    response_model=HealthCheckResponse,
    summary="Health Check Endpoint",
)
async def health_check():
    return HealthCheckResponse(
        status="healthy",
        message="FastAPI server is up and running smoothly!",
        version="1.0.0",
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
