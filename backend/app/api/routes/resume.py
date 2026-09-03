"""
Resume API Routes
-----------------
Java Equivalent: @RestController @RequestMapping("/api/resume")
This router handles resume PDF upload, validation, and text extraction.
"""

import uuid
from fastapi import APIRouter, File, UploadFile, status
from app.models.schemas.resume import ResumeUploadResponse
from app.services.pdf_service import PDFService

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post(
    "/upload",
    response_model=ResumeUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Resume PDF & Extract Text",
    description="Accepts a PDF resume, validates file constraints, extracts text using PyMuPDF, and returns structured response.",
)
async def upload_resume(file: UploadFile = File(...)) -> ResumeUploadResponse:
    """
    Endpoint handler for resume upload.
    
    FastAPI UploadFile Parameters:
    - file.filename: string original filename
    - file.content_type: MIME header (e.g. application/pdf)
    - await file.read(): reads file contents asynchronously into memory bytes
    """
    filename = file.filename or "uploaded_resume.pdf"
    
    # Read binary bytes asynchronously
    contents = await file.read()
    file_size = len(contents)

    # 1. Validate file constraints
    PDFService.validate_file(
        filename=filename,
        content_type=file.content_type or "",
        file_size=file_size,
    )

    # 2. Extract plain text using PyMuPDF service
    extracted_text, page_count = PDFService.extract_text_from_bytes(contents)

    # 3. Generate unique identifier for this resume session
    resume_id = str(uuid.uuid4())

    return ResumeUploadResponse(
        resume_id=resume_id,
        filename=filename,
        file_size_bytes=file_size,
        page_count=page_count,
        text_length=len(extracted_text),
        extracted_text=extracted_text,
        message="Resume PDF processed and text extracted successfully!",
    )
