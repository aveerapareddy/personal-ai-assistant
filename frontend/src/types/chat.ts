// Chat message interface
export interface Message {
  id: string
  sender: 'user' | 'assistant'
  content: string
  timestamp: Date
  reasoning?: string // For assistant messages with chain-of-thought reasoning
  confidence?: number
  model_used?: string
}

// Chat state interface
export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  aiCapabilities: AICapabilities | null
}

// AI capabilities interface
export interface AICapabilities {
  model: string
  max_tokens: number
  features: string[]
  status: string
  configured: boolean
}

// Chat input interface
export interface ChatInput {
  message: string
  isTyping: boolean
}
