import { Message } from '../types/chat'

const CHAT_STORAGE_KEY = 'personal-ai-assistant-chat-messages'
const SESSIONS_STORAGE_KEY = 'personal-ai-assistant-sessions'
const MAX_MESSAGES = 100 // Limit to prevent localStorage overflow

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export const chatStorage = {
  // Legacy support - Save messages to localStorage (for backward compatibility)
  saveMessages: (messages: Message[]): void => {
    try {
      const messagesToSave = messages.slice(-MAX_MESSAGES) // Keep only recent messages
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messagesToSave))
    } catch (error) {
      console.error('Failed to save messages to localStorage:', error)
    }
  },

  // Legacy support - Load messages from localStorage (for backward compatibility)
  loadMessages: (): Message[] => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY)
      if (stored) {
        const messages = JSON.parse(stored)
        // Convert timestamp strings back to Date objects
        return messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      }
    } catch (error) {
      console.error('Failed to load messages from localStorage:', error)
    }
    return []
  },

  // Save sessions to localStorage
  saveSessions: (sessions: ChatSession[]): void => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions))
    } catch (error) {
      console.error('Failed to save sessions to localStorage:', error)
    }
  },

  // Load sessions from localStorage
  loadSessions: (): ChatSession[] => {
    try {
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load sessions from localStorage:', error)
    }
    return []
  },

  // Clear all stored messages (legacy)
  clearMessages: (): void => {
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear messages from localStorage:', error)
    }
  },

  // Clear all stored sessions
  clearSessions: (): void => {
    try {
      localStorage.removeItem(SESSIONS_STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear sessions from localStorage:', error)
    }
  },

  // Export chat as JSON (legacy)
  exportChat: (messages: Message[]): string => {
    const exportData = {
      exportDate: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages,
    }
    return JSON.stringify(exportData, null, 2)
  },

  // Export sessions as JSON
  exportSessions: (sessions: ChatSession[]): string => {
    const exportData = {
      exportDate: new Date().toISOString(),
      sessionCount: sessions.length,
      sessions: sessions,
    }
    return JSON.stringify(exportData, null, 2)
  },

  // Import chat from JSON (legacy)
  importChat: (jsonData: string): Message[] => {
    try {
      const data = JSON.parse(jsonData)
      if (data.messages && Array.isArray(data.messages)) {
        return data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      }
    } catch (error) {
      console.error('Failed to import chat data:', error)
    }
    return []
  },

  // Import sessions from JSON
  importSessions: (jsonData: string): ChatSession[] => {
    try {
      const data = JSON.parse(jsonData)
      if (data.sessions && Array.isArray(data.sessions)) {
        return data.sessions
      }
    } catch (error) {
      console.error('Failed to import sessions data:', error)
    }
    return []
  },

  // Download data as file
  downloadData: (data: string, filename: string): void => {
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  // Generate session title from first message
  generateSessionTitle: (messages: Message[]): string => {
    if (messages.length === 0) return 'New Chat'

    const firstMessage = messages[0]
    if (firstMessage.sender === 'user') {
      const content = firstMessage.content.trim()
      // Take first 50 characters or first line, whichever is shorter
      const title = content.split('\n')[0].substring(0, 50)
      return title || 'New Chat'
    }

    return 'New Chat'
  },

  // Search messages across all sessions
  searchMessages: (
    sessions: ChatSession[],
    query: string
  ): Array<{ session: ChatSession; message: Message }> => {
    const results: Array<{ session: ChatSession; message: Message }> = []
    const lowerQuery = query.toLowerCase()

    sessions.forEach((session) => {
      session.messages.forEach((message) => {
        if (message.content.toLowerCase().includes(lowerQuery)) {
          results.push({ session, message })
        }
      })
    })

    return results
  },
}
