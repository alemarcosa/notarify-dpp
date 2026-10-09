"use client";
import { Box, Typography, Grid, Card, CircularProgress } from '@mui/material';
import { useDashboard } from '@/hooks/useAnalytics';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Inventory as InventoryIcon,
  CheckCircle as PublishedIcon,
  QrCode as QrCodeIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>Dashboard</Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Products" value={data.totalProducts} icon={<InventoryIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Published" value={data.publishedProducts} icon={<PublishedIcon />} color="success.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="QR Codes" value={data.qrCodesGenerated} icon={<QrCodeIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Views" value={data.totalViews} icon={<VisibilityIcon />} color="primary.main" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" mb={2}>Scans Trend (Last 7 Days)</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.scansTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="scans" stroke="#1a365d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentActivity scans={data.recentScans} />
        </Grid>
      </Grid>
    </Box>
  );
}
