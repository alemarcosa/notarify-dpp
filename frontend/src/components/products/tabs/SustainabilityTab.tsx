"use client";
import React from 'react';
import {
  Grid,
  TextField,
  Slider,
  Typography,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Box,
  Stack,
} from '@mui/material';
import {
  Co2 as Co2Icon,
  WaterDrop as WaterIcon,
  Recycling as RecycleIcon,
  Build as BuildIcon,
} from '@mui/icons-material';

export default function SustainabilityTab({
  data = {},
  onChange,
}: {
  data: any;
  onChange: (updated: any) => void;
}) {
  const update = (field: string, val: any) => {
    onChange({ ...data, [field]: val });
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
        Environmental performance metrics, recyclability attributes, and lifecycle durability indicators.
      </Typography>

      <Grid container spacing={3}>
        {/* Carbon Footprint */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <Box sx={{ color: 'primary.main', display: 'flex' }}>
                  <Co2Icon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Carbon Footprint
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total lifecycle GHG emissions (kg CO₂ eq)
                  </Typography>
                </Box>
              </Stack>
              <TextField
                fullWidth
                type="number"
                label="Emissions Value"
                value={data.carbonFootprint ?? ''}
                inputProps={{ step: '0.1', min: '0' }}
                onChange={(e) => update('carbonFootprint', e.target.value === '' ? null : Number(e.target.value))}
                helperText="Calculated from raw material extraction to factory gate"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Water Consumption */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <Box sx={{ color: '#0284c7', display: 'flex' }}>
                  <WaterIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Water Consumption
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total direct freshwater usage in liters
                  </Typography>
                </Box>
              </Stack>
              <TextField
                fullWidth
                type="number"
                label="Water Usage (Liters)"
                value={data.waterConsumption ?? ''}
                inputProps={{ step: '0.5', min: '0' }}
                onChange={(e) => update('waterConsumption', e.target.value === '' ? null : Number(e.target.value))}
                helperText="Includes industrial dyeing, washing and processing"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Recycled Material Percentage */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                <Box sx={{ color: '#16a34a', display: 'flex' }}>
                  <RecycleIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Recycled Content: {data.recycledMaterialPercentage ?? 0}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Post-consumer / post-industrial recycled input
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ px: 1, pt: 2 }}>
                <Slider
                  value={Number(data.recycledMaterialPercentage) || 0}
                  onChange={(_, val) => update('recycledMaterialPercentage', val)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Repairability Score */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                <Box sx={{ color: '#d97706', display: 'flex' }}>
                  <BuildIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Repairability Index: {data.repairabilityScore ?? 5} / 10
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    European repairability score protocol
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ px: 1, pt: 2 }}>
                <Slider
                  value={Number(data.repairabilityScore) || 5}
                  onChange={(_, val) => update('repairabilityScore', val)}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={10}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recyclability Switch */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: '#f8fafc' }}>
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(data.recyclable)}
                    onChange={(e) => update('recyclable', e.target.checked)}
                    color="success"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      End-of-Life Recyclable Design
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      This product can be disassembled into mono-material fractions for standard municipal or specialized industrial recycling.
                    </Typography>
                  </Box>
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
