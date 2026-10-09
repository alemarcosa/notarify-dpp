"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Button,
  Card,
  Typography,
  CircularProgress,
  Stack,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Publish as PublishIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import {
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  usePublishProduct,
} from '@/hooks/useProducts';
import { useSnackbar } from 'notistack';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import MaterialsTab from './tabs/MaterialsTab';
import SustainabilityTab from './tabs/SustainabilityTab';
import CertificationsTab from './tabs/CertificationsTab';
import DocumentsTab from './tabs/DocumentsTab';
import ImagesTab from './tabs/ImagesTab';
import PreviewTab from './tabs/PreviewTab';
import { ProductStatus } from '@/types/product';

export default function ProductForm({ id }: { id?: string }) {
  const [tab, setTab] = useState(0);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const isEditing = Boolean(id && id !== 'new');
  const { data: initialData, isLoading: isLoadingInitial } = useProduct(isEditing ? (id as string) : '');
  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct(id || '');
  const { mutateAsync: publishProduct, isPending: isPublishing } = usePublishProduct();

  const [formData, setFormData] = useState<any>({
    name: '',
    sku: '',
    serialNumber: '',
    category: 'Fashion & Luxury',
    description: '',
    productionDate: '',
    countryOfOrigin: 'Italy',
    materials: [],
    sustainability: {
      carbonFootprint: 0,
      waterConsumption: 0,
      recycledMaterialPercentage: 0,
      repairabilityScore: 7,
      recyclable: false,
    },
    certifications: [],
    documents: [],
    images: [],
    status: ProductStatus.DRAFT,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        productionDate: initialData.productionDate
          ? new Date(initialData.productionDate).toISOString().split('T')[0]
          : '',
        materials: initialData.materials || [],
        sustainability: initialData.sustainability || {
          carbonFootprint: 0,
          waterConsumption: 0,
          recycledMaterialPercentage: 0,
          repairabilityScore: 7,
          recyclable: false,
        },
        certifications: initialData.certifications || [],
        documents: initialData.documents || [],
        images: initialData.images || [],
      });
    }
  }, [initialData]);

  if (isEditing && isLoadingInitial) {
    return (
      <Box p={6} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  const validateForm = () => {
    if (!formData.name?.trim()) {
      enqueueSnackbar('Product name is required', { variant: 'warning' });
      setTab(0);
      return false;
    }
    if (!formData.sku?.trim()) {
      enqueueSnackbar('Product SKU is required', { variant: 'warning' });
      setTab(0);
      return false;
    }
    if (!formData.category?.trim()) {
      enqueueSnackbar('Product category is required', { variant: 'warning' });
      setTab(0);
      return false;
    }
    return true;
  };

  const handleSave = async (shouldPublish = false) => {
    if (!validateForm()) return;

    try {
      let savedProduct: any;

      if (isEditing) {
        savedProduct = await updateProduct(formData);
        enqueueSnackbar('Product details updated', { variant: 'success' });
      } else {
        savedProduct = await createProduct(formData);
        enqueueSnackbar('Product created successfully', { variant: 'success' });
      }

      const targetId = savedProduct?.id || id;

      if (shouldPublish && targetId) {
        await publishProduct(targetId);
        enqueueSnackbar('Product passport published & QR Code generated!', { variant: 'success' });
      }

      router.push('/products');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error saving product';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  const isSaving = isCreating || isUpdating || isPublishing;

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/products')}
            sx={{ color: 'text.secondary', textTransform: 'none' }}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {isEditing ? `Edit ${formData.name || 'Product'}` : 'Create New Product'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in passport information, environmental sustainability data, and compliance records.
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: '#f8fafc',
            px: 2,
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              minHeight: 52,
            },
          }}
        >
          <Tab label="General Info" />
          <Tab label={`Materials (${formData.materials?.length || 0})`} />
          <Tab label="Sustainability" />
          <Tab label={`Certifications (${formData.certifications?.length || 0})`} />
          <Tab label="Documents" />
          <Tab label="Images" />
          <Tab label="Live Passport Preview" />
        </Tabs>

        <Box p={{ xs: 2.5, sm: 4 }} minHeight={420}>
          {tab === 0 && (
            <GeneralInfoTab
              data={formData}
              onChange={(d: any) => setFormData((prev: any) => ({ ...prev, ...d }))}
            />
          )}
          {tab === 1 && (
            <MaterialsTab
              data={formData.materials || []}
              onChange={(m: any) => setFormData((prev: any) => ({ ...prev, materials: m }))}
            />
          )}
          {tab === 2 && (
            <SustainabilityTab
              data={formData.sustainability || {}}
              onChange={(s: any) => setFormData((prev: any) => ({ ...prev, sustainability: s }))}
            />
          )}
          {tab === 3 && (
            <CertificationsTab
              data={formData.certifications || []}
              onChange={(c: any) => setFormData((prev: any) => ({ ...prev, certifications: c }))}
            />
          )}
          {tab === 4 && (
            <DocumentsTab
              data={formData.documents || []}
              onChange={(docs: any) => setFormData((prev: any) => ({ ...prev, documents: docs }))}
            />
          )}
          {tab === 5 && (
            <ImagesTab
              data={formData}
              onChange={(imgData: any) => setFormData((prev: any) => ({ ...prev, ...imgData }))}
            />
          )}
          {tab === 6 && <PreviewTab data={formData} />}
        </Box>

        <Box
          p={2.5}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderTop={1}
          borderColor="divider"
          bgcolor="#f8fafc"
        >
          <Button variant="text" color="inherit" onClick={() => router.push('/products')}>
            Cancel
          </Button>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              disabled={isSaving}
              onClick={() => handleSave(false)}
            >
              Save Draft
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <PublishIcon />}
              disabled={isSaving}
              onClick={() => handleSave(true)}
            >
              Publish Passport
            </Button>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}
