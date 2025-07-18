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
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  Button,
} from '@mui/material'
import {
  ContentCopy as CopyIcon,
  Autorenew as RegenerateIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  SmartToy as AIIcon,
  Person as UserIcon,
  ThumbUp as LikeIcon,
  ThumbDown as DislikeIcon,
  Lightbulb as InsightfulIcon,
  Help as QuestionIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  Reply as ReplyIcon,
  PushPin as PinIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AttachFile as AttachmentIcon,
} from '@mui/icons-material'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Message, MessageReaction } from '../types/chat'

// Glassmorphism palette
const BUBBLE_USER = 'rgba(255,255,255,0.85)'
const BUBBLE_ASSISTANT = 'rgba(255,255,255,0.7)'
const TEXT_COLOR = '#222'
const ICON_COLOR = '#b0b4ba'
const AVATAR_BG = 'rgba(245,246,250,0.7)'

interface ChatMessageProps {
  message: Message
  onRegenerate?: (message: Message) => void
  onEdit?: (messageId: string, newContent: string) => void
  onDelete?: (messageId: string) => void
  onReact?: (messageId: string, reactionType: string) => void
  onReply?: (messageId: string) => void
  onPin?: (messageId: string) => void
  isSelected?: boolean
  onSelect?: (messageId: string) => void
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onRegenerate,
  onEdit,
  onDelete,
  onReact,
  onReply,
  onPin,
  isSelected = false,
  onSelect,
}) => {
  const [showReasoning, setShowReasoning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
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

  const handleEdit = () => {
    setIsEditing(true)
    setEditContent(message.content)
  }

  const handleSaveEdit = () => {
    if (onEdit && editContent.trim() !== message.content) {
      onEdit(message.id, editContent.trim())
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(message.content)
  }

  const handleDelete = () => {
    if (onDelete) onDelete(message.id)
    setAnchorEl(null)
  }

  const handleReact = (reactionType: string) => {
    if (onReact) onReact(message.id, reactionType)
  }

  const handleReply = () => {
    if (onReply) onReply(message.id)
    setAnchorEl(null)
  }

  const handlePin = () => {
    if (onPin) onPin(message.id)
    setAnchorEl(null)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getRelativeTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return timestamp.toLocaleDateString()
  }

  const reactionTypes = [
    { type: 'like', icon: <LikeIcon />, label: 'Like' },
    { type: 'dislike', icon: <DislikeIcon />, label: 'Dislike' },
    { type: 'insightful', icon: <InsightfulIcon />, label: 'Insightful' },
    { type: 'question', icon: <QuestionIcon />, label: 'Question' },
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isAssistant ? 'row' : 'row-reverse',
        alignItems: 'flex-end',
        mb: 2,
        position: 'relative',
        '&:hover': {
          '& .message-actions': {
            opacity: 1,
          },
        },
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
          ...(isSelected && {
            border: `2px solid ${theme.palette.primary.main}`,
            boxShadow: `0 0 0 4px ${theme.palette.primary.main}20`,
          }),
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
            {isEditing ? (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    onClick={handleSaveEdit}
                    startIcon={<CheckIcon />}
                    variant="contained"
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    onClick={handleCancelEdit}
                    startIcon={<CloseIcon />}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
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
                  code: ({ node, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    const isInline = !className?.includes('language-')
                    return !isInline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow as any}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
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
                    )
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}

            {/* Edit indicator */}
            {message.isEdited && (
              <Typography
                variant="caption"
                sx={{ opacity: 0.6, fontStyle: 'italic' }}
              >
                (edited)
              </Typography>
            )}
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
              {getRelativeTime(message.timestamp)}
            </Typography>

            {/* Message actions */}
            <Box
              className="message-actions"
              sx={{ opacity: 0, transition: 'opacity 0.2s' }}
            >
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

              <Tooltip title="More options">
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  color="inherit"
                  sx={{ opacity: 0.7, color: iconColor, fontSize: 18 }}
                >
                  <MoreIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Message reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
            {message.reactions.map((reaction, index) => (
              <Chip
                key={index}
                size="small"
                label={`${reaction.count}`}
                onClick={() => handleReact(reaction.type)}
                sx={{
                  backgroundColor: reaction.userReacted
                    ? theme.palette.primary.main
                    : theme.palette.action.hover,
                  color: reaction.userReacted
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* Quick reaction buttons */}
        <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
          {reactionTypes.map((reaction) => (
            <Tooltip key={reaction.type} title={reaction.label}>
              <IconButton
                size="small"
                onClick={() => handleReact(reaction.type)}
                sx={{
                  opacity: 0.6,
                  color: iconColor,
                  '&:hover': {
                    opacity: 1,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {reaction.icon}
              </IconButton>
            </Tooltip>
          ))}
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
                {message.reasoning}
              </ReactMarkdown>
            </Paper>
          </Collapse>
        )}
      </Paper>

      {/* Message menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.45)'
                : '0 8px 32px rgba(0,0,0,0.10)',
            backdropFilter: 'blur(18px)',
            background:
              theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.92)'
                : 'rgba(255,255,255,0.92)',
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <MenuItem onClick={handleReply}>
          <ListItemIcon>
            <ReplyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reply</ListItemText>
        </MenuItem>

        {!isAssistant && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={handlePin}>
          <ListItemIcon>
            <PinIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{message.isPinned ? 'Unpin' : 'Pin'}</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default ChatMessage
