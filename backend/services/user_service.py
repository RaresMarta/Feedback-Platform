from datetime import datetime, timedelta, timezone
from typing import Dict
from fastapi import HTTPException
from jose import jwt
from passlib.context import CryptContext
from repositories.user_repository import UserRepository
from domain.models import UserDomain
import os
from dotenv import load_dotenv
from domain.schemas import UserResponse, UserLogin, Token

# Load environment variables
load_dotenv()

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "a8f$2kL!9zQw3xT7vB6nP0sD4rJ1uYcE")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.repository = user_repository
    
    def get_user_by_id(self, user_id: int) -> UserResponse:
        user = self.repository.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    
    def register_user(self, user_domain: UserDomain) -> UserResponse:
        # Check if email already exists
        if self.repository.get_by_email(user_domain.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check if username already exists
        if self.repository.get_by_username(user_domain.username):
            raise HTTPException(status_code=400, detail="Username already taken")
        
        # Hash password if it exists
        if user_domain.password:
            user_domain.password = self._get_password_hash(user_domain.password)
        else:
            raise HTTPException(status_code=400, detail="Password is required")
        
        return self.repository.create(user_domain)
    
    def authenticate_user(self, credentials: UserLogin) -> UserResponse | None:
        # Check if the user exists
        user_db = self.repository.get_by_email(credentials.email)
        if not user_db:
            raise HTTPException(status_code=401, detail="Invalid email")
        
        # Check if password is correct
        if not user_db.password or not self._verify_password(credentials.password, user_db.password):
            raise HTTPException(status_code=401, detail="Invalid password")

        return self.repository.get_by_id(user_db.id)
    
    def create_access_token(self, user: UserResponse) -> Token:
        # Compute expiration time
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = datetime.now(timezone.utc) + expires_delta 
        
        # Encode the token
        to_encode = {"sub": str(user.id), "exp": expire}
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        
        return Token(
            access_token=encoded_jwt,
            token_type="bearer",
            user=user
        )
    
    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    def _get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)
