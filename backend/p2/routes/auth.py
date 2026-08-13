from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from p2.database import get_db
from p2.models import User
from p2.schemas import UserRegister, UserLogin, Token, UserOut
from p2.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    """Registers a new user, hashes password, stores in SQLite, and returns JWT access token."""
    existing_user = db.exec(select(User).where(User.email == user_in.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists."
        )

    hashed_pwd = get_password_hash(user_in.password)
    db_user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_pwd
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    access_token = create_access_token(data={"sub": str(db_user.id)})
    user_out = UserOut.model_validate(db_user)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_out
    )


@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticates user credentials and returns JWT access token."""
    user = db.exec(select(User).where(User.email == credentials.email)).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    user_out = UserOut.model_validate(user)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_out
    )


@router.get("/me", response_model=UserOut)
def get_authenticated_user_profile(current_user: User = Depends(get_current_user)):
    """Fetches details for the currently authenticated user session."""
    return UserOut.model_validate(current_user)
