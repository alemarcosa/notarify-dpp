"use client";
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Launch as LaunchIcon,
  Download as DownloadIcon,
  QrCode2 as QrCodeIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { format } from 'date-fns';

export default function PassportsPage() {
  const [selectedQr, setSelectedQr] = useState<{ uuid: string; name: string } | null>(null);

  const { data: passports, isLoading } = useQuery({
    queryKey: ['passports'],
    queryFn: async () => {
      const { data } = await api.get('/passports');
      return data;
    },
  });

  const handleDownloadQr = (uuid: string, productName: string) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const link = document.createElement('a');
    link.href = `${apiBase}/api/files/qrcode/${uuid}`;
    link.download = `QR-${productName.replace(/[^a-zA-Z0-9]/g, '_')}-${uuid.slice(0, 8)}.png`;
    link.target = '_blank';
    link.click();
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Product Passports Directory
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track active digital passports, generated QR codes, and consumer scan metrics.
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {isLoading ? (
          <Box p={6} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Passport UUID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Version</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Scans</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Published At</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {passports?.map((p: any) => (
                <TableRow key={p.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{p.product?.name}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{p.product?.sku}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                    {p.passportUuid}
                  </TableCell>
                  <TableCell>
                    <Chip label={`v${p.version}.0`} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{p._count?.scanEvents || 0}</TableCell>
                  <TableCell>
                    <Chip
                      icon={<ActiveIcon sx={{ fontSize: 14 }} />}
                      label={p.status}
                      size="small"
                      color={p.status === 'ACTIVE' ? 'success' : 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                    {p.publishedAt ? format(new Date(p.publishedAt), 'MMM dd, yyyy') : '—'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View QR Code">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => setSelectedQr({ uuid: p.passportUuid, name: p.product?.name })}
                      >
                        <QrCodeIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Open Public Passport">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => window.open(`/passport/${p.passportUuid}`, '_blank')}
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Download QR Code">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleDownloadQr(p.passportUuid, p.product?.name)}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {(!passports || passports.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No published passports found. Go to Products and publish a product to generate a passport.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* QR Modal */}
      <Dialog open={Boolean(selectedQr)} onClose={() => setSelectedQr(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            Product Passport QR
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedQr?.name}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
          {selectedQr && (
            <Box
              component="img"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                typeof window !== 'undefined'
                  ? `${window.location.origin}/passport/${selectedQr.uuid}`
                  : `http://localhost:3000/passport/${selectedQr.uuid}`,
              )}`}
              alt="QR Code"
              sx={{ width: 220, height: 220, borderRadius: 2, border: '1px solid #e2e8f0', p: 1 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSelectedQr(null)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => {
              if (selectedQr) handleDownloadQr(selectedQr.uuid, selectedQr.name);
            }}
          >
            Download QR
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
