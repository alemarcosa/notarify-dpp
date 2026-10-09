"use client";
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Today as TodayIcon,
  DateRange as WeekIcon,
  CalendarMonth as MonthIcon,
  DeviceHub as DeviceIcon,
} from '@mui/icons-material';
import { useAnalytics } from '@/hooks/useAnalytics';
import StatCard from '@/components/dashboard/StatCard';
import ScanChart from '@/components/analytics/ScanChart';
import TopProducts from '@/components/analytics/TopProducts';
import { format } from 'date-fns';

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  if (isLoading || !data) {
    return (
      <Box p={6} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>
          QR Code Scan Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time consumer engagement metrics, geographic breakdown, and device telemetry.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Scans Today"
            value={data.scansToday || 0}
            icon={<TodayIcon />}
            color="#0284c7"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Weekly Scans (Last 7 Days)"
            value={data.scansThisWeek || 0}
            icon={<WeekIcon />}
            color="#16a34a"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Monthly Scans (This Month)"
            value={data.scansThisMonth || 0}
            icon={<MonthIcon />}
            color="#1a365d"
          />
        </Grid>
      </Grid>

      {/* Charts & Top Products */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>
              30-Day Consumer Scan Trend
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
              Daily volume of unique product passport consultations
            </Typography>
            <ScanChart data={data.dailyTrend} height={320} />
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>
              Most Viewed Products
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
              Top passports by cumulative scan events
            </Typography>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <TopProducts products={data.topProducts as any} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Latest Scans Audit Feed */}
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Latest Passport Scans
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Telemetry recorded at moment of scan: IP, Browser, OS, Language, and Country
            </Typography>
          </Box>
          <Chip
            icon={<DeviceIcon fontSize="small" />}
            label="Live Telemetry"
            size="small"
            color="success"
            variant="outlined"
          />
        </Box>

        <Table size="small">
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>IP Address</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Browser & OS</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Language</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Country</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.latestScans?.map((s: any) => (
              <TableRow key={s.id} hover>
                <TableCell sx={{ fontSize: '0.8125rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  {s.scannedAt ? format(new Date(s.scannedAt), 'yyyy-MM-dd HH:mm:ss') : '—'}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {s.passport?.product?.name || 'Passport ' + s.passportId.slice(0, 8)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {s.ipAddress || '127.0.0.1'}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="body2">{s.browser || 'Unknown'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({s.operatingSystem || 'OS'})
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                  {s.browserLanguage || 'en-US'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={s.country || 'Global'}
                    size="small"
                    sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                  />
                </TableCell>
              </TableRow>
            ))}

            {(!data.latestScans || data.latestScans.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No scan activity logged yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}
