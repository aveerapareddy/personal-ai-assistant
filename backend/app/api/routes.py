"""
API routes for the Personal AI Assistant.
"""

from fastapi import APIRouter
from app.api.endpoints import chat, auth, analysis, tasks

# Create main API router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["Data Analysis"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Task Management"]) 