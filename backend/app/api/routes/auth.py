from fastapi import APIRouter, HTTPException, status
from app.models.user import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    UserUpdateRequest
)
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/auth", tags=["Authentication & User Management"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(req: UserRegisterRequest):
    existing = UserRepository.find_by_email(req.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please login instead."
        )

    user = UserRepository.create_user(
        name=req.name,
        email=req.email,
        password=req.password,
        profile_pic=req.profile_pic
    )

    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        profile_pic=user.get("profile_pic"),
        created_at=user.get("created_at"),
        analysis_history=user.get("analysis_history", [])
    )


@router.post("/login", response_model=UserResponse)
async def login_user(req: UserLoginRequest):
    user = UserRepository.find_by_email(req.email)
    if not user or user.get("password") != req.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials."
        )

    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        profile_pic=user.get("profile_pic"),
        created_at=user.get("created_at"),
        analysis_history=user.get("analysis_history", [])
    )


@router.get("/profile/{email}", response_model=UserResponse)
async def get_user_profile(email: str):
    user = UserRepository.find_by_email(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        profile_pic=user.get("profile_pic"),
        created_at=user.get("created_at"),
        analysis_history=user.get("analysis_history", [])
    )
