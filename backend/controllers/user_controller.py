from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from database import get_db
from repositories.user_repository import UserRepository
from services.user_service import UserService, SECRET_KEY, ALGORITHM
from domain.schemas import UserCreate, UserResponse, Token
from domain.models import UserDomain

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/users/login")

def get_user_service(db: Session = Depends(get_db)) -> UserService:
    repository = UserRepository(db)
    return UserService(repository)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
def register_user(user_create: UserCreate, service: UserService = Depends(get_user_service)):
    user_domain = UserDomain(
        username=user_create.username,
        email=user_create.email,
        password=user_create.password
    )
    return service.create_user(user_domain)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), service: UserService = Depends(get_user_service)):
    # Authenticate user
    user = service.authenticate_user(email=form_data.username, password=form_data.password)
    
    # Check if user ID exists
    if user.id is None:
        raise HTTPException(status_code=500, detail="User ID is missing")
    
    # Create access token
    return service.create_access_token(user_id=user.id)

@router.get("/me", response_model=UserResponse)
async def get_user_me(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    } 