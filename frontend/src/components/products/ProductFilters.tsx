"use client";
import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  categories?: string[];
}

const DEFAULT_CATEGORIES = [
  'All Categories',
  'Fashion & Luxury',
  'Textiles',
  'Watches & Jewelry',
  'Furniture',
  'Cosmetics',
  'Electronics',
  'Other',
];

export default function ProductFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  categories = DEFAULT_CATEGORIES,
}: ProductFiltersProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid #e2e8f0',
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flex: 1, minWidth: 280 }}>
        {/* Full-text Search Input */}
        <TextField
          size="small"
          placeholder="Search by name, SKU, or serial number..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ minWidth: { xs: '100%', sm: 300 }, flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearchChange('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        {/* Category Dropdown */}
        <TextField
          select
          size="small"
          label="Category"
          value={category || 'All Categories'}
          onChange={(e) => {
            const val = e.target.value;
            onCategoryChange(val === 'All Categories' ? '' : val);
          }}
          sx={{ minWidth: 180 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Status Toggle Group */}
      <ToggleButtonGroup
        size="small"
        value={status || 'ALL'}
        exclusive
        onChange={(_, val) => {
          if (val !== null) {
            onStatusChange(val === 'ALL' ? '' : val);
          }
        }}
        sx={{
          bgcolor: '#f8fafc',
          '& .MuiToggleButton-root': {
            px: 2,
            py: 0.6,
            fontSize: '0.8125rem',
            fontWeight: 600,
            textTransform: 'none',
          },
        }}
      >
        <ToggleButton value="ALL">All</ToggleButton>
        <ToggleButton value="PUBLISHED">Published</ToggleButton>
        <ToggleButton value="DRAFT">Draft</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
