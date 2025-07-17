import React, { useState } from 'react'
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Divider,
} from '@mui/material'
import {
  MoreVert as MoreIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import { Message } from '../types/chat'
import { chatStorage } from '../utils/chatStorage'

interface ChatActionsProps {
  messages: Message[]
  onClearMessages: () => void
  onImportMessages: (messages: Message[]) => void
  onNewSession?: () => void
  sessions?: Array<{ id: string; title: string; messages: any[] }>
  currentSessionId?: string | null
  onSwitchSession?: (sessionId: string) => void
  onDeleteSession?: (sessionId: string) => void
}

const ChatActions: React.FC<ChatActionsProps> = ({
  messages,
  onClearMessages,
  onImportMessages,
  onNewSession,
  sessions = [],
  currentSessionId,
  onSwitchSession,
  onDeleteSession,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importData, setImportData] = useState('')
  const [importError, setImportError] = useState('')

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleExportChat = () => {
    const exportData = chatStorage.exportChat(messages)
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    handleMenuClose()
  }

  const handleCopyLastMessage = () => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      navigator.clipboard.writeText(lastMessage.content)
    }
    handleMenuClose()
  }

  const handleClearMessages = () => {
    setShowClearDialog(true)
    handleMenuClose()
  }

  const handleConfirmClear = () => {
    onClearMessages()
    chatStorage.clearMessages()
    setShowClearDialog(false)
  }

  const handleImportChat = () => {
    setShowImportDialog(true)
    handleMenuClose()
  }

  const handleImportData = () => {
    try {
      const importedMessages = chatStorage.importChat(importData)
      if (importedMessages.length > 0) {
        onImportMessages(importedMessages)
        setImportData('')
        setImportError('')
        setShowImportDialog(false)
      } else {
        setImportError('Invalid chat data format')
      }
    } catch (error) {
      setImportError('Failed to import chat data')
    }
  }

  const handleNewSession = () => {
    onNewSession?.()
    handleMenuClose()
  }

  const handleSwitchSession = (sessionId: string) => {
    onSwitchSession?.(sessionId)
    handleMenuClose()
  }

  const handleDeleteSession = (sessionId: string) => {
    onDeleteSession?.(sessionId)
    handleMenuClose()
  }

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        size="small"
        sx={{ color: 'text.secondary' }}
      >
        <MoreIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: (theme) => ({
            minWidth: 220,
            mt: 1,
            borderRadius: 3,
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.45)'
                : '0 8px 32px rgba(0,0,0,0.10)',
            backdropFilter: 'blur(18px)',
            background:
              theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.92)'
                : 'rgba(255,255,255,0.92)',
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
          }),
        }}
      >
        {/* Session Management */}
        <MenuItem onClick={handleNewSession}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>New Chat</ListItemText>
        </MenuItem>

        {sessions.length > 1 && (
          <>
            <Divider />
            {sessions.map((session) => (
              <MenuItem
                key={session.id}
                onClick={() => handleSwitchSession(session.id)}
                selected={session.id === currentSessionId}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ListItemText
                  primary={session.title}
                  secondary={`${session.messages.length} messages`}
                />
                {session.id !== currentSessionId && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteSession(session.id)
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </MenuItem>
            ))}
            <Divider />
          </>
        )}

        {/* Chat Actions */}
        <MenuItem onClick={handleExportChat} disabled={messages.length === 0}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export Chat</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleImportChat}>
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Import Chat</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleCopyLastMessage}
          disabled={messages.length === 0}
        >
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Last Message</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleClearMessages}
          disabled={messages.length === 0}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clear Chat</ListItemText>
        </MenuItem>
      </Menu>

      {/* Clear Chat Dialog */}
      <Dialog open={showClearDialog} onClose={() => setShowClearDialog(false)}>
        <DialogTitle>Clear Chat History</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear all chat messages? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmClear}
            color="error"
            variant="contained"
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Chat Dialog */}
      <Dialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Import Chat</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Paste your exported chat JSON data below:
          </Typography>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            style={{
              width: '100%',
              minHeight: '200px',
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            placeholder="Paste JSON data here..."
          />
          {importError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {importError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImportDialog(false)}>Cancel</Button>
          <Button onClick={handleImportData} variant="contained">
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ChatActions
