"use client";
import React, { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { api } from '@/lib/api';
import { useSnackbar } from 'notistack';

interface FileDropzoneProps {
  label?: string;
  accept?: Record<string, string[]>;
  currentFileId?: string;
  currentFileName?: string;
  onUploaded?: (fileRecord: { id: string; originalName: string; mimeType: string }) => void;
  onRemove?: () => void;
}

export default function FileDropzone({
  label = 'Drag & drop file here, or click to browse',
  accept,
  currentFileId,
  currentFileName,
  onUploaded,
  onRemove,
}: FileDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedName, setUploadedName] = useState(currentFileName || '');
  const { enqueueSnackbar } = useSnackbar();

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const res = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fileData = res.data;
      setUploadedName(file.name);
      enqueueSnackbar(`Uploaded ${file.name}`, { variant: 'success' });
      if (onUploaded) {
        onUploaded(fileData);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to upload file';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    disabled: isUploading,
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedName('');
    if (onRemove) onRemove();
  };

  if (uploadedName || currentFileId) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          border: '1px solid #cbd5e1',
          bgcolor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ overflow: 'hidden' }}>
          <CheckIcon color="success" fontSize="small" />
          <FileIcon color="action" fontSize="small" />
          <Typography variant="body2" fontWeight={600} noWrap>
            {uploadedName || 'Uploaded File'}
          </Typography>
          <Chip label="Ready" size="small" color="success" variant="outlined" />
        </Stack>
        <IconButton size="small" color="error" onClick={handleClear}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : '#cbd5e1',
        bgcolor: isDragActive ? '#eff6ff' : '#f8fafc',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: '#f1f5f9',
        },
      }}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary">
            Uploading document to server...
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={1} alignItems="center">
          <CloudUploadIcon sx={{ fontSize: 36, color: 'primary.main', opacity: 0.8 }} />
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Supports PDF, PNG, JPG up to 10MB
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
