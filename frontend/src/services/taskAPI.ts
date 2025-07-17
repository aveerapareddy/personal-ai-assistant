import api from './api'
import { TaskPlanRequest, TaskPlanResponse } from '../types/tasks'

export const taskAPI = {
  /**
   * Generate a task plan using AI
   */
  async generateTaskPlan(request: TaskPlanRequest): Promise<TaskPlanResponse> {
    try {
      const response = await api.post<TaskPlanResponse>(
        '/api/v1/tasks/plan',
        request
      )
      return response.data
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail)
      }
      throw new Error('Failed to generate task plan. Please try again.')
    }
  },

  /**
   * Update task completion status (for future use)
   */
  async updateTaskCompletion(taskId: string, done: boolean): Promise<void> {
    try {
      await api.patch(`/api/v1/${taskId}/complete`, { done })
    } catch (error: any) {
      console.error('Failed to update task completion:', error)
    }
  },
}
