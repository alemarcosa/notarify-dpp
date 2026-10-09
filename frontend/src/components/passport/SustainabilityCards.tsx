import { Grid, Box, Typography } from '@mui/material';
import { Public, WaterDrop, Recycling, Build } from '@mui/icons-material';

export default function SustainabilityCards({ data }: any) {
  if (!data) return null;
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>Sustainability Impact</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Box p={3} bgcolor="white" borderRadius={3} boxShadow={1} textAlign="center">
            <Public color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">{data.carbonFootprint}kg</Typography>
            <Typography variant="caption" color="text.secondary">CO₂ Footprint</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box p={3} bgcolor="white" borderRadius={3} boxShadow={1} textAlign="center">
            <WaterDrop color="info" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">{data.waterConsumption}L</Typography>
            <Typography variant="caption" color="text.secondary">Water Used</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box p={3} bgcolor="white" borderRadius={3} boxShadow={1} textAlign="center">
            <Recycling color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">{data.recycledMaterialPercentage}%</Typography>
            <Typography variant="caption" color="text.secondary">Recycled</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box p={3} bgcolor="white" borderRadius={3} boxShadow={1} textAlign="center">
            <Build color="warning" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">{data.repairabilityScore}/10</Typography>
            <Typography variant="caption" color="text.secondary">Repairability</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
