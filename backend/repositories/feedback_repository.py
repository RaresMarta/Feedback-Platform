from sqlalchemy.orm import Session
from domain.models import Feedback
from domain.models import FeedbackDomain, UserDomain
from typing import Optional, List


class FeedbackRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[FeedbackDomain]:
        feedbacks = self.db.query(Feedback).all()
        return [self._to_domain(feedback) for feedback in feedbacks]
    
    def get_by_id(self, feedback_id: int) -> Optional[FeedbackDomain]:
        feedback = self.db.query(Feedback).filter(Feedback.id == feedback_id).first()
        return self._to_domain(feedback) if feedback else None
    
    def create(self, feedback_domain: FeedbackDomain) -> FeedbackDomain:
        feedback_orm = Feedback(
            content=feedback_domain.content,
            company=feedback_domain.company,
            upvote_count=feedback_domain.upvote_count,
            user_id=feedback_domain.user_id,
            is_anonymous=feedback_domain.is_anonymous
        )
        self.db.add(feedback_orm)             # Schedule for DB write
        self.db.commit()                      # Commit changes to database
        self.db.refresh(feedback_orm)         # Refresh object with DB values
        return self._to_domain(feedback_orm)  # Convert to domain model
    
    def upvote(self, feedback_id: int) -> Optional[FeedbackDomain]:
        self.db.query(Feedback).filter(Feedback.id == feedback_id).update(
            {"upvote_count": Feedback.upvote_count + 1}
        )
        self.db.commit()
    
    def _to_domain(self, feedback: Feedback) -> FeedbackDomain:
        user = None
        if hasattr(feedback, 'user') and feedback.user is not None:
            user = UserDomain(
                id=getattr(feedback.user, 'id', None),
                username=getattr(feedback.user, 'username', ''),
                email=getattr(feedback.user, 'email', '')
            )
            
        return FeedbackDomain(
            id=getattr(feedback, 'id', None),
            content=getattr(feedback, 'content', ''),
            company=getattr(feedback, 'company', ''),
            upvote_count=getattr(feedback, 'upvote_count', 0),
            is_anonymous=getattr(feedback, 'is_anonymous', False),
            user_id=getattr(feedback, 'user_id', None),
            created_at=getattr(feedback, 'created_at', None),
            user=user
        )

    def get_by_user_id(self, user_id: int) -> List[FeedbackDomain]:
        """Get all feedbacks by a specific user, including anonymous ones"""
        feedbacks = self.db.query(Feedback).filter(Feedback.user_id == user_id).all()
        return [self._to_domain(feedback) for feedback in feedbacks] 