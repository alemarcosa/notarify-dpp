"use client";
import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Chip,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode2 as QrCodeIcon,
  Launch as LaunchIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

interface ProductRow {
  id: string;
  name: string;
  sku: string;
  category: string;
  status: 'DRAFT' | 'PUBLISHED';
  coverImage?: { id: string; storagePath: string } | null;
  passport?: {
    id: string;
    passportUuid: string;
    status: string;
    version: number;
    qrCodePath?: string;
  } | null;
  totalViews?: number;
}

export default function ProductTable({
  statusFilter,
  categoryFilter,
  searchQuery,
}: {
  statusFilter?: string;
  categoryFilter?: string;
  searchQuery?: string;
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedQr, setSelectedQr] = useState<{ uuid: string; name: string } | null>(null);

  const { data, isLoading } = useProducts({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    status: statusFilter,
    category: categoryFilter,
    search: searchQuery,
  });

  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId);
      enqueueSnackbar('Product successfully archived', { variant: 'success' });
      setDeleteId(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to delete product';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  const handleDownloadQr = (uuid: string, productName: string) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const link = document.createElement('a');
    link.href = `${apiBase}/api/files/qrcode/${uuid}`;
    link.download = `QR-${productName.replace(/[^a-zA-Z0-9]/g, '_')}-${uuid.slice(0, 8)}.png`;
    link.target = '_blank';
    link.click();
  };

  const columns: GridColDef<ProductRow>[] = [
    {
      field: 'coverImage',
      headerName: 'Image',
      width: 75,
      sortable: false,
      renderCell: (params: GridRenderCellParams<ProductRow>) => {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const imgUrl = params.row.coverImage?.id
          ? `${apiBase}/api/files/${params.row.coverImage.id}`
          : undefined;

        return (
          <Box display="flex" alignItems="center" height="100%">
            <Avatar
              variant="rounded"
              src={imgUrl}
              sx={{ width: 44, height: 44, bgcolor: '#e2e8f0', fontSize: '0.8rem' }}
            >
              {params.row.name.charAt(0)}
            </Avatar>
          </Box>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
          <Typography variant="body2" fontWeight={600} noWrap>
            {params.row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {params.row.category}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'sku',
      headerName: 'SKU',
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" fontFamily="monospace" sx={{ letterSpacing: 0.5 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const isPublished = params.value === 'PUBLISHED';
        return (
          <Chip
            label={isPublished ? 'Published' : 'Draft'}
            color={isPublished ? 'success' : 'warning'}
            size="small"
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />
        );
      },
    },
    {
      field: 'passport',
      headerName: 'QR Code',
      width: 110,
      sortable: false,
      renderCell: (params: GridRenderCellParams<ProductRow>) => {
        const passport = params.row.passport;
        if (!passport) {
          return (
            <Typography variant="caption" color="text.disabled">
              No QR
            </Typography>
          );
        }

        return (
          <Tooltip title="View QR Code">
            <IconButton
              size="small"
              color="primary"
              onClick={() => setSelectedQr({ uuid: passport.passportUuid, name: params.row.name })}
            >
              <QrCodeIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      field: 'totalViews',
      headerName: 'Views',
      width: 100,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="text.secondary">
          {params.row.totalViews ?? 0}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 190,
      sortable: false,
      renderCell: (params: GridRenderCellParams<ProductRow>) => {
        const passportUuid = params.row.passport?.passportUuid;
        const isPublished = params.row.status === 'PUBLISHED';

        return (
          <Box display="flex" alignItems="center" gap={0.5}>
            <Tooltip title="Edit Product">
              <IconButton
                size="small"
                onClick={() => router.push(`/products/${params.row.id}`)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {isPublished && passportUuid && (
              <>
                <Tooltip title="Open Public Passport">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => window.open(`/passport/${passportUuid}`, '_blank')}
                  >
                    <LaunchIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download QR Code">
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => handleDownloadQr(passportUuid, params.row.name)}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}

            <Tooltip title="Delete / Archive">
              <IconButton
                size="small"
                color="error"
                onClick={() => setDeleteId(params.row.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
      <DataGrid
        autoHeight
        rows={data?.data || []}
        columns={columns}
        loading={isLoading}
        rowCount={data?.meta?.total || 0}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        rowHeight={64}
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
          },
        }}
      />

      {/* QR Code Preview Modal */}
      <Dialog open={Boolean(selectedQr)} onClose={() => setSelectedQr(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            Product QR Code
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedQr?.name}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
          {selectedQr && (
            <Box
              component="img"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                typeof window !== 'undefined'
                  ? `${window.location.origin}/passport/${selectedQr.uuid}`
                  : `http://localhost:3000/passport/${selectedQr.uuid}`,
              )}`}
              alt="Passport QR Code"
              sx={{ width: 220, height: 220, borderRadius: 2, border: '1px solid #e2e8f0', p: 1 }}
            />
          )}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Scan with any smartphone camera to open the public digital product passport.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSelectedQr(null)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => {
              if (selectedQr) handleDownloadQr(selectedQr.uuid, selectedQr.name);
            }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Archive Product"
        message="Are you sure you want to archive this product? If the product has an active published passport, it cannot be deleted until revoked."
        confirmText={isDeleting ? 'Archiving...' : 'Archive'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
