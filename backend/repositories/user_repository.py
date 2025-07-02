from sqlalchemy.orm import Session
from domain.models import User
from domain.models import UserDomain
from typing import Optional, List
from domain.schemas import UserResponse


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_domain: UserDomain) -> UserResponse:
        user_orm = User(
            username=user_domain.username, 
            email=user_domain.email, 
            hashed_password=user_domain.password
        )
        self.db.add(user_orm)
        self.db.commit()
        self.db.refresh(user_orm)
        return self._to_response_model(user_orm)

    def get_all(self) -> List[UserResponse]:
        users = self.db.query(User).all()
        return [self._to_response_model(user) for user in users]
    
    def get_by_id(self, user_id: int) -> Optional[UserResponse]:
        user = self.db.query(User).filter(User.id == user_id).first()
        return self._to_response_model(user) if user else None
    
    def get_by_email(self, email: str) -> Optional[UserDomain]:
        user = self.db.query(User).filter(User.email == email).first()
        return user.to_domain() if user else None
    
    def get_by_username(self, username: str) -> Optional[UserResponse]:
        user = self.db.query(User).filter(User.username == username).first()
        return self._to_response_model(user) if user else None
    
    def update(self, user_id: int, user_domain: UserDomain) -> Optional[UserResponse]:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        if user_domain.username:
            setattr(user, 'username', user_domain.username)
        if user_domain.email:
            setattr(user, 'email', user_domain.email)
        if user_domain.password:
            setattr(user, 'hashed_password', user_domain.password)
            
        self.db.commit()
        return self.get_by_id(user_id)

    def delete(self, user_id: int) -> bool:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        self.db.delete(user)
        self.db.commit()
        return True

    def _to_response_model(self, user: UserDomain) -> UserResponse:
        return UserResponse(
            id=getattr(user, 'id', 0),
            username=getattr(user, 'username', ''),
            email=getattr(user, 'email', '')
        )
