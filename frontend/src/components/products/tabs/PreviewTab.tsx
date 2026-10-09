"use client";
import React from 'react';
import {
  Box,
  Typography,
  Alert,
  Card,
  Grid,
  Chip,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  VerifiedUser as VerifiedIcon,
  Shield as ShieldIcon,
  Public as EarthIcon,
  WaterDrop as WaterIcon,
  Recycling as RecycleIcon,
  Build as BuildIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

export default function PreviewTab({ data }: { data: any }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const coverUrl = data.coverImage?.id
    ? `${apiBase}/api/files/${data.coverImage.id}`
    : data.coverImageId
    ? `${apiBase}/api/files/${data.coverImageId}`
    : null;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Live Passport Preview:</strong> This preview reflects how end-consumers will see the Digital Product Passport when scanning the QR Code.
      </Alert>

      <Box sx={{ border: '1px solid #cbd5e1', borderRadius: 3, overflow: 'hidden', bgcolor: '#f8fafc' }}>
        {/* Banner */}
        <Box sx={{ bgcolor: '#0f172a', color: 'white', py: 1.5, px: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <ShieldIcon sx={{ color: '#38bdf8', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={800} sx={{ letterSpacing: 1.5 }}>
                NOTARIFY
              </Typography>
            </Stack>
            <Chip
              icon={<VerifiedIcon sx={{ color: '#10b981 !important', fontSize: 16 }} />}
              label="Verified Authentic"
              size="small"
              sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 600, height: 24 }}
            />
          </Box>
        </Box>

        {/* Hero */}
        <Box sx={{ bgcolor: '#1e293b', color: 'white', p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            {coverUrl && (
              <Grid item xs={12} sm={3}>
                <Box
                  component="img"
                  src={coverUrl}
                  alt={data.name || 'Cover'}
                  sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 2 }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={coverUrl ? 9 : 12}>
              <Chip
                label={data.category || 'Category'}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#cbd5e1', mb: 1, height: 22 }}
              />
              <Typography variant="h5" fontWeight={700}>
                {data.name || 'Product Name Preview'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                SKU: {data.sku || 'N/A'} {data.serialNumber ? `| S/N: ${data.serialNumber}` : ''} | Origin: {data.countryOfOrigin || data.origin || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Body content */}
        <Box p={3}>
          <Stack spacing={3}>
            {/* Overview */}
            <Card variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Product Description
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.description || 'No description provided.'}
              </Typography>
            </Card>

            {/* Materials */}
            {data.materials && data.materials.length > 0 && (
              <Card variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Materials ({data.materials.length})
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Material</TableCell>
                      <TableCell>Share</TableCell>
                      <TableCell>Origin</TableCell>
                      <TableCell>Recyclable</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.materials.map((m: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{m.name || 'Material'}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LinearProgress
                              variant="determinate"
                              value={Number(m.percentage) || 0}
                              sx={{ flex: 1, height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption" fontWeight={600}>
                              {m.percentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{m.countryOfOrigin || m.origin || 'N/A'}</TableCell>
                        <TableCell>{m.recyclable ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* Sustainability Cards */}
            {data.sustainability && (
              <Card variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Sustainability Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box p={2} bgcolor="#f0fdf4" borderRadius={2} textAlign="center">
                      <EarthIcon sx={{ color: '#16a34a' }} />
                      <Typography variant="h6" fontWeight={700} color="#15803d">
                        {data.sustainability.carbonFootprint ?? 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        kg CO₂ eq
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box p={2} bgcolor="#f0f9ff" borderRadius={2} textAlign="center">
                      <WaterIcon sx={{ color: '#0284c7' }} />
                      <Typography variant="h6" fontWeight={700} color="#0369a1">
                        {data.sustainability.waterConsumption ?? 0} L
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Water Usage
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box p={2} bgcolor="#fafaf9" borderRadius={2} textAlign="center">
                      <RecycleIcon sx={{ color: '#059669' }} />
                      <Typography variant="h6" fontWeight={700} color="#047857">
                        {data.sustainability.recycledMaterialPercentage ?? 0}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Recycled
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box p={2} bgcolor="#fffbeb" borderRadius={2} textAlign="center">
                      <BuildIcon sx={{ color: '#d97706' }} />
                      <Typography variant="h6" fontWeight={700} color="#b45309">
                        {data.sustainability.repairabilityScore ?? 5}/10
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Repairability
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
