"""
Chat endpoints for the Personal AI Assistant.
"""

from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.services.ai_service import ai_service

router = APIRouter()


class ChatMessage(BaseModel):
    """Chat message model."""
    content: str
    role: str = "user"  # user, assistant, system
    timestamp: Optional[datetime] = None


class ChatRequest(BaseModel):
    """Chat request model."""
    message: str
    context: Optional[List[ChatMessage]] = None


class ChatResponse(BaseModel):
    """Chat response model."""
    reply: str
    reasoning: Optional[str] = None
    confidence: Optional[float] = None
    timestamp: datetime
    model_used: str


@router.post("/send", response_model=ChatResponse)
async def send_message(request: ChatRequest, http_request: Request):
    """
    Send a message to the AI assistant.
    
    This endpoint processes user messages and returns AI responses
    with chain-of-thought reasoning.
    """
    try:
        # Get API key from header if present
        api_key = http_request.headers.get('x-openai-api-key')
        # Generate AI reply using chain-of-thought reasoning
        ai_reply = ai_service.generate_ai_reply(request.message, api_key=api_key)
        
        # Extract reasoning and final answer from the markdown response
        parts = ai_reply.split("## Final Answer")
        reasoning = parts[0].strip() if len(parts) > 1 else ""
        final_answer = parts[1].strip() if len(parts) > 1 else ai_reply
        
        response = ChatResponse(
            reply=final_answer,
            reasoning=reasoning if reasoning else None,
            confidence=0.95,  # High confidence for AI responses
            timestamp=datetime.utcnow(),
            model_used=ai_service.model
        )
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing message: {str(e)}"
        )


@router.get("/test")
async def test_ai_service(http_request: Request):
    """
    Test endpoint to verify AI service is working.
    """
    try:
        api_key = http_request.headers.get('x-openai-api-key')
        test_message = "Hello! Can you help me plan my day?"
        ai_reply = ai_service.generate_ai_reply(test_message, api_key=api_key)
        return {
            "status": "success",
            "message": "AI service is working correctly",
            "test_response": ai_reply,
            "model": ai_service.model
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"AI service error: {str(e)}",
            "model": ai_service.model
        }


@router.get("/history", response_model=List[ChatMessage])
async def get_chat_history():
    """
    Get chat history for the current user.
    """
    # TODO: Implement chat history retrieval with database
    return []


@router.delete("/history")
async def clear_chat_history():
    """
    Clear chat history for the current user.
    """
    # TODO: Implement chat history clearing
    return {"message": "Chat history cleared successfully"}


@router.get("/capabilities")
async def get_ai_capabilities(request: Request):
    api_key = request.headers.get('x-openai-api-key')
    configured = bool(api_key) or ai_service.is_configured
    capabilities = ai_service.get_ai_capabilities()
    capabilities['configured'] = configured
    return capabilities 