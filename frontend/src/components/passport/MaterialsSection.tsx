import { Box, Typography, LinearProgress } from '@mui/material';

export default function MaterialsSection({ materials = [] }: any) {
  if (!materials.length) return null;
  return (
    <Box p={4} bgcolor="white" borderRadius={3} boxShadow={1}>
      <Typography variant="h5" fontWeight="bold" mb={3}>Materials</Typography>
      {materials.map((m: any, i: number) => (
        <Box key={i} mb={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">{m.name} ({m.origin})</Typography>
            <Typography variant="body2" fontWeight="bold">{m.percentage}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={m.percentage} sx={{ height: 8, borderRadius: 4 }} />
        </Box>
      ))}
    </Box>
  );
}
