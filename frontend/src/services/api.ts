import axios from 'axios'
import { API_KEY_STORAGE_KEY } from '../components/ApiKeyDialog'

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to inject the API key header
api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY)
  if (apiKey) {
    config.headers = config.headers || {}
    config.headers['x-openai-api-key'] = apiKey
  }
  return config
})

// API response types
export interface ChatRequest {
  message: string
  context?: any[]
}

export interface ChatResponse {
  reply: string
  reasoning?: string
  confidence?: number
  timestamp: string
  model_used: string
}

export interface AICapabilities {
  model: string
  max_tokens: number
  features: string[]
  status: string
  configured: boolean
}

// Chat API functions
export const chatAPI = {
  // Send a message to the AI assistant
  sendMessage: async (message: string): Promise<ChatResponse> => {
    try {
      const response = await api.post<ChatResponse>('/api/v1/chat/send', {
        message,
      })
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw new Error('Failed to send message to AI assistant')
    }
  },

  // Get AI service capabilities
  getCapabilities: async (): Promise<AICapabilities> => {
    try {
      const response = await api.get<AICapabilities>(
        '/api/v1/chat/capabilities'
      )
      return response.data
    } catch (error) {
      console.error('Error getting capabilities:', error)
      throw new Error('Failed to get AI capabilities')
    }
  },

  // Test AI service
  testService: async () => {
    try {
      const response = await api.get('/api/v1/chat/test')
      return response.data
    } catch (error) {
      console.error('Error testing service:', error)
      throw new Error('Failed to test AI service')
    }
  },
}

export default api
