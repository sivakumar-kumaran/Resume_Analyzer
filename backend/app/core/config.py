"""
Application Configuration Module
--------------------------------
Java Equivalent: @ConfigurationProperties / application.yml
Reads environment variables from .env file.
"""

import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()


class Settings:
    PROJECT_NAME: str = "AI Resume Intelligence & Interview Assistant"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Server Settings
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "127.0.0.1")
    
    # AI Credentials
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", os.getenv("OPENAI_API_KEY", ""))
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-2.5-flash")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
    
    # MongoDB Settings
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "resume_ai_db")


settings = Settings()
