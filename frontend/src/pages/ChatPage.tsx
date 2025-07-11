import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const ChatPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Chat Assistant
      </Typography>
      <Paper sx={{ p: 3, minHeight: '60vh' }}>
        <Typography variant="body1">
          Chat interface will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatPage; 