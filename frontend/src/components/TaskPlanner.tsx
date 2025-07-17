import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material'
import {
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Schedule as ScheduleIcon,
  Work as WorkIcon,
  Flag as FlagIcon,
  List as ListIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import { taskAPI } from '../services/taskAPI'
import { TaskPlanRequest, Task, TaskPlanResponse } from '../types/tasks'

interface TaskPlannerState {
  isLoading: boolean
  error: string | null
  plan: TaskPlanResponse | null
}

const defaultForm: TaskPlanRequest = {
  goal: '',
  timeframe: '1 month',
  complexity: 'medium',
  resources: 'standard',
  constraints: '',
}
const TaskPlanner: React.FC = () => {
  const theme = useTheme()
  const [formData, setFormData] = useState<TaskPlanRequest>(defaultForm)
  const [state, setState] = useState<TaskPlannerState>({
    isLoading: false,
    error: null,
    plan: null,
  })
  const [showFormCard, setShowFormCard] = useState(true)

  const handleInputChange = (field: keyof TaskPlanRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.goal.trim()) {
      setState((prev) => ({ ...prev, error: 'Please enter a goal' }))
      return
    }
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const plan = await taskAPI.generateTaskPlan(formData)
      setState((prev) => ({ ...prev, isLoading: false, plan }))
      setShowFormCard(false) // Minimize the form after successful generation
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to generate task plan',
      }))
    }
  }

  const handleRegenerate = () => {
    setState((prev) => ({ ...prev, plan: null }))
  }

  const handleShowForm = () => {
    setShowFormCard(true)
  }

  const handleReset = () => {
    setState((prev) => ({
      ...prev,
      plan: null,
      error: null,
    }))
    setFormData(defaultForm)
    setShowFormCard(true)
  }

  const handleTaskToggle = (taskIndex: number) => {
    if (!state.plan) return
    const updatedTasks = [...state.plan.tasks]
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed
    setState((prev) => ({
      ...prev,
      plan: { ...prev.plan!, tasks: updatedTasks },
    }))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return theme.palette.error.main
      case 'medium':
        return theme.palette.warning.main
      case 'low':
        return theme.palette.success.main
      default:
        return theme.palette.grey[500]
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          color="text.primary"
        >
          AI Task Planner
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your goal and let AI create a detailed step-by-step plan
        </Typography>
      </Box>

      {/* Collapsed Form Bar */}
      {!showFormCard && state.plan && (
        <Paper
          elevation={2}
          sx={{
            mb: 3,
            px: 2,
            py: 1.5,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: theme.palette.background.paper,
            boxShadow: '0 2px 8px 0 rgba(30,34,90,0.06)',
            border: `1.5px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="subtitle1" color="text.primary">
            Want to create a new task plan?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleShowForm}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Create New Plan
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Reset
            </Button>
          </Box>
        </Paper>
      )}

      {/* Input Form */}
      {showFormCard && (
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            mb: 4,
            borderRadius: 4,
            background: theme.palette.background.paper,
            boxShadow: '0 8px 32px 0 rgba(30,34,90,0.10)',
            backdropFilter: 'blur(18px)',
            border: `1.5px solid ${theme.palette.divider}`,
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="What's your goal?"
                  placeholder="e.g., Launch my AI product, Learn React, Build a mobile app"
                  value={formData.goal}
                  onChange={(e) => handleInputChange('goal', e.target.value)}
                  multiline
                  rows={3}
                  variant="outlined"
                  color="primary"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Timeframe</InputLabel>
                  <Select
                    value={formData.timeframe}
                    onChange={(e) =>
                      handleInputChange('timeframe', e.target.value)
                    }
                    label="Timeframe"
                  >
                    <MenuItem value="1 week">1 Week</MenuItem>
                    <MenuItem value="2 weeks">2 Weeks</MenuItem>
                    <MenuItem value="1 month">1 Month</MenuItem>
                    <MenuItem value="3 months">3 Months</MenuItem>
                    <MenuItem value="6 months">6 Months</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Complexity</InputLabel>
                  <Select
                    value={formData.complexity}
                    onChange={(e) =>
                      handleInputChange('complexity', e.target.value)
                    }
                    label="Complexity"
                  >
                    <MenuItem value="simple">Simple</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="complex">Complex</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Resources</InputLabel>
                  <Select
                    value={formData.resources}
                    onChange={(e) =>
                      handleInputChange('resources', e.target.value)
                    }
                    label="Resources"
                  >
                    <MenuItem value="minimal">Minimal</MenuItem>
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="extensive">Extensive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Constraints (optional)"
                  placeholder="e.g., Budget limits, time constraints, technical limitations"
                  value={formData.constraints}
                  onChange={(e) =>
                    handleInputChange('constraints', e.target.value)
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={
                    state.isLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <PlayIcon />
                    )
                  }
                  disabled={state.isLoading}
                  sx={{
                    height: 56,
                    fontWeight: 600,
                    borderRadius: 2,
                    background: theme.palette.primary.main,
                    '&:hover': {
                      background: theme.palette.primary.dark,
                    },
                  }}
                >
                  {state.isLoading ? 'Generating Plan...' : 'Generate Plan'}
                </Button>
              </Grid>
            </Grid>
          </form>
          {/* Error State */}
          {state.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {state.error}
            </Alert>
          )}
        </Paper>
      )}

      {/* Task Plan Results */}
      {state.plan && (
        <Box>
          {/* Plan Header */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: theme.palette.background.paper,
              border: `1.5px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color="text.primary"
                  gutterBottom
                >
                  {formData.goal}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {state.plan.totalTasks} tasks •{' '}
                  {state.plan.estimatedTotalTime}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRegenerate}
                sx={{ fontWeight: 600, borderRadius: 2 }}
              >
                Regenerate Plan
              </Button>
            </Box>
          </Paper>
          {/* Task Cards */}
          <Grid container spacing={3}>
            {state.plan.tasks.map((task: Task, index: number) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    background: theme.palette.background.paper,
                    border: `1.5px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    boxShadow: '0 4px 24px 0 rgba(30,34,90,0.08)',
                    backdropFilter: 'blur(12px)',
                    height: '100%',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 8px 32px 0 rgba(30,34,90,0.12)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Task Header */}
                    <Box
                      sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={task.completed}
                            onChange={() => handleTaskToggle(index)}
                            icon={<UncheckedIcon />}
                            checkedIcon={<CheckCircleIcon />}
                            sx={{
                              color: theme.palette.primary.main,
                              '&.Mui-checked': {
                                color: theme.palette.success.main,
                              },
                            }}
                          />
                        }
                        label=""
                        sx={{ mr: 1, mt: 0 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="text.primary"
                          sx={{
                            textDecoration: task.completed
                              ? 'line-through'
                              : 'none',
                            opacity: task.completed ? 0.6 : 1,
                          }}
                        >
                          {task.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1, mb: 2 }}
                        >
                          {task.description}
                        </Typography>
                      </Box>
                    </Box>
                    {/* Task Details */}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<ScheduleIcon />}
                        label={task.estimatedTime}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                      <Chip
                        icon={<FlagIcon />}
                        label={task.priority}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(task.priority),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    {/* Subtasks */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <Accordion
                        sx={{
                          boxShadow: 'none',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          '&:before': { display: 'none' },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ minHeight: 40 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <ListIcon
                              sx={{ fontSize: 16, color: 'text.secondary' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Subtasks ({task.subtasks.length})
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1,
                            }}
                          >
                            {task.subtasks.map((subtask) => (
                              <Box
                                key={subtask.id}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  pl: 2,
                                  py: 0.5,
                                  borderLeft: `2px solid ${theme.palette.divider}`,
                                }}
                              >
                                <Checkbox
                                  checked={subtask.completed}
                                  size="small"
                                  sx={{
                                    color: theme.palette.primary.main,
                                    '&.Mui-checked': {
                                      color: theme.palette.success.main,
                                    },
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    textDecoration: subtask.completed
                                      ? 'line-through'
                                      : 'none',
                                    opacity: subtask.completed ? 0.6 : 1,
                                  }}
                                >
                                  {subtask.title}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  )
}

export default TaskPlanner
