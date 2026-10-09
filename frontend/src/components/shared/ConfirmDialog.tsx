import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  content?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'error' | 'primary' | 'warning' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = 'Confirm Action',
  message,
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'error',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>{title}</DialogTitle>
      <DialogContent>
        {message ? (
          <DialogContentText color="text.secondary">{message}</DialogContentText>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onCancel} color="inherit">
          {cancelText}
        </Button>
        <Button variant="contained" color={confirmColor} onClick={onConfirm} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
