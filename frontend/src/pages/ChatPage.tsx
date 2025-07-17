import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Snackbar,
} from '@mui/material'
import { SmartToy as AIIcon } from '@mui/icons-material'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import ChatActions from '../components/ChatActions'
import QuickActions from '../components/QuickActions'
import { chatAPI, ChatResponse } from '../services/api'
import { Message } from '../types/chat'
import {
  addMessage,
  createSession,
  setCurrentSession,
  deleteSession,
  updateSessionTitle,
  clearCurrentSession,
  setError,
  selectCurrentMessages,
  selectSessions,
  selectCurrentSessionId,
  selectIsLoading,
  selectError,
} from '../store/slices/chatSlice'

const ChatPage: React.FC = () => {
  const dispatch = useDispatch()
  const messages = useSelector(selectCurrentMessages)
  const sessions = useSelector(selectSessions)
  const currentSessionId = useSelector(selectCurrentSessionId)
  const isLoading = useSelector(selectIsLoading)
  const error = useSelector(selectError)

  const [aiCapabilities, setAiCapabilities] = useState<any>(null)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize with a session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      dispatch(createSession({ title: 'New Chat' }))
    } else if (!currentSessionId) {
      dispatch(setCurrentSession(sessions[0].id))
    }
  }, [dispatch, sessions, currentSessionId])

  // Load AI capabilities on component mount
  useEffect(() => {
    const loadCapabilities = async () => {
      try {
        const capabilities = await chatAPI.getCapabilities()
        setAiCapabilities(capabilities)
      } catch (error) {
        console.error('Failed to load AI capabilities:', error)
      }
    }

    loadCapabilities()
  }, [])

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || !currentSessionId) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    dispatch(addMessage(userMessage))
    setShowQuickActions(false)

    try {
      // Send message to AI backend
      const response: ChatResponse = await chatAPI.sendMessage(messageText)

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: response.reply,
        timestamp: new Date(response.timestamp),
        reasoning: response.reasoning,
        confidence: response.confidence,
        model_used: response.model_used,
      }

      dispatch(addMessage(assistantMessage))
    } catch (error) {
      dispatch(setError('Failed to send message. Please try again.'))
      console.error('Error sending message:', error)
    }
  }

  const handleNewSession = () => {
    dispatch(createSession({ title: 'New Chat' }))
    setShowQuickActions(true)
  }

  const handleSwitchSession = (sessionId: string) => {
    dispatch(setCurrentSession(sessionId))
    setShowQuickActions(messages.length === 0)
  }

  const handleDeleteSession = (sessionId: string) => {
    dispatch(deleteSession(sessionId))
  }

  const handleClearMessages = () => {
    dispatch(clearCurrentSession())
    setShowQuickActions(true)
    setSnackbarMessage('Chat history cleared')
  }

  const handleImportMessages = (importedMessages: Message[]) => {
    // Create a new session with imported messages
    dispatch(createSession({ title: 'Imported Chat' }))
    // Wait for session to be created, then add messages
    setTimeout(() => {
      importedMessages.forEach((message) => {
        dispatch(addMessage(message))
      })
    }, 100)
    setShowQuickActions(false)
    setSnackbarMessage('Chat history imported successfully')
  }

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const currentSession = sessions.find((s) => s.id === currentSessionId)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: (theme) => theme.palette.background.default,
      }}
    >
      {/* Section Header (always visible) */}
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 3,
          pb: 2,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AIIcon
            sx={{
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#b0b4ba' : '#b0b4ba',
              fontSize: 28,
            }}
          />
          <Typography variant="h5" fontWeight={600} color="text.primary">
            AI Chat Assistant
          </Typography>
          {currentSession && (
            <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
              {currentSession.title}
            </Typography>
          )}
          {aiCapabilities && (
            <Chip
              label={
                aiCapabilities.configured ? 'Configured' : 'Not Configured'
              }
              size="small"
              sx={{
                bgcolor: (theme) => theme.palette.background.paper,
                color: 'text.secondary',
                fontWeight: 500,
                ml: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            />
          )}
          {aiCapabilities?.model && (
            <Chip
              label={aiCapabilities.model}
              size="small"
              sx={{
                bgcolor: (theme) => theme.palette.background.paper,
                color: 'text.secondary',
                fontWeight: 500,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            />
          )}
          {aiCapabilities?.status && (
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', ml: 1 }}
            >
              {aiCapabilities.status}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChatActions
            messages={messages}
            onClearMessages={handleClearMessages}
            onImportMessages={handleImportMessages}
            onNewSession={handleNewSession}
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSwitchSession={handleSwitchSession}
            onDeleteSession={handleDeleteSession}
          />
        </Box>
      </Box>

      {/* Main chat area: scrollable, but input always visible */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, sm: 4 }, pb: 2 }}>
          {messages.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                color: 'text.secondary',
                gap: 1.5,
                mt: { xs: 2, sm: 4 },
                mb: 0,
                p: 0,
                minHeight: 0,
                maxHeight: 'none',
              }}
            >
              <AIIcon sx={{ fontSize: 64, mb: 1, opacity: 0.5 }} />
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Welcome to your Personal AI Assistant
              </Typography>
              <Typography variant="body2" sx={{ maxWidth: 400, mb: 2 }}>
                Ask me anything! I can help with analysis, planning,
                problem-solving, and more.
                <br />
                <span style={{ opacity: 0.8 }}>
                  I'll show you my step-by-step reasoning process.
                </span>
              </Typography>
              {showQuickActions && (
                <Box
                  sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 0, m: 0 }}
                >
                  <QuickActions onSelectPrompt={handleQuickAction} />
                </Box>
              )}
            </Box>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <CircularProgress size={20} color="inherit" />
                    <Typography variant="body2">AI is thinking...</Typography>
                  </Paper>
                </Box>
              )}
            </>
          )}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </Box>
        {/* Input Area always at the bottom and always visible */}
        <Box
          sx={{
            flexShrink: 0,
            px: { xs: 2, sm: 4 },
            pb: 2,
            pt: 1,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            background: 'transparent',
            zIndex: 2,
          }}
        >
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={!aiCapabilities?.configured}
            autoFocus
          />
        </Box>
      </Box>
      {/* Error Alert */}
      {error && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}
      {/* Snackbar */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </Box>
  )
}

export default ChatPage
