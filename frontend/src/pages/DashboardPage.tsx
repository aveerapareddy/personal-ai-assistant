import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 3, minHeight: '60vh' }}>
        <Typography variant="body1">
          Dashboard analytics will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DashboardPage; 