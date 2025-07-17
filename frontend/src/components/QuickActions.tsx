import React from 'react'
import { Box, Chip, Typography, Divider } from '@mui/material'
import {
  Analytics as AnalyticsIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
} from '@mui/icons-material'

interface QuickAction {
  id: string
  label: string
  prompt: string
  icon: React.ReactElement
  category: string
}

interface QuickActionsProps {
  onSelectPrompt: (prompt: string) => void
}

const QuickActions: React.FC<QuickActionsProps> = ({ onSelectPrompt }) => {
  const quickActions: QuickAction[] = [
    {
      id: 'math-help',
      label: 'Math Problem',
      prompt: 'Can you help me solve this math problem step by step?',
      icon: <ScienceIcon />,
      category: 'Education',
    },
    {
      id: 'code-review',
      label: 'Code Review',
      prompt: 'Can you review this code and suggest improvements?',
      icon: <CodeIcon />,
      category: 'Programming',
    },
    {
      id: 'data-analysis',
      label: 'Data Analysis',
      prompt:
        'I have some data to analyze. Can you help me understand the patterns?',
      icon: <AnalyticsIcon />,
      category: 'Analytics',
    },
    {
      id: 'learning-plan',
      label: 'Learning Plan',
      prompt:
        'I want to learn a new skill. Can you create a structured learning plan?',
      icon: <SchoolIcon />,
      category: 'Education',
    },
    {
      id: 'project-planning',
      label: 'Project Planning',
      prompt:
        'I need help planning a project. Can you break it down into manageable tasks?',
      icon: <WorkIcon />,
      category: 'Productivity',
    },
    {
      id: 'problem-solving',
      label: 'Problem Solving',
      prompt:
        'I have a complex problem to solve. Can you help me think through it systematically?',
      icon: <PsychologyIcon />,
      category: 'Problem Solving',
    },
  ]

  const categories = Array.from(
    new Set(quickActions.map((action) => action.category))
  )

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        pt: { xs: 2, sm: 3 },
        pb: { xs: 1, sm: 2 },
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h5"
        align="center"
        fontWeight={600}
        sx={{ mb: 2, fontSize: { xs: '1.15rem', sm: '1.35rem' } }}
      >
        Quick Actions
      </Typography>
      {categories.map((category, idx) => (
        <Box
          key={category}
          sx={{ width: '100%', mb: idx === categories.length - 1 ? 0 : 2 }}
        >
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
              mb: 1,
              pl: 1,
              fontWeight: 500,
              letterSpacing: 0.1,
              textTransform: 'uppercase',
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
            }}
          >
            {category}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 0.5 }}>
            {quickActions
              .filter((action) => action.category === category)
              .map((action) => (
                <Chip
                  key={action.id}
                  icon={action.icon}
                  label={action.label}
                  onClick={() => onSelectPrompt(action.prompt)}
                  variant="filled"
                  sx={{
                    px: 2.2,
                    py: 1.1,
                    fontSize: '1.01rem',
                    borderRadius: 99,
                    fontWeight: 500,
                    background: (theme) => theme.palette.background.paper,
                    color: (theme) => theme.palette.text.primary,
                    boxShadow: '0 2px 8px 0 rgba(30,34,90,0.07)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.18s',
                    cursor: 'pointer',
                    '&:hover, &:focus': {
                      background: (theme) => theme.palette.action.hover,
                      color: (theme) => theme.palette.primary.main,
                      boxShadow: '0 4px 16px 0 rgba(30,34,90,0.11)',
                    },
                  }}
                />
              ))}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default QuickActions
