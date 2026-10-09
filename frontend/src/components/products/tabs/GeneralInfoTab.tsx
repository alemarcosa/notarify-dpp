"use client";
import React from 'react';
import { Grid, TextField, MenuItem, Typography, Box } from '@mui/material';

const CATEGORIES = [
  'Fashion & Luxury',
  'Textiles',
  'Watches & Jewelry',
  'Furniture',
  'Cosmetics',
  'Electronics',
  'Food & Beverage',
  'Automotive',
  'Other',
];

const COUNTRIES = [
  'Italy',
  'France',
  'Germany',
  'Portugal',
  'Spain',
  'Switzerland',
  'Denmark',
  'United Kingdom',
  'United States',
  'Japan',
  'Sweden',
  'Other',
];

export default function GeneralInfoTab({
  data,
  onChange,
}: {
  data: any;
  onChange: (updates: any) => void;
}) {
  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
        Basic identifying attributes and production history for this product.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Product Name"
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Milano Artisan Handbag"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="SKU (Stock Keeping Unit)"
            value={data.sku || ''}
            onChange={(e) => handleChange('sku', e.target.value)}
            placeholder="e.g. LUX-MIL-001"
            helperText="Must be unique across the catalog"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Serial Number / Batch"
            value={data.serialNumber || ''}
            onChange={(e) => handleChange('serialNumber', e.target.value)}
            placeholder="e.g. SN-IT-2024-0098"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            required
            label="Category"
            value={data.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Production Date"
            InputLabelProps={{ shrink: true }}
            value={data.productionDate || ''}
            onChange={(e) => handleChange('productionDate', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Country of Origin"
            value={data.countryOfOrigin || data.origin || 'Italy'}
            onChange={(e) => {
              handleChange('countryOfOrigin', e.target.value);
              handleChange('origin', e.target.value);
            }}
          >
            {COUNTRIES.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Product Description"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Provide a comprehensive description of the product, manufacturing methods, and craftsmanship..."
          />
        </Grid>
      </Grid>
    </Box>
  );
}
