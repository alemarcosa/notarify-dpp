"use client";
import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface ScanChartProps {
  data?: { date: string; scans: number }[];
  height?: number;
}

export default function ScanChart({ data = [], height = 320 }: ScanChartProps) {
  if (!data || data.length === 0) {
    return (
      <Box height={height} display="flex" alignItems="center" justifyContent="center">
        <Typography variant="body2" color="text.secondary">
          No scan data recorded yet.
        </Typography>
      </Box>
    );
  }

  // Format short date for axis
  const formattedData = data.map((d) => ({
    ...d,
    formattedDate: d.date ? d.date.slice(5) : '', // 'MM-DD'
  }));

  return (
    <Box height={height} width="100%">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1a365d" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#1a365d" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="formattedDate"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: 8,
              border: 'none',
              color: 'white',
              fontSize: 13,
            }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(val: any) => [`${val} scans`, 'Scans']}
          />
          <Area
            type="monotone"
            dataKey="scans"
            stroke="#1a365d"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#scanGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
