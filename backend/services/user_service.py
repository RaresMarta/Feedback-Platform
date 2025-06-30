from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, Depends
from jose import jwt
from passlib.context import CryptContext
from repositories.user_repository import UserRepository
from domain.models import UserDomain
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-development")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.repository = user_repository
    
    def get_user_by_id(self, user_id: int) -> UserDomain:
        user = self.repository.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    
    def create_user(self, user_domain: UserDomain) -> UserDomain:
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
        
        # Create user
        created_user = self.repository.create(user_domain)
        
        # Remove password before returning
        created_user.password = None
        return created_user
    
    def authenticate_user(self, email: str, password: str) -> UserDomain:
        user = self.repository.get_by_email(email)

        # Check if user exists and password is correct
        if not user or not user.password or not self._verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Remove password before returning
        user.password = None
        return user
    
    def create_access_token(self, user_id: int) -> Dict[str, str]:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = datetime.utcnow() + expires_delta
        
        to_encode = {"sub": str(user_id), "exp": expire}
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        
        return {
            "access_token": encoded_jwt,
            "token_type": "bearer"
        }
    
    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    def _get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password) 