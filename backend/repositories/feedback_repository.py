from sqlalchemy.orm import Session
from domain.models import Feedback
from domain.models import FeedbackDomain
from typing import Optional, List
from domain.schemas import UpvoteResponse, FeedbackResponse
from datetime import datetime

class FeedbackRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, feedback_domain: FeedbackDomain) -> FeedbackResponse:
        feedback_orm = Feedback(
            content=feedback_domain.content,
            company=feedback_domain.company,
            upvote_count=feedback_domain.upvote_count,
            user_id=feedback_domain.user_id,
        )
        self.db.add(feedback_orm)
        self.db.commit()
        self.db.refresh(feedback_orm)
        return self._to_response_model(feedback_orm)

    def get_all(self) -> List[FeedbackResponse]:
        feedbacks = self.db.query(Feedback).all()
        return [self._to_response_model(feedback) for feedback in feedbacks]
    
    def get_by_id(self, feedback_id: int) -> Optional[FeedbackResponse]:
        feedback = self.db.query(Feedback).filter(Feedback.id == feedback_id).first()
        return self._to_response_model(feedback) if feedback else None
    
    def get_by_user_id(self, user_id: int) -> List[FeedbackResponse]:
        feedbacks = self.db.query(Feedback).filter(Feedback.user_id == user_id).all()
        return [self._to_response_model(feedback) for feedback in feedbacks]
    
    def toggle_upvote(self, feedback_id: int, is_upvoted: bool) -> UpvoteResponse:
        feedback = self.db.query(Feedback).filter(Feedback.id == feedback_id).first()
        if not feedback:
            return UpvoteResponse(upvoteCount=0)
        
        current_count = getattr(feedback, 'upvote_count', 0)
        if is_upvoted:
            # Decrement
            new_count = max(0, current_count - 1)  # Prevent negative counts
            self.db.query(Feedback).filter(Feedback.id == feedback_id).update({"upvote_count": new_count})
        else:
            # Increment
            new_count = current_count + 1
            self.db.query(Feedback).filter(Feedback.id == feedback_id).update({"upvote_count": new_count})
            
        self.db.commit()
        updated_feedback = self.db.query(Feedback).filter(Feedback.id == feedback_id).first()
        new_upvote_count = getattr(updated_feedback, 'upvote_count', 0) if updated_feedback else 0
        return UpvoteResponse(upvoteCount=new_upvote_count)
    
    def delete(self, feedback_id: int) -> bool:
        feedback = self.db.query(Feedback).filter(Feedback.id == feedback_id).first()
        if not feedback:
            return False
        self.db.delete(feedback)
        self.db.commit()
        return True
    
    def _to_response_model(self, feedback: FeedbackDomain) -> FeedbackResponse:
        days_ago = (datetime.now() - feedback.created_at).days if feedback.created_at else 0
        return FeedbackResponse(
            id=feedback.id if feedback.id else 0,
            content=feedback.content,
            upvote_count=feedback.upvote_count,
            days_ago=days_ago,
            company=feedback.company,
        )

    
