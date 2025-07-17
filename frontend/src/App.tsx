import React, { useMemo, useState } from 'react'
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material'
import { Routes, Route, useLocation } from 'react-router-dom'
import { lightTheme, darkTheme } from './theme'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/DashboardPage'
import AnalysisPage from './pages/AnalysisPage'
import TasksPage from './pages/TasksPage'
import SettingsPage from './pages/SettingsPage'

const expandedWidth = 240
const collapsedWidth = 80

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )
  const theme = useMemo(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode]
  )
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  // Map path to page title
  const pageTitles: Record<string, string> = {
    '/': 'AI Chat Assistant',
    '/dashboard': 'Dashboard',
    '/analysis': 'Analysis',
    '/tasks': 'Tasks',
    '/settings': 'Settings',
  }
  const pageTitle = pageTitles[location.pathname] || ''

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Sidebar
        mode={mode}
        setMode={setMode}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          minWidth: 0,
          ml: sidebarCollapsed ? `${collapsedWidth}px` : `${expandedWidth}px`,
          transition: 'margin-left 0.2s cubic-bezier(.4,2,.6,1)',
        }}
      >
        <Container
          component="main"
          maxWidth={false}
          sx={{
            flexGrow: 1,
            py: 3,
            minHeight: '100vh',
            background: theme.palette.background.default,
          }}
        >
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
