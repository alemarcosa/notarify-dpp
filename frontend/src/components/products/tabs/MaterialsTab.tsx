"use client";
import React from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  LinearProgress,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

interface MaterialItem {
  id?: string;
  name: string;
  percentage: number;
  countryOfOrigin?: string;
  recyclable: boolean;
}

export default function MaterialsTab({
  data = [],
  onChange,
}: {
  data: MaterialItem[];
  onChange: (updated: MaterialItem[]) => void;
}) {
  const addMaterial = () => {
    onChange([
      ...data,
      {
        name: '',
        percentage: 0,
        countryOfOrigin: 'Italy',
        recyclable: true,
      },
    ]);
  };

  const updateMaterial = (idx: number, field: keyof MaterialItem, val: any) => {
    const next = [...data];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };

  const removeMaterial = (idx: number) => {
    onChange(data.filter((_, i) => i !== idx));
  };

  const totalPercentage = data.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Breakdown of raw materials, components and their recyclable status.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={addMaterial}
          sx={{ borderRadius: 2 }}
        >
          Add Material
        </Button>
      </Box>

      {/* Percentage summary bar */}
      <Box sx={{ mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" fontWeight={600}>
            Total Composition: {totalPercentage}%
          </Typography>
          <Typography
            variant="caption"
            fontWeight={600}
            color={totalPercentage === 100 ? 'success.main' : totalPercentage > 100 ? 'error.main' : 'warning.main'}
          >
            {totalPercentage === 100
              ? 'Complete (100%)'
              : totalPercentage > 100
              ? `Exceeds 100% by ${totalPercentage - 100}%`
              : `${100 - totalPercentage}% remaining`}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={Math.min(totalPercentage, 100)}
          color={totalPercentage === 100 ? 'success' : totalPercentage > 100 ? 'error' : 'primary'}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {data.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No materials registered yet. Click &quot;Add Material&quot; to specify product composition.
        </Alert>
      ) : (
        <Paper variant="outlined" sx={{ overflow: 'hidden', mb: 2 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Material Name</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 140 }}>Percentage (%)</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 180 }}>Origin</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 140 }}>Recyclable</TableCell>
                <TableCell sx={{ width: 60 }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="e.g. Organic Cotton"
                      value={item.name}
                      onChange={(e) => updateMaterial(idx, 'name', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={item.percentage}
                      inputProps={{ min: 0, max: 100, step: 1 }}
                      onChange={(e) => updateMaterial(idx, 'percentage', Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      placeholder="e.g. Italy"
                      value={item.countryOfOrigin || ''}
                      onChange={(e) => updateMaterial(idx, 'countryOfOrigin', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={item.recyclable}
                          onChange={(e) => updateMaterial(idx, 'recyclable', e.target.checked)}
                        />
                      }
                      label={item.recyclable ? 'Yes' : 'No'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="error" onClick={() => removeMaterial(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
