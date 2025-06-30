from datetime import datetime
from fastapi import HTTPException
from typing import Optional, List
from repositories.feedback_repository import FeedbackRepository
from repositories.user_repository import UserRepository
from domain.models import FeedbackDomain, UserDomain
from domain.schemas import FeedbackResponse, UserResponse, UpvoteResponse


class FeedbackService:
    def __init__(self, feedback_repository: FeedbackRepository, user_repository=None):
        self.repository = feedback_repository
        self.user_repository = user_repository

    def get_all_feedbacks(self) -> List[FeedbackResponse]:
        feedbacks = self.repository.get_all()
        return [self._to_response_model(feedback) for feedback in feedbacks]

    def create_feedback(self, feedback_domain: FeedbackDomain) -> FeedbackResponse:
        created_feedback = self.repository.create(feedback_domain)
        return self._to_response_model(created_feedback)

    def upvote_feedback(self, feedback_id: int) -> UpvoteResponse:
        feedback = self.repository.get_by_id(feedback_id)
        if not feedback:
            raise HTTPException(status_code=404, detail="Feedback not found")
        
        self.repository.upvote(feedback_id)
        return UpvoteResponse(upvoteCount=feedback.upvote_count + 1)

    def get_user_feedbacks(self, user_id: int) -> List[FeedbackResponse]:
        """Get all feedbacks by a specific user, including anonymous ones"""
        feedbacks = self.repository.get_by_user_id(user_id)
        return [self._to_response_model(feedback) for feedback in feedbacks]

    def _to_response_model(self, feedback: FeedbackDomain) -> FeedbackResponse:
        """Convert a FeedbackDomain object to a FeedbackResponse model."""
        user_response = None
        # Only include user info if the feedback is not anonymous
        if feedback.user and not feedback.is_anonymous:
            if feedback.user.id is not None:
                user_response = UserResponse(
                    id=feedback.user.id,
                    username=feedback.user.username,
                    email=feedback.user.email
                )
        
        days_ago = (datetime.now() - feedback.created_at).days if feedback.created_at else 0
        badge_letter = feedback.company[0].upper() if feedback.company else ""
        
        # Ensure id is not None
        if feedback.id is None:
            raise ValueError("Feedback ID cannot be None")
            
        return FeedbackResponse(
            id=feedback.id,
            content=feedback.content,
            upvote_count=feedback.upvote_count,
            days_ago=days_ago,
            company=feedback.company,
            badgeLetter=badge_letter,
            user=user_response,
            is_anonymous=feedback.is_anonymous
        ) 