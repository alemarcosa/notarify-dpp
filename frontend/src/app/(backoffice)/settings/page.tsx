"use client";
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Business as BusinessIcon,
  QrCode as QrCodeIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

export default function SettingsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState({
    companyName: 'Notarify Demonstration Brand',
    brandTagline: 'Pioneering Transparency with Digital Product Passports',
    primaryColor: '#1a365d',
    supportEmail: 'compliance@notarify.io',
    autoPublishQr: true,
    requireVerificationBadge: true,
    cacheTtlSeconds: 300,
  });

  const handleSave = () => {
    enqueueSnackbar('Configuration settings saved successfully', { variant: 'success' });
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Platform Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure branding parameters, QR Code generation defaults, and compliance policies.
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Company & Brand Settings */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <BusinessIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Brand Profile & Public Identity
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Company / Brand Name"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Support & Compliance Email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Brand Tagline / Mission Statement"
                  value={settings.brandTagline}
                  onChange={(e) => setSettings({ ...settings, brandTagline: e.target.value })}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* QR Code & Passport Generation Rules */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <QrCodeIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                QR Code & Passport Automation
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoPublishQr}
                    onChange={(e) => setSettings({ ...settings, autoPublishQr: e.target.checked })}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Automated QR Code Generation
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Automatically generate high-resolution QR PNGs when a product is published.
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.requireVerificationBadge}
                    onChange={(e) =>
                      setSettings({ ...settings, requireVerificationBadge: e.target.checked })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Display &quot;Verified Product&quot; Trust Badge
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Show cryptographic verification badge in public passport header.
                    </Typography>
                  </Box>
                }
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Security & System Status */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <SecurityIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Environment & System Health
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Database Engine
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  PostgreSQL 16 (Prisma ORM)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Cache Layer
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Redis 7 (Active)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Storage Protocol
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Local Storage Volume (/app/uploads)
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Save Configuration
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
