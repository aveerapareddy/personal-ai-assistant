import { createTheme } from '@mui/material/styles'

const baseTheme = {
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          background: 'inherit', // Use theme.palette.background.paper in components
          backdropFilter: 'blur(18px)',
          boxShadow: '0 8px 32px 0 rgba(30,34,90,0.10)',
          border: 'inherit', // Use theme.palette.divider
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          background: 'inherit', // Use theme.palette.background.paper in components
          backdropFilter: 'blur(18px)',
          boxShadow: '0 8px 32px 0 rgba(30,34,90,0.10)',
          border: 'inherit', // Use theme.palette.divider
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        } as any,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          background: 'inherit', // Use theme.palette.background.paper
          color: 'inherit', // Use theme.palette.text.primary
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'inherit', // Use theme.palette.background.paper
          color: 'inherit', // Use theme.palette.text.primary
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'inherit', // Use theme.palette.text.secondary
        },
      },
    },
  },
}

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    background: {
      default: '#f7f8fa',
      paper:
        'linear-gradient(135deg, rgba(255,255,255,0.85) 60%, rgba(245,245,255,0.7) 100%)',
    },
    text: {
      primary: '#222',
      secondary: '#888',
    },
    divider: '#e5e7eb',
    primary: { main: '#222' },
    secondary: { main: '#888' },
  },
})

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    background: {
      default: '#181a1b',
      paper: 'rgba(36, 37, 50, 0.65)',
    },
    text: {
      primary: '#f7f8fa',
      secondary: '#b0b4ba',
    },
    divider: '#23272e',
    primary: { main: '#f7f8fa' },
    secondary: { main: '#b0b4ba' },
  },
})
