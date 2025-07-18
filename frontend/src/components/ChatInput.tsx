import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Tooltip,
  Chip,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  Mic as MicIcon,
  Clear as ClearIcon,
  Save as SaveIcon,
} from '@mui/icons-material'

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void
  isLoading: boolean
  disabled?: boolean
  autoFocus?: boolean
  draftMessage?: string
  onDraftChange?: (draft: string) => void
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
  autoFocus = false,
  draftMessage = '',
  onDraftChange,
}) => {
  const [message, setMessage] = useState(draftMessage)
  const [attachments, setAttachments] = useState<File[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const theme = useTheme()

  // Auto-save draft
  useEffect(() => {
    if (onDraftChange && message !== draftMessage) {
      const timeoutId = setTimeout(() => {
        onDraftChange(message)
      }, 1000) // Save draft after 1 second of no typing

      return () => clearTimeout(timeoutId)
    }
  }, [message, draftMessage, onDraftChange])

  // Load draft on mount
  useEffect(() => {
    if (draftMessage) {
      setMessage(draftMessage)
    }
  }, [draftMessage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(
        message.trim(),
        attachments.length > 0 ? attachments : undefined
      )
      setMessage('')
      setAttachments([])
      if (onDraftChange) onDraftChange('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Ctrl+Enter to send message even with shift
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleSubmit(e)
    }

    // Escape to clear message
    if (e.key === 'Escape') {
      setMessage('')
      setAttachments([])
      if (onDraftChange) onDraftChange('')
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments((prev) => [...prev, ...files])
    event.target.value = '' // Reset input
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleVoiceInput = () => {
    // TODO: Implement voice input
    console.log('Voice input not implemented yet')
  }

  const handleClearMessage = () => {
    setMessage('')
    setAttachments([])
    if (onDraftChange) onDraftChange('')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isMessageEmpty = !message.trim() && attachments.length === 0

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {attachments.map((file, index) => (
            <Chip
              key={index}
              label={`${file.name} (${formatFileSize(file.size)})`}
              onDelete={() => handleRemoveAttachment(index)}
              size="small"
              variant="outlined"
              sx={{ maxWidth: 200 }}
            />
          ))}
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              setIsTyping(true)
              setTimeout(() => setIsTyping(false), 1000)
            }}
            onKeyPress={handleKeyPress}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here... (Ctrl+Enter to send, Esc to clear)"
            disabled={isLoading || disabled}
            autoFocus={autoFocus}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Typing indicator */}
          {isTyping && (
            <Typography variant="caption" sx={{ opacity: 0.6, ml: 1 }}>
              Typing...
            </Typography>
          )}
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end' }}>
          {/* File attachment */}
          <Tooltip title="Attach file">
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || disabled}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <AttachIcon />
            </IconButton>
          </Tooltip>

          {/* Voice input */}
          <Tooltip title="Voice input (coming soon)">
            <IconButton
              onClick={handleVoiceInput}
              disabled={isLoading || disabled}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <MicIcon />
            </IconButton>
          </Tooltip>

          {/* Clear message */}
          {!isMessageEmpty && (
            <Tooltip title="Clear message (Esc)">
              <IconButton
                onClick={handleClearMessage}
                disabled={isLoading || disabled}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.error.main,
                  },
                }}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Send button */}
          <IconButton
            type="submit"
            disabled={isMessageEmpty || isLoading || disabled}
            color="primary"
            sx={{
              minWidth: 48,
              height: 48,
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.csv,.json,.js,.ts,.py,.java,.cpp,.c,.html,.css,.md"
      />

      {/* Keyboard shortcuts help */}
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.6 }}>
          Ctrl+Enter: Send • Esc: Clear • Shift+Enter: New line
        </Typography>
        {draftMessage && (
          <Chip
            size="small"
            label="Draft saved"
            icon={<SaveIcon />}
            variant="outlined"
            sx={{ opacity: 0.7 }}
          />
        )}
      </Box>
    </Paper>
  )
}

export default ChatInput
