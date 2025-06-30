from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from database import get_db
from repositories.feedback_repository import FeedbackRepository
from repositories.user_repository import UserRepository
from services.feedback_service import FeedbackService
from controllers.user_controller import get_current_user
from domain.models import User, FeedbackDomain

router = APIRouter()

def get_feedback_service(db: Session = Depends(get_db)) -> FeedbackService:
    feedback_repository = FeedbackRepository(db)
    user_repository = UserRepository(db)
    return FeedbackService(feedback_repository, user_repository)

@router.get("/feedbacks", response_model=List[Dict])
def get_feedbacks(service: FeedbackService = Depends(get_feedback_service)):
    return service.get_all_feedbacks()

@router.post("/feedbacks", response_model=Dict)
def create_feedback(
    feedback_create: Dict, 
    service: FeedbackService = Depends(get_feedback_service),
    current_user: User = Depends(get_current_user)
):
    user_id = None
    if current_user:
        user_id = getattr(current_user, 'id', None)
        
    feedback_domain = FeedbackDomain(
        content=feedback_create.get("content", ""),
        company=feedback_create.get("company", ""),
        user_id=user_id,
        is_anonymous=feedback_create.get("is_anonymous", False)
    )
    return service.create_feedback(feedback_domain)

@router.post("/feedbacks/anonymous", response_model=Dict)
def create_anonymous_feedback(
    feedback_create: Dict, 
    service: FeedbackService = Depends(get_feedback_service)
):
    feedback_domain = FeedbackDomain(
        content=feedback_create.get("content", ""),
        company=feedback_create.get("company", ""),
        is_anonymous=True
    )
    return service.create_feedback(feedback_domain)

@router.put("/feedbacks/{feedback_id}/upvote", response_model=Dict)
def upvote_feedback(feedback_id: int, service: FeedbackService = Depends(get_feedback_service)):
    return service.upvote_feedback(feedback_id)

@router.get("/users/{user_id}/feedbacks", response_model=List[Dict])
def get_user_feedbacks(
    user_id: int,
    service: FeedbackService = Depends(get_feedback_service),
    current_user: User = Depends(get_current_user)
):
    # Only allow users to see their own feedbacks or admins to see any user's feedbacks
    if current_user and (getattr(current_user, 'id', None) == user_id):
        return service.get_user_feedbacks(user_id)
    else:
        raise HTTPException(status_code=403, detail="Not authorized to view these feedbacks") 