import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Box,
  useTheme,
  Menu,
  MenuItem,
  Typography,
  Fade,
  Chip,
} from '@mui/material'
import {
  Chat as ChatIcon,
  Dashboard as DashboardIcon,
  Assessment as AnalysisIcon,
  ListAlt as TasksIcon,
  LightMode,
  DarkMode,
  Menu as MenuIcon,
  AccountCircle,
  Settings as SettingsIcon,
  SmartToy as AIIcon,
} from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  {
    label: 'Chat',
    icon: <ChatIcon />,
    path: '/',
    description: 'AI Conversations',
  },
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    description: 'Overview & Analytics',
  },
  {
    label: 'Analysis',
    icon: <AnalysisIcon />,
    path: '/analysis',
    description: 'Data Insights',
  },
  {
    label: 'Tasks',
    icon: <TasksIcon />,
    path: '/tasks',
    description: 'Task Management',
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
    description: 'Configuration',
  },
]

const expandedWidth = 280
const collapsedWidth = 80

interface SidebarProps {
  mode: 'light' | 'dark'
  setMode: (mode: 'light' | 'dark') => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  mode,
  setMode,
  collapsed,
  setCollapsed,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const isDark = mode === 'dark'

  const handleThemeToggle = () => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => setAnchorEl(null)

  return (
    <Drawer
      variant="permanent"
      open={!collapsed}
      sx={{
        width: collapsed ? collapsedWidth : expandedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? collapsedWidth : expandedWidth,
          boxSizing: 'border-box',
          background: isDark
            ? 'rgba(18, 18, 18, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRight: isDark
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 3,
          pb: 3,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1300,
          height: '100vh',
          overflow: 'hidden',
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          px: collapsed ? 0 : 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: collapsed ? 48 : 56,
              height: collapsed ? 48 : 56,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: collapsed ? 20 : 24,
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            <AIIcon />
          </Avatar>
          {!collapsed && (
            <Fade in={!collapsed}>
              <Chip
                label="AI"
                size="small"
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background:
                    'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 20,
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            </Fade>
          )}
        </Box>

        {!collapsed && (
          <Fade in={!collapsed}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  mb: 0.5,
                  letterSpacing: -0.5,
                  color: isDark ? '#ffffff' : '#1a1a1a',
                  fontSize: '1.25rem',
                }}
              >
                Personal AI
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: isDark ? '#b0b0b0' : '#666',
                  fontWeight: 500,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                Assistant
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>

      <Divider
        sx={{
          width: collapsed ? '60%' : '80%',
          mb: 3,
          opacity: isDark ? 0.2 : 0.3,
          borderColor: isDark
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
        }}
      />

      {/* Navigation */}
      <List sx={{ flex: 1, width: '100%', px: collapsed ? 1 : 2 }}>
        {NAV_ITEMS.map((item) => (
          <Tooltip
            key={item.label}
            title={collapsed ? item.label : ''}
            placement="right"
          >
            <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 52,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 2 : 3,
                  py: collapsed ? 1.5 : 1.25,
                  borderRadius: 3,
                  background:
                    location.pathname === item.path
                      ? isDark
                        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                      : 'transparent',
                  border:
                    location.pathname === item.path
                      ? isDark
                        ? '1px solid rgba(102, 126, 234, 0.3)'
                        : '1px solid rgba(102, 126, 234, 0.2)'
                      : '1px solid transparent',
                  '&:hover': {
                    background: isDark
                      ? 'rgba(102, 126, 234, 0.15)'
                      : 'rgba(102, 126, 234, 0.08)',
                    border: isDark
                      ? '1px solid rgba(102, 126, 234, 0.25)'
                      : '1px solid rgba(102, 126, 234, 0.15)',
                    transform: 'translateX(2px)',
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2.5,
                    justifyContent: 'center',
                    color:
                      location.pathname === item.path
                        ? '#667eea'
                        : isDark
                          ? '#b0b0b0'
                          : '#666',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <Box sx={{ flex: 1 }}>
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                      primaryTypographyProps={{
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        color:
                          location.pathname === item.path
                            ? isDark
                              ? '#ffffff'
                              : '#1a1a1a'
                            : isDark
                              ? '#e0e0e0'
                              : '#333',
                        fontSize: '0.95rem',
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.75rem',
                        color: isDark ? '#888' : '#888',
                        fontWeight: 400,
                      }}
                    />
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <Divider
        sx={{
          width: collapsed ? '60%' : '80%',
          mb: 3,
          opacity: isDark ? 0.2 : 0.3,
          borderColor: isDark
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
        }}
      />

      {/* Bottom Controls */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: collapsed ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: collapsed ? 1 : 1.5,
          px: collapsed ? 1 : 2,
        }}
      >
        <Tooltip
          title={
            mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
          }
          placement={collapsed ? 'right' : 'top'}
        >
          <IconButton
            onClick={handleThemeToggle}
            sx={{
              color: isDark ? '#b0b0b0' : '#666',
              '&:hover': {
                background: isDark
                  ? 'rgba(102, 126, 234, 0.2)'
                  : 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {mode === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Tooltip>

        <Tooltip title="User menu" placement={collapsed ? 'right' : 'top'}>
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              color: isDark ? '#b0b0b0' : '#666',
              '&:hover': {
                background: isDark
                  ? 'rgba(102, 126, 234, 0.2)'
                  : 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <AccountCircle />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: isDark
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(20px)',
              background: isDark
                ? 'rgba(30, 30, 30, 0.9)'
                : 'rgba(255, 255, 255, 0.9)',
              border: isDark
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <MenuItem onClick={handleMenuClose}>Profile (coming soon)</MenuItem>
          <MenuItem onClick={handleMenuClose}>Settings (coming soon)</MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout (coming soon)</MenuItem>
        </Menu>

        <Tooltip
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          placement={collapsed ? 'right' : 'top'}
        >
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            size="small"
            sx={{
              background: isDark
                ? 'rgba(102, 126, 234, 0.2)'
                : 'rgba(102, 126, 234, 0.1)',
              color: '#667eea',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                background: isDark
                  ? 'rgba(102, 126, 234, 0.3)'
                  : 'rgba(102, 126, 234, 0.2)',
                transform: 'scale(1.05)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  )
}

export default Sidebar
