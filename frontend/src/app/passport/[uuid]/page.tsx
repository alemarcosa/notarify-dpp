import React from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  LinearProgress,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import {
  VerifiedUser as VerifiedIcon,
  Shield as ShieldIcon,
  Public as EarthIcon,
  WaterDrop as WaterIcon,
  Recycling as RecycleIcon,
  Build as BuildIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckCircleIcon,
  QrCode as QrCodeIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

async function getPassportData(uuid: string) {
  const baseURL =
    process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const res = await axios.get(`${baseURL}/api/passport/${uuid}`, {
      headers: {
        'Accept': 'application/json',
      },
      timeout: 8000,
    });
    return res.data;
  } catch (e: any) {
    console.error('Failed to fetch passport:', e?.message || e);
    return null;
  }
}

export default async function PassportPage({ params }: { params: { uuid: string } }) {
  const data = await getPassportData(params.uuid);

  if (!data || !data.product) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 12 }}>
        <Container maxWidth="sm">
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom color="error.main">
              Product Passport Not Found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              The digital passport ID &quot;{params.uuid}&quot; does not exist or has been revoked by the manufacturer.
            </Typography>
            <Button variant="outlined" href="/login">
              Back to Notarify
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  const { product, passportUuid, version, status, createdAt, publishedAt } = data;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const coverUrl = product.coverImage?.id ? `${apiBase}/api/files/${product.coverImage.id}` : null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 12 }}>
      {/* Brand & Verification Top Banner */}
      <Box sx={{ bgcolor: '#0f172a', color: 'white', py: 2, borderBottom: '1px solid #1e293b' }}>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <ShieldIcon sx={{ color: '#38bdf8' }} />
              <Typography variant="subtitle1" fontWeight={800} sx={{ letterSpacing: 1.5 }}>
                NOTARIFY
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', pl: 1, borderLeft: '1px solid #334155' }}>
                Official Product Passport
              </Typography>
            </Stack>
            <Chip
              icon={<VerifiedIcon sx={{ color: '#10b981 !important' }} />}
              label="Verified Authentic"
              size="small"
              sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 600 }}
            />
          </Box>
        </Container>
      </Box>

      {/* Hero Header Section */}
      <Box sx={{ bgcolor: '#1e293b', color: 'white', pt: 6, pb: 10 }}>
        <Container maxWidth="md">
          <Grid container spacing={4} alignItems="center">
            {coverUrl && (
              <Grid item xs={12} sm={4}>
                <Box
                  component="img"
                  src={coverUrl}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    maxHeight: 260,
                    objectFit: 'cover',
                    borderRadius: 3,
                    border: '2px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={coverUrl ? 8 : 12}>
              <Chip
                label={product.category || 'Product'}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#cbd5e1', mb: 1.5, fontWeight: 600 }}
              />
              <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem' }, mb: 1 }}>
                {product.name}
              </Typography>

              <Stack direction="row" spacing={3} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    SKU
                  </Typography>
                  <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                    {product.sku}
                  </Typography>
                </Box>
                {product.serialNumber && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      SERIAL NUMBER
                    </Typography>
                    <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                      {product.serialNumber}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    ORIGIN
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {product.countryOfOrigin || product.origin || 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content Container (Overlapping Hero) */}
      <Container maxWidth="md" sx={{ mt: -6 }}>
        <Stack spacing={4}>
          {/* Section 1: Product Information */}
          <Card sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom color="text.primary">
              Product Overview
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
              {product.description || 'No detailed description provided by the manufacturer.'}
            </Typography>

            <Divider sx={{ my: 2.5 }} />

            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {product.category}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Production Date
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {product.productionDate ? format(new Date(product.productionDate), 'MMMM yyyy') : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Country of Origin
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {product.countryOfOrigin || product.origin || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Passport Status
                </Typography>
                <Typography variant="body2" fontWeight={600} color="success.main">
                  Active (v{version || 1})
                </Typography>
              </Grid>
            </Grid>
          </Card>

          {/* Section 2: Materials Breakdown Table */}
          {product.materials && product.materials.length > 0 && (
            <Card sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom color="text.primary">
                Material Composition
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Verified raw materials and mono-material fraction decomposition.
              </Typography>

              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Material</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Composition</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Origin</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Recyclability</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {product.materials.map((m: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ fontWeight: 500 }}>{m.name}</TableCell>
                      <TableCell sx={{ width: 180 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={Number(m.percentage) || 0}
                            sx={{ flex: 1, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="body2" fontWeight={600} width={40}>
                            {m.percentage}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{m.countryOfOrigin || m.origin || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={m.recyclable ? 'Recyclable' : 'Non-Recyclable'}
                          size="small"
                          color={m.recyclable ? 'success' : 'default'}
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Section 3: Sustainability Impact Cards */}
          {product.sustainability && (
            <Card sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom color="text.primary">
                Environmental & Sustainability Footprint
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Life cycle assessment indicators conforming to EU Digital Product Passport standards.
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      textAlign: 'center',
                    }}
                  >
                    <EarthIcon sx={{ color: '#16a34a', fontSize: 36, mb: 1 }} />
                    <Typography variant="h5" fontWeight={700} color="#15803d">
                      {product.sustainability.carbonFootprint ?? '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      kg CO₂ Equivalent
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      textAlign: 'center',
                    }}
                  >
                    <WaterIcon sx={{ color: '#0284c7', fontSize: 36, mb: 1 }} />
                    <Typography variant="h5" fontWeight={700} color="#0369a1">
                      {product.sustainability.waterConsumption ?? '—'} L
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Water Consumption
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: '#fafaf9',
                      border: '1px solid #e7e5e4',
                      textAlign: 'center',
                    }}
                  >
                    <RecycleIcon sx={{ color: '#059669', fontSize: 36, mb: 1 }} />
                    <Typography variant="h5" fontWeight={700} color="#047857">
                      {product.sustainability.recycledMaterialPercentage ?? 0}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Recycled Input
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: '#fffbeb',
                      border: '1px solid #fde68a',
                      textAlign: 'center',
                    }}
                  >
                    <BuildIcon sx={{ color: '#d97706', fontSize: 36, mb: 1 }} />
                    <Typography variant="h5" fontWeight={700} color="#b45309">
                      {product.sustainability.repairabilityScore ?? '—'} / 10
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Repairability Score
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          )}

          {/* Section 4: Certifications */}
          {product.certifications && product.certifications.length > 0 && (
            <Card sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom color="text.primary">
                Official Certifications & Accreditations
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Verified third-party compliance audits and sustainability certifications.
              </Typography>

              <Stack spacing={2}>
                {product.certifications.map((c: any, idx: number) => {
                  const docFileId = c.documentFileId || c.documentFile?.id;
                  const docUrl = docFileId ? `${apiBase}/api/files/${docFileId}` : null;

                  return (
                    <Box
                      key={idx}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        bgcolor: '#f8fafc',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircleIcon color="success" fontSize="small" />
                          <Typography variant="subtitle2" fontWeight={600}>
                            {c.name}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Issuing Authority: {c.issuingAuthority}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Issued: {c.issueDate ? format(new Date(c.issueDate), 'MMM yyyy') : 'N/A'}{' '}
                          {c.expirationDate ? `| Valid until: ${format(new Date(c.expirationDate), 'MMM yyyy')}` : ''}
                        </Typography>
                      </Box>

                      {docUrl && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          href={docUrl}
                          target="_blank"
                        >
                          Certificate PDF
                        </Button>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </Card>
          )}

          {/* Section 5: Documents (User Manual, Warranty, Datasheet) */}
          {product.documents && product.documents.length > 0 && (
            <Card sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom color="text.primary">
                Technical Documents & Warranties
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Official product literature and compliance documentation.
              </Typography>

              <Grid container spacing={2}>
                {product.documents.map((doc: any, idx: number) => {
                  const fileId = doc.fileId || doc.file?.id;
                  const fileUrl = fileId ? `${apiBase}/api/files/${fileId}` : '#';

                  return (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid #e2e8f0',
                          bgcolor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <PdfIcon color="error" />
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {doc.title || doc.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {String(doc.type || 'DOCUMENT').replace('_', ' ')}
                            </Typography>
                          </Box>
                        </Stack>
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<DownloadIcon />}
                          href={fileUrl}
                          target="_blank"
                          disabled={!fileId}
                        >
                          Download
                        </Button>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Card>
          )}

          {/* Section 6: Passport Metadata */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: '#0f172a',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} color="#94a3b8" gutterBottom>
              PASSPORT AUDIT TRAIL & VERIFICATION METADATA
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="#64748b">
                  Passport ID (UUID)
                </Typography>
                <Typography variant="body2" fontFamily="monospace" color="#e2e8f0">
                  {passportUuid}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="#64748b">
                  Passport Version
                </Typography>
                <Typography variant="body2" fontWeight={600} color="#e2e8f0">
                  Version {version || 1}.0
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="#64748b">
                  Verification Status
                </Typography>
                <Typography variant="body2" fontWeight={600} color="#34d399">
                  {status || 'ACTIVE'} (Notarified)
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
