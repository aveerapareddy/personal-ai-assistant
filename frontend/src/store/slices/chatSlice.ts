import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { chatStorage } from '../../utils/chatStorage'
import { Message as ChatMessage } from '../../types/chat'

// Internal Message type for Redux store (with role field)
interface Message {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: string
  reasoning?: string
  confidence?: number
  model_used?: string
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

interface ChatState {
  sessions: ChatSession[]
  currentSessionId: string | null
  isLoading: boolean
  error: string | null
}

// Helper function to convert ChatMessage to internal Message
const convertToInternalMessage = (chatMessage: ChatMessage): Message => ({
  id: chatMessage.id,
  content: chatMessage.content,
  role: chatMessage.sender === 'user' ? 'user' : 'assistant',
  timestamp: chatMessage.timestamp.toISOString(),
  reasoning: chatMessage.reasoning,
  confidence: chatMessage.confidence,
  model_used: chatMessage.model_used,
})

// Helper function to convert internal Message to ChatMessage
const convertToChatMessage = (message: Message): ChatMessage => ({
  id: message.id,
  sender: message.role === 'user' ? 'user' : 'assistant',
  content: message.content,
  timestamp: new Date(message.timestamp),
  reasoning: message.reasoning,
  confidence: message.confidence,
  model_used: message.model_used,
})

// Load initial sessions from localStorage
const loadSessions = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem('personal-ai-assistant-sessions')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load sessions from localStorage:', error)
  }
  return []
}

const initialState: ChatState = {
  sessions: loadSessions(),
  currentSessionId: null,
  isLoading: false,
  error: null,
}

// Helper function to save sessions to localStorage
const saveSessions = (sessions: ChatSession[]) => {
  try {
    localStorage.setItem(
      'personal-ai-assistant-sessions',
      JSON.stringify(sessions)
    )
  } catch (error) {
    console.error('Failed to save sessions to localStorage:', error)
  }
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Session management
    createSession: (state, action: PayloadAction<{ title?: string }>) => {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: action.payload.title || `Chat ${state.sessions.length + 1}`,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.sessions.unshift(newSession)
      state.currentSessionId = newSession.id
      saveSessions(state.sessions)
    },

    setCurrentSession: (state, action: PayloadAction<string>) => {
      state.currentSessionId = action.payload
    },

    updateSessionTitle: (
      state,
      action: PayloadAction<{ sessionId: string; title: string }>
    ) => {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      )
      if (session) {
        session.title = action.payload.title
        session.updatedAt = new Date().toISOString()
        saveSessions(state.sessions)
      }
    },

    deleteSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter((s) => s.id !== action.payload)
      if (state.currentSessionId === action.payload) {
        state.currentSessionId =
          state.sessions.length > 0 ? state.sessions[0].id : null
      }
      saveSessions(state.sessions)
    },

    // Message management
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      if (state.currentSessionId) {
        const session = state.sessions.find(
          (s) => s.id === state.currentSessionId
        )
        if (session) {
          const internalMessage = convertToInternalMessage(action.payload)
          session.messages.push(internalMessage)
          session.updatedAt = new Date().toISOString()
          saveSessions(state.sessions)
        }
      }
    },

    clearCurrentSession: (state) => {
      if (state.currentSessionId) {
        const session = state.sessions.find(
          (s) => s.id === state.currentSessionId
        )
        if (session) {
          session.messages = []
          session.updatedAt = new Date().toISOString()
          saveSessions(state.sessions)
        }
      }
    },

    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    // Import/Export
    importSessions: (state, action: PayloadAction<ChatSession[]>) => {
      state.sessions = action.payload
      state.currentSessionId =
        action.payload.length > 0 ? action.payload[0].id : null
      saveSessions(state.sessions)
    },

    // Legacy support - clear all messages (for backward compatibility)
    clearMessages: (state) => {
      if (state.currentSessionId) {
        const session = state.sessions.find(
          (s) => s.id === state.currentSessionId
        )
        if (session) {
          session.messages = []
          session.updatedAt = new Date().toISOString()
          saveSessions(state.sessions)
        }
      }
    },
  },
})

export const {
  createSession,
  setCurrentSession,
  updateSessionTitle,
  deleteSession,
  addMessage,
  clearCurrentSession,
  setLoading,
  setError,
  importSessions,
  clearMessages,
} = chatSlice.actions

// Selectors
export const selectCurrentSession = (state: { chat: ChatState }) =>
  state.chat.sessions.find((s) => s.id === state.chat.currentSessionId)

export const selectCurrentMessages = (state: {
  chat: ChatState
}): ChatMessage[] => {
  const session = selectCurrentSession(state)
  if (!session) return []
  return session.messages.map(convertToChatMessage)
}

export const selectSessions = (state: { chat: ChatState }) =>
  state.chat.sessions
export const selectCurrentSessionId = (state: { chat: ChatState }) =>
  state.chat.currentSessionId
export const selectIsLoading = (state: { chat: ChatState }) =>
  state.chat.isLoading
export const selectError = (state: { chat: ChatState }) => state.chat.error

export default chatSlice.reducer
