"use client";
import React from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Verified as VerifiedIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';

interface CertificationItem {
  id?: string;
  name: string;
  issuingAuthority: string;
  issueDate: string;
  expirationDate?: string | null;
  documentFileId?: string;
  documentFileName?: string;
}

export default function CertificationsTab({
  data = [],
  onChange,
}: {
  data: CertificationItem[];
  onChange: (updated: CertificationItem[]) => void;
}) {
  const addCertification = () => {
    onChange([
      ...data,
      {
        name: '',
        issuingAuthority: '',
        issueDate: new Date().toISOString().split('T')[0],
        expirationDate: '',
      },
    ]);
  };

  const update = (idx: number, field: keyof CertificationItem, val: any) => {
    const next = [...data];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };

  const remove = (idx: number) => {
    onChange(data.filter((_, i) => i !== idx));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Official compliance standards, third-party audits, and environmental quality labels.
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={addCertification}
          sx={{ borderRadius: 2 }}
        >
          Add Certification
        </Button>
      </Box>

      {data.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No certifications attached to this product yet. Click &quot;Add Certification&quot; to include regulatory documents.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {data.map((cert, idx) => (
            <Card key={idx} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent sx={{ pb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VerifiedIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight={600}>
                      {cert.name || `Certification #${idx + 1}`}
                    </Typography>
                  </Stack>
                  <IconButton size="small" color="error" onClick={() => remove(idx)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Certification Name"
                      placeholder="e.g. OEKO-TEX Standard 100"
                      value={cert.name}
                      onChange={(e) => update(idx, 'name', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Issuing Authority"
                      placeholder="e.g. International Textile Institute"
                      value={cert.issuingAuthority}
                      onChange={(e) => update(idx, 'issuingAuthority', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="Issue Date"
                      InputLabelProps={{ shrink: true }}
                      value={cert.issueDate ? String(cert.issueDate).split('T')[0] : ''}
                      onChange={(e) => update(idx, 'issueDate', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="Expiration Date (Optional)"
                      InputLabelProps={{ shrink: true }}
                      value={cert.expirationDate ? String(cert.expirationDate).split('T')[0] : ''}
                      onChange={(e) => update(idx, 'expirationDate', e.target.value || null)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
