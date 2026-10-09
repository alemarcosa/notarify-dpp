"use client";
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Button,
  IconButton,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  MenuBook as ManualIcon,
  VerifiedUser as WarrantyIcon,
  Description as DatasheetIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import FileDropzone from '@/components/shared/FileDropzone';

interface ProductDoc {
  id?: string;
  title: string;
  type: 'USER_MANUAL' | 'WARRANTY' | 'TECHNICAL_DATASHEET' | 'OTHER';
  fileId?: string;
  fileName?: string;
}

const DOCUMENT_TYPES = [
  { value: 'USER_MANUAL', label: 'User Manual', icon: <ManualIcon fontSize="small" /> },
  { value: 'WARRANTY', label: 'Warranty Agreement', icon: <WarrantyIcon fontSize="small" /> },
  { value: 'TECHNICAL_DATASHEET', label: 'Technical Datasheet', icon: <DatasheetIcon fontSize="small" /> },
  { value: 'OTHER', label: 'Other Document', icon: <DatasheetIcon fontSize="small" /> },
];

export default function DocumentsTab({
  data = [],
  onChange,
}: {
  data: ProductDoc[];
  onChange: (updated: ProductDoc[]) => void;
}) {
  const addDocument = () => {
    onChange([
      ...data,
      {
        title: 'New Document',
        type: 'USER_MANUAL',
      },
    ]);
  };

  const updateDoc = (index: number, updates: Partial<ProductDoc>) => {
    const next = [...data];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const removeDoc = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Upload official PDF documents (User Manual, Warranty, Datasheet) accessible on the passport page.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={addDocument}
          sx={{ borderRadius: 2 }}
        >
          Add Document
        </Button>
      </Box>

      <Grid container spacing={3}>
        {data.map((doc, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Document #{idx + 1}
                  </Typography>
                  <IconButton size="small" color="error" onClick={() => removeDoc(idx)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Document Title"
                    value={doc.title}
                    onChange={(e) => updateDoc(idx, { title: e.target.value })}
                  />

                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Document Type"
                    value={doc.type || 'USER_MANUAL'}
                    onChange={(e) => updateDoc(idx, { type: e.target.value as any })}
                  >
                    {DOCUMENT_TYPES.map((t) => (
                      <MenuItem key={t.value} value={t.value}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {t.icon}
                          {t.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>

                  <FileDropzone
                    label={`Upload ${doc.title || 'PDF File'}`}
                    accept={{ 'application/pdf': ['.pdf'] }}
                    currentFileId={doc.fileId}
                    currentFileName={doc.fileName}
                    onUploaded={(fileRecord) => {
                      updateDoc(idx, {
                        fileId: fileRecord.id,
                        fileName: fileRecord.originalName,
                      });
                    }}
                    onRemove={() => {
                      updateDoc(idx, { fileId: undefined, fileName: undefined });
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {data.length === 0 && (
          <Grid item xs={12}>
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                border: '1px dashed #cbd5e1',
                borderRadius: 2,
                bgcolor: '#f8fafc',
              }}
            >
              <Typography variant="body2" color="text.secondary" mb={2}>
                No documents added yet. Add a User Manual, Warranty, or Technical Datasheet.
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={addDocument}
              >
                Add Document
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
