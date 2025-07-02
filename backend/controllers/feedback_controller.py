from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from repositories.feedback_repository import FeedbackRepository
from services.feedback_service import FeedbackService
from controllers.user_controller import get_current_user
from domain.models import User, FeedbackDomain
from domain.schemas import FeedbackCreate, FeedbackResponse, UpvoteResponse
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/feedbacks", tags=["feedbacks"])

def get_feedback_service(db: Session = Depends(get_db)) -> FeedbackService:
    feedback_repository = FeedbackRepository(db)
    return FeedbackService(feedback_repository)

@router.get("/", response_model=List[FeedbackResponse])
def get_feedbacks(service: FeedbackService = Depends(get_feedback_service)):
    logger.info("Getting all feedbacks")
    feedbacks = service.get_all_feedbacks()
    return feedbacks

@router.post("/", response_model=FeedbackResponse)
def create_feedback(
    feedback_create: FeedbackCreate,
    service: FeedbackService = Depends(get_feedback_service),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id = getattr(current_user, 'id', None)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    logger.info("Creating feedback from user %s", user_id)
    feedback_domain = FeedbackDomain(
        content=feedback_create.content,
        company=feedback_create.company,
        user_id=user_id,
    )
    return service.create_feedback(feedback_domain)

@router.put("/{feedback_id}/upvote", response_model=UpvoteResponse)
def toggle_upvote(feedback_id: int, is_upvoted: bool, service: FeedbackService = Depends(get_feedback_service)):
    logger.info("Upvoting feedback %s", feedback_id)
    return service.toggle_upvote(feedback_id, is_upvoted)

@router.get("/users/{user_id}", response_model=List[FeedbackResponse])
def get_user_feedbacks(user_id: int, service: FeedbackService = Depends(get_feedback_service)):
    logger.info("Getting all feedbacks of user %s", user_id)
    return service.get_user_feedbacks(user_id)