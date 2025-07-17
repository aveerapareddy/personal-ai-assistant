import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
  Fade,
  Slide,
} from '@mui/material'
import {
  Psychology as BrainIcon,
  Restaurant as ChefIcon,
  Code as CodeIcon,
  Science as ScienceIcon,
  Lightbulb as LightbulbIcon,
  AutoFixHigh as MagicIcon,
  TrendingUp as TrendingIcon,
  School as StudyIcon,
  Build as BuildIcon,
  Explore as ExploreIcon,
} from '@mui/icons-material'

interface LoadingMessage {
  text: string
  icon: React.ReactNode
  category: string
}

const loadingMessages: LoadingMessage[] = [
  // Thinking & Reasoning
  {
    text: '🧠 XAN is analyzing your request with chain-of-thought reasoning...',
    icon: <BrainIcon />,
    category: 'thinking',
  },
  {
    text: '💭 XAN is breaking down the problem into logical steps...',
    icon: <BrainIcon />,
    category: 'thinking',
  },
  {
    text: '🔍 XAN is examining all angles and possibilities...',
    icon: <BrainIcon />,
    category: 'thinking',
  },

  // Cooking & Creativity
  {
    text: '👨‍🍳 XAN is cooking up a delicious response for you...',
    icon: <ChefIcon />,
    category: 'cooking',
  },
  {
    text: '🥘 XAN is mixing the perfect ingredients of knowledge...',
    icon: <ChefIcon />,
    category: 'cooking',
  },
  {
    text: '🍳 XAN is adding the final seasoning to your answer...',
    icon: <ChefIcon />,
    category: 'cooking',
  },

  // Coding & Technology
  {
    text: '💻 XAN is compiling the best solution for you...',
    icon: <CodeIcon />,
    category: 'coding',
  },
  {
    text: '⚡ XAN is processing at lightning speed...',
    icon: <CodeIcon />,
    category: 'coding',
  },
  {
    text: '🔧 XAN is fine-tuning the response algorithm...',
    icon: <CodeIcon />,
    category: 'coding',
  },

  // Science & Research
  {
    text: '🔬 XAN is conducting thorough analysis...',
    icon: <ScienceIcon />,
    category: 'science',
  },
  {
    text: '📊 XAN is gathering data and insights...',
    icon: <ScienceIcon />,
    category: 'science',
  },
  {
    text: '🧪 XAN is running experiments in neural networks...',
    icon: <ScienceIcon />,
    category: 'science',
  },

  // Innovation & Ideas
  {
    text: '💡 XAN is generating innovative solutions...',
    icon: <LightbulbIcon />,
    category: 'innovation',
  },
  {
    text: '✨ XAN is crafting something magical for you...',
    icon: <MagicIcon />,
    category: 'innovation',
  },
  {
    text: '🚀 XAN is launching creative thinking mode...',
    icon: <TrendingIcon />,
    category: 'innovation',
  },

  // Learning & Education
  {
    text: '📚 XAN is consulting the knowledge library...',
    icon: <StudyIcon />,
    category: 'learning',
  },
  {
    text: '🎓 XAN is applying advanced reasoning techniques...',
    icon: <StudyIcon />,
    category: 'learning',
  },
  {
    text: '📖 XAN is reviewing relevant information...',
    icon: <StudyIcon />,
    category: 'learning',
  },

  // Building & Construction
  {
    text: '🏗️ XAN is building a comprehensive response...',
    icon: <BuildIcon />,
    category: 'building',
  },
  {
    text: '🔨 XAN is assembling the perfect answer...',
    icon: <BuildIcon />,
    category: 'building',
  },
  {
    text: '⚙️ XAN is engineering a solution just for you...',
    icon: <BuildIcon />,
    category: 'building',
  },

  // Exploration & Discovery
  {
    text: '🗺️ XAN is exploring the depths of knowledge...',
    icon: <ExploreIcon />,
    category: 'exploration',
  },
  {
    text: '🔍 XAN is discovering the best approach...',
    icon: <ExploreIcon />,
    category: 'exploration',
  },
  {
    text: '🌟 XAN is navigating through possibilities...',
    icon: <ExploreIcon />,
    category: 'exploration',
  },
]

interface AILoadingMessageProps {
  isLoading: boolean
}

const AILoadingMessage: React.FC<AILoadingMessageProps> = ({ isLoading }) => {
  const theme = useTheme()
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [showMessage, setShowMessage] = useState(false)

  // Debug logging
  console.log('AILoadingMessage render:', {
    isLoading,
    showMessage,
    currentMessageIndex,
  })

  useEffect(() => {
    console.log('AILoadingMessage useEffect:', { isLoading })

    if (!isLoading) {
      setShowMessage(false)
      return
    }

    setShowMessage(true)

    // Cycle through messages every 3 seconds
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isLoading])

  // Always render when isLoading is true, regardless of showMessage state
  if (!isLoading) {
    console.log('AILoadingMessage: not loading, returning null')
    return null
  }

  const currentMessage = loadingMessages[currentMessageIndex]
  console.log('AILoadingMessage: rendering with message:', currentMessage.text)

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 2,
      }}
    >
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(102, 126, 234, 0.15)'
                : 'rgba(102, 126, 234, 0.08)',
            color: theme.palette.primary.main,
            borderRadius: 3,
            border: `1px solid ${theme.palette.primary.light}`,
            backdropFilter: 'blur(10px)',
            maxWidth: 500,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              animation: 'shimmer 2s ease-in-out infinite',
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' },
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress
                size={32}
                sx={{
                  color: theme.palette.primary.main,
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.primary.main,
                  fontSize: 16,
                }}
              >
                {currentMessage.icon}
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Fade in={true} timeout={500}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    lineHeight: 1.4,
                  }}
                >
                  {currentMessage.text}
                </Typography>
              </Fade>

              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  mt: 0.5,
                  display: 'block',
                  fontStyle: 'italic',
                }}
              >
                This usually takes a few seconds...
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Slide>
    </Box>
  )
}

export default AILoadingMessage
