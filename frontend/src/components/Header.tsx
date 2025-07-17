import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material'
import { LightMode, DarkMode, Menu as MenuIcon } from '@mui/icons-material'

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleThemeToggle = () => {
    // This function is no longer needed as mode and setMode are removed
    // setMode(mode === 'light' ? 'dark' : 'light')
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => setAnchorEl(null)

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 1px 8px 0 rgba(30,34,90,0.03)',
        borderBottom: '1px solid #ececec',
        zIndex: 1201,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: 64,
          px: { xs: 2, sm: 4 },
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#222',
              color: '#fff',
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            A
          </Avatar>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#222"
            sx={{ letterSpacing: 1 }}
          >
            Personal AI Assistant
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
