import { Card, Box, Typography } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export default function StatCard({ title, value, icon, color = 'text.secondary' }: StatCardProps) {
  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>{title}</Typography>
          <Typography variant="h4" fontWeight="bold">{value}</Typography>
        </Box>
        <Box sx={{ color, opacity: 0.8, '& > svg': { fontSize: 40 } }}>
          {icon}
        </Box>
      </Box>
    </Card>
  );
}
