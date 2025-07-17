import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Collapse,
  useTheme,
} from '@mui/material'
import {
  ContentCopy as CopyIcon,
  Autorenew as RegenerateIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  SmartToy as AIIcon,
  Person as UserIcon,
} from '@mui/icons-material'
import ReactMarkdown from 'react-markdown'
import { Message } from '../types/chat'

// Glassmorphism palette
const BUBBLE_USER = 'rgba(255,255,255,0.85)'
const BUBBLE_ASSISTANT = 'rgba(255,255,255,0.7)'
const TEXT_COLOR = '#222'
const ICON_COLOR = '#b0b4ba'
const AVATAR_BG = 'rgba(245,246,250,0.7)'

interface ChatMessageProps {
  message: Message
  onRegenerate?: (message: Message) => void
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRegenerate }) => {
  const [showReasoning, setShowReasoning] = useState(false)
  const [copied, setCopied] = useState(false)
  const isAssistant = message.sender === 'assistant'
  const theme = useTheme()

  // Glass backgrounds for light/dark
  const bubbleBg = isAssistant
    ? theme.palette.mode === 'dark'
      ? 'rgba(40,40,50,0.7)'
      : 'rgba(255,255,255,0.55)'
    : theme.palette.mode === 'dark'
      ? 'rgba(30,30,40,0.6)'
      : 'rgba(255,255,255,0.35)'
  const textColor = theme.palette.text.primary
  const iconColor = theme.palette.mode === 'dark' ? '#b0b4ba' : '#b0b4ba'
  const avatarBg =
    theme.palette.mode === 'dark'
      ? 'rgba(60,60,70,0.7)'
      : 'rgba(245,246,250,0.7)'
  const borderColor = theme.palette.divider

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const handleRegenerate = () => {
    if (onRegenerate) onRegenerate(message)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isAssistant ? 'row' : 'row-reverse',
        alignItems: 'flex-end',
        mb: 2,
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          bgcolor: avatarBg,
          color: textColor,
          width: 36,
          height: 36,
          boxShadow: 1,
          mr: isAssistant ? 2 : 0,
          ml: isAssistant ? 0 : 2,
        }}
      >
        {isAssistant ? (
          <AIIcon fontSize="small" />
        ) : (
          <UserIcon fontSize="small" />
        )}
      </Avatar>
      {/* Bubble */}
      <Paper
        elevation={0}
        sx={{
          p: 1.25,
          borderRadius: 1,
          background: bubbleBg,
          color: textColor,
          boxShadow: '0 2px 8px 0 rgba(30,34,90,0.06)',
          minWidth: 0,
          maxWidth: { xs: '80vw', sm: '60vw', md: '48vw' },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(18px)',
          border: `1px solid ${borderColor}`,
        }}
      >
        {/* Message content */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {children}
                  </Typography>
                ),
                h2: ({ children }) => (
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {children}
                  </Typography>
                ),
                h3: ({ children }) => (
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {children}
                  </Typography>
                ),
                p: ({ children }) => (
                  <Typography variant="body2" sx={{ mb: 0 }}>
                    {children}
                  </Typography>
                ),
                ul: ({ children }) => (
                  <Box component="ul" sx={{ pl: 2, mb: 1 }}>
                    {children}
                  </Box>
                ),
                ol: ({ children }) => (
                  <Box component="ol" sx={{ pl: 2, mb: 1 }}>
                    {children}
                  </Box>
                ),
                li: ({ children }) => (
                  <Typography variant="body2" component="li">
                    {children}
                  </Typography>
                ),
                code: ({ children }) => (
                  <Box
                    component="code"
                    sx={{
                      backgroundColor: 'rgba(245,246,250,0.7)',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.95em',
                    }}
                  >
                    {children}
                  </Box>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.6,
                fontSize: '0.72rem',
                whiteSpace: 'nowrap',
                color: textColor,
              }}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
            <Tooltip title={copied ? 'Copied!' : 'Copy'}>
              <IconButton
                size="small"
                onClick={handleCopy}
                color="inherit"
                sx={{ opacity: 0.7, color: iconColor, fontSize: 18 }}
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {isAssistant && onRegenerate && (
              <Tooltip title="Regenerate">
                <IconButton
                  size="small"
                  onClick={handleRegenerate}
                  color="inherit"
                  sx={{ opacity: 0.7, color: iconColor, fontSize: 18 }}
                >
                  <RegenerateIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {isAssistant && message.reasoning && (
              <Tooltip
                title={showReasoning ? 'Hide Reasoning' : 'Show Reasoning'}
              >
                <IconButton
                  size="small"
                  onClick={() => setShowReasoning((v) => !v)}
                  color="inherit"
                  sx={{ opacity: 0.7, color: iconColor, fontSize: 18 }}
                >
                  {showReasoning ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        {/* Reasoning section for assistant messages */}
        {isAssistant && message.reasoning && (
          <Collapse in={showReasoning} sx={{ mt: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                background:
                  theme.palette.mode === 'dark'
                    ? 'rgba(40,40,50,0.85)'
                    : 'rgba(255,255,255,0.92)',
                borderRadius: 1,
                boxShadow: '0 1px 4px rgba(30,34,90,0.03)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${borderColor}`,
              }}
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {children}
                    </Typography>
                  ),
                  h2: ({ children }) => (
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {children}
                    </Typography>
                  ),
                  h3: ({ children }) => (
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {children}
                    </Typography>
                  ),
                  p: ({ children }) => (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {children}
                    </Typography>
                  ),
                  ul: ({ children }) => (
                    <Box component="ul" sx={{ pl: 2, mb: 1 }}>
                      {children}
                    </Box>
                  ),
                  ol: ({ children }) => (
                    <Box component="ol" sx={{ pl: 2, mb: 1 }}>
                      {children}
                    </Box>
                  ),
                  li: ({ children }) => (
                    <Typography variant="body2" component="li">
                      {children}
                    </Typography>
                  ),
                }}
              >
                {message.reasoning}
              </ReactMarkdown>
            </Paper>
          </Collapse>
        )}
      </Paper>
    </Box>
  )
}

export default ChatMessage
