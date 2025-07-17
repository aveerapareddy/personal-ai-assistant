export interface TaskPlanRequest {
  goal: string
  timeframe: string
  complexity: string
  resources: string
  constraints: string
}

export interface Subtask {
  id: string
  title: string
  description: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  estimatedTime: string
  dependencies: string[]
  subtasks: Subtask[]
  completed: boolean
}

export interface TaskPlanResponse {
  success: boolean
  message: string
  tasks: Task[]
  totalTasks: number
  estimatedTotalTime: string
}

export interface TaskPlannerState {
  isLoading: boolean
  error: string | null
  plan: TaskPlanResponse | null
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Expert'
