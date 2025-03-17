import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';

export const PasscodeDialog = ({ open, onVerify, correctPasscode }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  
  const handleVerify = () => {
    if (passcode === correctPasscode) {
      onVerify(true);
      setError('');
    } else {
      setError('Invalid passcode. Please try again.');
      setPasscode('');
    }
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Enter Passcode</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please enter your 4-digit passcode to continue
          </Typography>
          <TextField
            autoFocus
            fullWidth
            type="password"
            value={passcode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 4);
              setPasscode(value);
            }}
            inputProps={{
              maxLength: 4,
              pattern: '[0-9]*',
            }}
            placeholder="Enter 4-digit passcode"
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleVerify}
            disabled={passcode.length !== 4}
          >
            Verify
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
