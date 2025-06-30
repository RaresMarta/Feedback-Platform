from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List

# Request Models - User
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Response Models - User
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

# Request Models - Feedback
class FeedbackCreate(BaseModel):
    content: str
    company: str
    is_anonymous: bool = False

class FeedbackUpdate(BaseModel):
    content: Optional[str] = None
    company: Optional[str] = None
    
# Response Models - Feedback
class FeedbackResponse(BaseModel):
    id: int
    content: str
    upvoteCount: int = Field(alias="upvote_count")
    daysAgo: int = Field(alias="days_ago")
    company: str
    badgeLetter: str
    is_anonymous: bool = False
    user: Optional[UserResponse] = None

class FeedbackList(BaseModel):
    items: List[FeedbackResponse]

class UpvoteResponse(BaseModel):
    upvoteCount: int 