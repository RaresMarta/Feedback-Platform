from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship, declarative_base

# --------------------------- Domain Models -------------------------- #

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
    created_at: Optional[datetime] = None

# ---------------------------- ORM Models ---------------------------- #

Base = declarative_base()
    
class User(Base):
    __tablename__ = 'users'    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    feedbacks = relationship("Feedback", back_populates="user")

    def to_domain(self) -> UserDomain:
        return UserDomain(
            id=getattr(self, 'id', None),
            username=getattr(self, 'username', ''),
            email=getattr(self, 'email', ''),
            password=getattr(self, 'hashed_password', None),
            created_at=getattr(self, 'created_at', None),
        )

class Feedback(Base):
    __tablename__ = 'feedbacks'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    content = Column(String, nullable=False)
    company = Column(String, nullable=False)
    upvote_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = relationship("User", back_populates="feedbacks")

    def to_domain(self) -> FeedbackDomain:
        return FeedbackDomain(
            id=getattr(self, 'id', None),
            user_id=getattr(self, 'user_id', None),
            content=getattr(self, 'content', ''),
            company=getattr(self, 'company', ''),
            upvote_count=getattr(self, 'upvote_count', 0),
            created_at=getattr(self, 'created_at', None),
        )
