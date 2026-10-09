import React from 'react';
import { Card, Typography, List, ListItem, ListItemText, Divider, Box, Chip } from '@mui/material';
import { ScanEvent } from '@/types/product';
import { formatDate } from '@/lib/utils';
import { QrCode as QrIcon } from '@mui/icons-material';

export default function RecentActivity({ scans }: { scans: ScanEvent[] }) {
  return (
    <Card sx={{ p: 3, height: '100%', overflow: 'auto', borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Recent Scan Activity
      </Typography>
      <List disablePadding>
        {scans?.map((scan, i) => (
          <Box key={scan.id || i}>
            <ListItem sx={{ px: 0, py: 1.5, display: 'flex', justifyContent: 'space-between' }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: '#eff6ff',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <QrIcon fontSize="small" />
                </Box>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={600}>
                      Scan #{scan.id ? scan.id.slice(0, 8) : 'Event'}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {scan.country || 'Global'} • {scan.scannedAt ? formatDate(scan.scannedAt) : 'Just now'}
                    </Typography>
                  }
                />
              </Box>
              <Chip
                label={scan.browser || 'Web'}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            </ListItem>
            {i < scans.length - 1 && <Divider />}
          </Box>
        ))}

        {(!scans || scans.length === 0) && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No recent activity logged yet.
          </Typography>
        )}
      </List>
    </Card>
  );
}
