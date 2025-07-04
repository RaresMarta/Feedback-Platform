from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from controllers.feedback_controller import router as feedback_router
from controllers.user_controller import router as user_router

app = FastAPI()

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Include routers
app.include_router(feedback_router)
app.include_router(user_router) 