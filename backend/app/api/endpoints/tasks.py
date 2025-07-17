"""
Task management endpoints for the Personal AI Assistant.
"""

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from datetime import datetime
import logging

router = APIRouter()

# Pydantic models
class Subtask(BaseModel):
    id: str
    title: str
    description: str
    completed: bool = False

class Task(BaseModel):
    id: str
    title: str
    description: str
    priority: str  # low,medium', 'high'
    estimatedTime: str
    dependencies: List[str] = []
    subtasks: List[Subtask] = []
    completed: bool = False

class TaskPlanRequest(BaseModel):
    goal: str
    timeframe: str
    complexity: str
    resources: str
    constraints: str

class TaskPlanResponse(BaseModel):
    success: bool = True
    message: str = "Task plan generated successfully"
    tasks: List[Task]
    totalTasks: int
    estimatedTotalTime: str

# Utility function
async def generate_task_plan(goal: str, timeframe: str, complexity: str, resources: str, constraints: str, api_key: str = None):
    from openai import OpenAI
    if not api_key:
        api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OpenAI API key not configured.")
    
    client = OpenAI(api_key=api_key)
    
    prompt = f"""
You are a senior AI project planner. Create a detailed task plan for the following goal:

GOAL: {goal}
TIMEFRAME: {timeframe}
COMPLEXITY: {complexity}
RESOURCES: {resources}
CONSTRAINTS: {constraints}

Break down this project into actionable tasks. Each task should include:
- A clear, actionable title
- Detailed description of what needs to be done
- Priority level (low, medium, high)
- Estimated time to complete
- Any dependencies on other tasks
- Optional subtasks for complex tasks

Consider the complexity level and available resources when planning.
For complex projects, break down into smaller subtasks.

Respond in clean JSON format:
{{
  "tasks": [
    {{
      "id": "task-1",
      "title": "Task title",
      "description": "Detailed description",
      "priority": "medium",
      "estimatedTime": "2-3 hours",
      "dependencies": [],
      "subtasks": [
        {{
          "id": "subtask-1",
          "title": "Subtask title",
          "description": "Subtask description",
          "completed": false
        }}
      ],
      "completed": false
    }}
  ],
  "totalTasks": 5,
  "estimatedTotalTime": "2 weeks"
}}
"""
 
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful AI project planner. Always respond with valid JSON."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=2000,
            temperature=0.4,
        )
        
        import json
        content = response.choices[0].message.content.strip()
        
        # Try to extract JSON from the response
        try:
            # If the response is wrapped in markdown, remove it
            if content.startswith('```json'):
                content = content.split('```json')[1].split('```')[0].strip()
            elif content.startswith('```'):
                content = content.split('```')[1].split('```')[0].strip()
            
            data = json.loads(content)
            
            # Ensure we have the required fields
            if 'tasks' not in data:
                raise ValueError("Response missing 'tasks' field")
            
            # Add success and message fields
            data['success'] = True
            data['message'] = "Task plan generated successfully"
            
            return data
            
        except Exception as e:
            raise RuntimeError(f"Failed to parse LLM response as JSON: {e}\nRaw: {content}")
            
    except Exception as e:
        logging.error(f"Task planning LLM error: {e}")
        raise RuntimeError("AI planning failed. Please try again later.")

@router.post("/plan", response_model=TaskPlanResponse)
async def plan_tasks(request: TaskPlanRequest, http_request: Request):
    try:
        # Get API key from header if present
        api_key = http_request.headers.get("x-openai-api-key")
        if not api_key:
            api_key = os.getenv("OPENAI_API_KEY")
        
        plan = await generate_task_plan(
            goal=request.goal,
            timeframe=request.timeframe,
            complexity=request.complexity,
            resources=request.resources,
            constraints=request.constraints,
            api_key=api_key,
        )
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 