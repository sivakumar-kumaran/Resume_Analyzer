"""
PDF Processing Service using PyMuPDF (fitz)
-------------------------------------------
Java Equivalent: PDFBoxService / iTextComponent @Service class
This service handles reading raw bytes of uploaded PDF resumes and extracting text line by line.
"""

from fastapi import HTTPException, status

try:
    import pymupdf as fitz
except ImportError:
    import fitz  # Fallback for older PyMuPDF versions


class PDFService:
    """
    Service class providing PDF parsing and validation logic.
    """

    MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB limit

    @classmethod
    def validate_file(cls, filename: str, content_type: str, file_size: int) -> None:
        """
        Validates the uploaded file extension, content-type header, and size limit.
        Throws HTTPException 400 if validation fails.
        """
        if not filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Only PDF documents (.pdf) are allowed.",
            )

        if file_size > cls.MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds maximum allowed limit of {cls.MAX_FILE_SIZE_BYTES / (1024 * 1024):.1f} MB.",
            )

    @classmethod
    def extract_text_from_bytes(cls, pdf_bytes: bytes) -> tuple[str, int]:
        """
        Extracts clean plain text and total page count from raw PDF bytes in memory.
        
        PyMuPDF Internals:
        - Opens in-memory stream using fitz.open(stream=..., filetype="pdf")
        - Iterates over pages and invokes page.get_text("text")
        - Returns a tuple of (extracted_text_string, total_pages)
        """
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            total_pages = len(doc)
            
            if total_pages == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The provided PDF document is empty (0 pages).",
                )

            extracted_chunks = []
            for page_num in range(total_pages):
                page = doc.load_page(page_num)
                page_text = str(page.get_text("text") or "")
                if page_text.strip():
                    extracted_chunks.append(page_text.strip())

            doc.close()

            full_text = "\n\n".join(extracted_chunks)
            if not full_text.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No readable text could be extracted from the PDF. (It may contain scanned images without OCR text).",
                )

            return full_text, total_pages

        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse PDF document. File may be encrypted or corrupted: {str(e)}",
            )
