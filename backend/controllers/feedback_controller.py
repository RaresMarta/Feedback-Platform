from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from repositories.feedback_repository import FeedbackRepository
from repositories.user_repository import UserRepository
from services.feedback_service import FeedbackService
from controllers.user_controller import get_current_user, get_optional_user
from domain.models import User, FeedbackDomain
from domain.schemas import FeedbackCreate, FeedbackResponse, FeedbackList, UpvoteResponse
import logging


router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_feedback_service(db: Session = Depends(get_db)) -> FeedbackService:
    feedback_repository = FeedbackRepository(db)
    user_repository = UserRepository(db)
    return FeedbackService(feedback_repository, user_repository)

@router.get("/feedbacks", response_model=FeedbackList)
def get_feedbacks(service: FeedbackService = Depends(get_feedback_service)):
    logger.info("Getting all feedbacks")
    feedbacks = service.get_all_feedbacks()
    return FeedbackList(items=feedbacks)

@router.post("/feedbacks", response_model=FeedbackResponse)
def create_feedback(
    feedback_create: FeedbackCreate,
    service: FeedbackService = Depends(get_feedback_service),
    current_user: Optional[User] = Depends(get_optional_user)
):
    logger.info("Creating feedback")
    user_id = None
    if current_user and not feedback_create.is_anonymous:
        user_id = getattr(current_user, 'id', None)

    feedback_domain = FeedbackDomain(
        content=feedback_create.content,
        company=feedback_create.company,
        user_id=user_id,
        is_anonymous=feedback_create.is_anonymous
    )
    return service.create_feedback(feedback_domain)

@router.put("/feedbacks/{feedback_id}/upvote", response_model=UpvoteResponse)
def upvote_feedback(feedback_id: int, service: FeedbackService = Depends(get_feedback_service)):
    logger.info("Upvoting feedback")
    return service.upvote_feedback(feedback_id)

@router.get("/users/{user_id}/feedbacks", response_model=FeedbackList)
def get_user_feedbacks(
    user_id: int,
    service: FeedbackService = Depends(get_feedback_service),
    current_user: User = Depends(get_current_user)
):
    logger.info("Getting user feedbacks")
    # Only allow users to see their own feedbacks or admins to see any user's feedbacks
    if current_user and (getattr(current_user, 'id', None) == user_id):
        return service.get_user_feedbacks(user_id)
    else:
        raise HTTPException(status_code=403, detail="Not authorized to view these feedbacks") 