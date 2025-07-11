import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const TasksPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Task Management
      </Typography>
      <Paper sx={{ p: 3, minHeight: '60vh' }}>
        <Typography variant="body1">
          Task planning interface will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TasksPage; 