from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from typing import Optional
import logging

from database import get_db
from repositories.user_repository import UserRepository
from services.user_service import UserService, SECRET_KEY, ALGORITHM
from domain.schemas import UserCreate, UserResponse, Token, UserLogin
from domain.models import UserDomain


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/users/login")

router = APIRouter(prefix="/api/users", tags=["users"])

def get_user_service(db: Session = Depends(get_db)) -> UserService:
    repository = UserRepository(db)
    return UserService(repository)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    logger.info("Getting current user")
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user_service = get_user_service(db)
    user = user_service.get_user_by_id(int(user_id))
    if user is None:
        raise credentials_exception
    return user


@router.post("/register", response_model=UserResponse)
def register(user_create: UserCreate, service: UserService = Depends(get_user_service)):
    user_domain = UserDomain(
        username=user_create.username,
        email=user_create.email,
        password=user_create.password
    )
    logger.info("Registering user %s", user_domain)
    return service.register_user(user_domain)


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), service: UserService = Depends(get_user_service)):
    credentials = UserLogin(email=form_data.username, password=form_data.password)
    logger.info("Authenticating user %s", credentials.email)
    user = service.authenticate_user(credentials)

    if not user:
        raise HTTPException(status_code=401, detail="Authentication failed")
        
    logger.info("User authenticated: %s", user)
    return service.create_access_token(user)


@router.get("/me", response_model=UserResponse)
async def get_user_me(current_user = Depends(get_current_user)):
    logger.info("Getting user me")
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email
    )
