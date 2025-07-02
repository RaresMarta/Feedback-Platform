from datetime import datetime
from typing import List
from repositories.feedback_repository import FeedbackRepository
from domain.models import FeedbackDomain
from domain.schemas import FeedbackResponse, UpvoteResponse


class FeedbackService:
    def __init__(self, feedback_repository: FeedbackRepository):
        self.repository = feedback_repository

    def create_feedback(self, feedback_domain: FeedbackDomain) -> FeedbackResponse:
        return self.repository.create(feedback_domain)

    def get_all_feedbacks(self) -> List[FeedbackResponse]:
        feedbacks = self.repository.get_all()
        return feedbacks

    def get_user_feedbacks(self, user_id: int) -> List[FeedbackResponse]:
        feedbacks = self.repository.get_by_user_id(user_id)
        return feedbacks

    def toggle_upvote(self, feedback_id: int, is_upvoted: bool) -> UpvoteResponse:
        return self.repository.toggle_upvote(feedback_id, is_upvoted)

    def delete_feedback(self, feedback_id: int) -> bool:
        return self.repository.delete(feedback_id)