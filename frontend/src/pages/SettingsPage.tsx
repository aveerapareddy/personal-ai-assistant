import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  Divider,
  Paper,
} from '@mui/material'
import ApiKeyDialog from '../components/ApiKeyDialog'
import { chatAPI } from '../services/api'

const SettingsPage: React.FC = () => {
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isTesting, setIsTesting] = useState(false)
  const [testDetails, setTestDetails] = useState<any>(null)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const handleTestService = async () => {
    setIsTesting(true)
    setTestResult(null)
    setTestDetails(null)
    try {
      const result = await chatAPI.testService()
      setTestDetails(result)
      if (result.status === 'success') {
        setTestResult(`✅ AI test successful: ${result.model}`)
      } else {
        setTestResult(`❌ AI test failed: ${result.message || 'Unknown error'}`)
      }
    } catch (error: any) {
      setTestResult('❌ Test failed: ' + (error?.message || error))
      console.error('Test integration error:', error)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 8,
      }}
    >
      <Typography variant="h3" fontWeight={700} mb={4}>
        Settings
      </Typography>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 540,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          background: isDark
            ? 'rgba(30, 32, 38, 0.65)'
            : 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Test Integration Section */}
        <Box>
          <Typography variant="h5" fontWeight={600} mb={1}>
            Test Integration
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Test your AI backend integration and model availability.
          </Typography>
          <Box
            display="flex"
            justifyContent="flex-end"
            mb={testDetails ? 0 : 2}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleTestService}
              disabled={isTesting}
              startIcon={isTesting ? <CircularProgress size={16} /> : null}
              sx={{
                borderRadius: 2,
                boxShadow: 'none',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {isTesting ? 'Testing...' : 'Test Integration'}
            </Button>
          </Box>
          {testDetails && (
            <Box sx={{ mt: 2 }}>
              <Alert
                severity={
                  testDetails.status === 'success' ? 'success' : 'warning'
                }
                sx={{
                  mb: 2,
                  background: isDark
                    ? 'rgba(40, 60, 40, 0.85)'
                    : 'rgba(230, 255, 230, 0.85)',
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: isDark
                    ? '0 2px 8px rgba(0,0,0,0.25)'
                    : '0 2px 8px rgba(0,0,0,0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color="text.primary"
                >
                  {testDetails.message}
                </Typography>
                {testDetails.model && (
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 0.5 }}
                    color="text.secondary"
                  >
                    Model: {testDetails.model}
                  </Typography>
                )}
              </Alert>
              {testDetails.test_response && (
                <Box
                  sx={{
                    mt: 2,
                    background: isDark
                      ? 'rgba(30, 30, 30, 0.92)'
                      : 'rgba(255,255,255,0.92)',
                    color: theme.palette.text.primary,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: isDark
                      ? '0 2px 8px rgba(0,0,0,0.25)'
                      : '0 2px 8px rgba(0,0,0,0.08)',
                    backdropFilter: 'blur(8px)',
                    p: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    mb={1}
                    color="text.primary"
                  >
                    Test Response:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      whiteSpace: 'pre-wrap',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {testDetails.test_response}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
        <Divider sx={{ my: 4 }} />
        {/* API Key Section */}
        <Box>
          <Typography variant="h5" fontWeight={600} mb={1}>
            OpenAI API Key
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Set or update your OpenAI API key. It is stored only in your
            browser.
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setApiKeyDialogOpen(true)}
              sx={{
                borderRadius: 2,
                boxShadow: 'none',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Set API Key
            </Button>
          </Box>
        </Box>
      </Paper>
      <ApiKeyDialog
        open={apiKeyDialogOpen}
        onClose={() => setApiKeyDialogOpen(false)}
        onSave={() => setTestResult('API key saved!')}
      />
      <Snackbar
        open={!!testResult}
        autoHideDuration={6000}
        onClose={() => setTestResult(null)}
        message={testResult}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}

export default SettingsPage
