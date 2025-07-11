import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const AnalysisPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Data Analysis
      </Typography>
      <Paper sx={{ p: 3, minHeight: '60vh' }}>
        <Typography variant="body1">
          CSV analysis interface will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AnalysisPage; 