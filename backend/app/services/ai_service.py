"""
AI Service for Personal AI Assistant
Handles OpenAI integration with chain-of-thought reasoning.
"""

import os
import json
from typing import Dict, Any, Optional
from openai import OpenAI
from app.core.config import settings


class AIService:
    """AI service for handling chat interactions with chain-of-thought reasoning."""
    
    def __init__(self):
        """Initialize the AI service with OpenAI client."""
        self.model = settings.OPENAI_MODEL
        self.default_api_key = settings.OPENAI_API_KEY if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "your_openai_api_key_here" else None
        self.client = OpenAI(api_key=self.default_api_key) if self.default_api_key else None
        self.is_configured = bool(self.default_api_key)
        
    def generate_ai_reply(self, user_message: str, api_key: Optional[str] = None) -> str:
        """
        Generate an AI reply using chain-of-thought reasoning.
        Optionally use a per-request OpenAI API key.
        
        Args:
            user_message: The user's input message
            
        Returns:
            Formatted markdown response with reasoning steps
        """
        # Use per-request API key if provided
        key_to_use = api_key or self.default_api_key
        if not key_to_use:
            return f"""## Reasoning Steps
1. Detected that OpenAI API key is not configured
2. Providing helpful setup instructions

## Final Answer
Hi! I'm XAN, your personal AI assistant, but I need to be configured first to show you my full capabilities! 

To get me working:
1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. Create a `.env` file in the backend directory
3. Add: `OPENAI_API_KEY=your_actual_api_key_here`
4. Restart the server

Once configured, I'll be able to help you with anything - from answering questions to planning tasks and analyzing data. What would you like to know?"""

        try:
            # Chain-of-thought prompt template
            system_prompt = """You are XAN, a highly intelligent and friendly personal AI assistant with a distinct personality.

ABOUT XAN:
- You are XAN, not a generic AI assistant
- You have a warm, helpful, and slightly witty personality
- You're enthusiastic about helping users with their questions and tasks
- You think through problems step-by-step using chain-of-thought reasoning
- You're knowledgeable across many domains and love to share insights
- You have a conversational tone but remain professional and accurate

When asked "who are you" or similar questions, respond as XAN:
"I'm XAN, your personal AI assistant! I'm here to help you with anything you need - from answering questions and solving problems to planning tasks and analyzing data. I love thinking through challenges step by step and finding creative solutions. What can I help you with today?"

When given a request, think through it step by step before giving the final answer.
Clearly list each reasoning step in markdown format, then provide the final recommendation or plan at the end.

Always respond in this format:
## Reasoning Steps
1. [First step of analysis]
2. [Second step of analysis]
3. [Continue as needed]

## Final Answer
[Your final recommendation, solution, or response as XAN]

Be helpful, thorough, and explain your thinking clearly while maintaining XAN's personality."""

            # Create the user prompt
            user_prompt = f"Request: {user_message}"
            
            # Always create a new OpenAI client with the key for each request
            client = OpenAI(api_key=key_to_use)
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=settings.OPENAI_MAX_TOKENS,
                temperature=0.7,
                top_p=0.9,
                frequency_penalty=0.1,
                presence_penalty=0.1
            )
            
            # Extract the response content
            ai_reply = response.choices[0].message.content
            
            # Ensure it's properly formatted as markdown
            if not ai_reply.startswith('##'):
                ai_reply = f"## Reasoning Steps\n1. Analyzing your request\n\n## Final Answer\n{ai_reply}"
            
            return ai_reply
            
        except Exception as e:
            # Fallback response if AI service fails
            return f"""## Reasoning Steps
1. Encountered an error while processing your request
2. Providing a helpful fallback response

## Final Answer
Hi there! I'm XAN, and I'm experiencing some technical difficulties right now. Please try again in a moment, or rephrase your request. If the issue persists, please check your API configuration.

Error details: {str(e)}"""

    def analyze_task(self, task_description: str) -> Dict[str, Any]:
        """
        Analyze a task and provide a structured breakdown.
        
        Args:
            task_description: Description of the task to analyze
            
        Returns:
            Dictionary with task analysis
        """
        if not self.is_configured:
            return {
                "analysis": "AI service not configured. Please set up your OpenAI API key.",
                "status": "error"
            }
            
        try:
            system_prompt = """You are a task analysis expert. Given a task description, break it down into:
1. Subtasks
2. Estimated time
3. Priority level
4. Required resources
5. Potential challenges

Respond in JSON format with these fields."""
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Analyze this task: {task_description}"}
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            return {
                "analysis": response.choices[0].message.content,
                "status": "success"
            }
            
        except Exception as e:
            return {
                "analysis": f"Error analyzing task: {str(e)}",
                "status": "error"
            }

    def get_ai_capabilities(self) -> Dict[str, Any]:
        """Get information about the AI service capabilities."""
        return {
            "model": self.model,
            "max_tokens": settings.OPENAI_MAX_TOKENS,
            "features": [
                "chain-of-thought reasoning",
                "task analysis",
                "markdown formatting",
                "error handling"
            ],
            "status": "active" if self.is_configured else "inactive",
            "configured": self.is_configured
        }


# Create a singleton instance
ai_service = AIService() 