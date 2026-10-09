"use client";
import React, { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import ProductTable from '@/components/products/ProductTable';
import ProductFilters from '@/components/products/ProductFilters';

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');

  return (
    <Box>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Products Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your product inventory, materials, sustainability passports and QR codes.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/products/new')}
          sx={{ borderRadius: 2, px: 2.5, fontWeight: 600 }}
        >
          New Product
        </Button>
      </Box>

      {/* Filter Toolbar */}
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        category={category}
        onCategoryChange={setCategory}
      />

      {/* Server-paginated Data Table */}
      <ProductTable
        searchQuery={search}
        statusFilter={status}
        categoryFilter={category}
      />
    </Box>
  );
}
