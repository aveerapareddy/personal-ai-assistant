import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const STORAGE_KEY = 'openai_api_key'

interface ApiKeyDialogProps {
  open: boolean
  onClose: () => void
  onSave: (key: string) => void
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem(STORAGE_KEY)
      setApiKey(stored || '')
    }
  }, [open])

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, apiKey)
    onSave(apiKey)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Enter OpenAI API Key</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Paste your OpenAI API key below. It will be stored only in your
          browser and sent with each request.
        </Typography>
        <TextField
          label="OpenAI API Key"
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          fullWidth
          autoFocus
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowKey((v) => !v)} edge="end">
                  {showKey ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!apiKey.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ApiKeyDialog
export { STORAGE_KEY as API_KEY_STORAGE_KEY }
