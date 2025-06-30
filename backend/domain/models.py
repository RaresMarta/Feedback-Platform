from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship, declarative_base


Base = declarative_base()

class User(Base):
    __tablename__ = 'users'    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    feedbacks = relationship("Feedback", back_populates="user")

class Feedback(Base):
    __tablename__ = 'feedbacks'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    content = Column(String, nullable=False)
    company = Column(String, nullable=False)
    upvote_count = Column(Integer, default=0)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = relationship("User", back_populates="feedbacks")

@dataclass
class UserDomain:
    id: Optional[int] = None
    username: str = ""
    email: str = ""
    password: Optional[str] = None
    created_at: Optional[datetime] = None

@dataclass
class FeedbackDomain:
    id: Optional[int] = None
    user_id: Optional[int] = None
    content: str = ""
    company: str = ""
    upvote_count: int = 0
    is_anonymous: bool = False
    created_at: Optional[datetime] = None
    user: Optional[UserDomain] = None 
