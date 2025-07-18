// Chat message interface
export interface Message {
  id: string
  sender: 'user' | 'assistant'
  content: string
  timestamp: Date
  reasoning?: string // For assistant messages with chain-of-thought reasoning
  confidence?: number
  model_used?: string
  // New enhanced features
  isEdited?: boolean
  editHistory?: string[]
  reactions?: MessageReaction[]
  status?: MessageStatus
  parentId?: string // For threaded conversations
  attachments?: FileAttachment[]
  isPinned?: boolean
}

// Message reaction interface
export interface MessageReaction {
  type: 'like' | 'dislike' | 'helpful' | 'insightful' | 'question'
  count: number
  userReacted: boolean
}

// Message status interface
export interface MessageStatus {
  type: 'sent' | 'delivered' | 'read' | 'error'
  timestamp?: Date
}

// File attachment interface
export interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  url?: string
  preview?: string
}

// Chat state interface
export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  aiCapabilities: AICapabilities | null
  // New state properties
  isTyping: boolean
  draftMessage: string
  searchQuery: string
  selectedMessages: string[]
  viewMode: 'chat' | 'thread' | 'search'
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
  attachments?: File[]
}

// Chat session interface
export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
  // New session properties
  isArchived?: boolean
  tags?: string[]
  summary?: string
  participantCount?: number
}
