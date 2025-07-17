import React from 'react'
import { Typography, Paper, Box } from '@mui/material'

const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 3,
          pb: 2,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Typography variant="h4">Dashboard</Typography>
      </Box>
      <Paper sx={{ p: 3, minHeight: '60vh' }}>
        <Typography variant="body1">
          Dashboard analytics will be implemented here.
        </Typography>
      </Paper>
    </Box>
  )
}

export default DashboardPage
