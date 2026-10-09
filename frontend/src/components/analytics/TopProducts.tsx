"use client";
import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Launch as LaunchIcon } from '@mui/icons-material';

interface TopProductItem {
  id: string;
  name: string;
  sku: string;
  category?: string;
  views: number;
  passportUuid?: string;
}

export default function TopProducts({ products = [] }: { products?: TopProductItem[] }) {
  if (!products || products.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          No product views recorded yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Table size="small">
      <TableHead sx={{ bgcolor: '#f8fafc' }}>
        <TableRow>
          <TableCell sx={{ fontWeight: 600, width: 40 }}>#</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
          <TableCell sx={{ fontWeight: 600 }} align="right">
            Total Scans
          </TableCell>
          <TableCell sx={{ fontWeight: 600, width: 60 }} align="center">
            Link
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((p, idx) => (
          <TableRow key={p.id || idx} hover>
            <TableCell sx={{ fontWeight: 700, color: idx < 3 ? 'primary.main' : 'text.secondary' }}>
              {idx + 1}
            </TableCell>
            <TableCell>
              <Typography variant="body2" fontWeight={600}>
                {p.name}
              </Typography>
              {p.category && (
                <Typography variant="caption" color="text.secondary">
                  {p.category}
                </Typography>
              )}
            </TableCell>
            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.sku}</TableCell>
            <TableCell align="right">
              <Chip
                label={`${p.views} scans`}
                size="small"
                color={idx === 0 ? 'primary' : 'default'}
                sx={{ fontWeight: 600 }}
              />
            </TableCell>
            <TableCell align="center">
              {p.passportUuid && (
                <Tooltip title="Open Public Passport">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => window.open(`/passport/${p.passportUuid}`, '_blank')}
                  >
                    <LaunchIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
