from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    profile_pic: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    profile_pic: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    profile_pic: Optional[str] = None
    created_at: Optional[str] = None
    analysis_history: Optional[List[str]] = []
