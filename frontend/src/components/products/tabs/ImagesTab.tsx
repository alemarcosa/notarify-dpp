"use client";
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Stack,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Star as StarIcon } from '@mui/icons-material';
import FileDropzone from '@/components/shared/FileDropzone';

export default function ImagesTab({
  data,
  onChange,
}: {
  data: any;
  onChange: (updated: any) => void;
}) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const handleCoverUploaded = (fileRecord: { id: string; originalName: string }) => {
    onChange({
      coverImageId: fileRecord.id,
      coverImage: {
        id: fileRecord.id,
        originalName: fileRecord.originalName,
      },
    });
  };

  const handleRemoveCover = () => {
    onChange({ coverImageId: null, coverImage: null });
  };

  const handleGalleryUploaded = (fileRecord: { id: string; originalName: string }) => {
    const currentImages = data.images || [];
    onChange({
      images: [
        ...currentImages,
        {
          fileId: fileRecord.id,
          file: {
            id: fileRecord.id,
            originalName: fileRecord.originalName,
          },
        },
      ],
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    const currentImages = data.images || [];
    onChange({
      images: currentImages.filter((_: any, i: number) => i !== index),
    });
  };

  const coverImageUrl = data.coverImage?.id
    ? `${apiBase}/api/files/${data.coverImage.id}`
    : data.coverImageId
    ? `${apiBase}/api/files/${data.coverImageId}`
    : null;

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
        Upload the primary product cover photo and supplemental gallery imagery displayed on the passport.
      </Typography>

      <Grid container spacing={4}>
        {/* Cover Image Section */}
        <Grid item xs={12} md={5}>
          <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
            Primary Cover Image
          </Typography>

          {coverImageUrl ? (
            <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
              <CardMedia
                component="img"
                height="240"
                image={coverImageUrl}
                alt="Product Cover"
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip icon={<StarIcon />} label="Main Cover" size="small" color="primary" />
                <IconButton size="small" color="error" onClick={handleRemoveCover}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardContent>
            </Card>
          ) : (
            <FileDropzone
              label="Drop Cover Photo here"
              accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
              onUploaded={handleCoverUploaded}
            />
          )}
        </Grid>

        {/* Gallery Images Section */}
        <Grid item xs={12} md={7}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Typography variant="subtitle1" fontWeight={600}>
              Product Gallery ({data.images?.length || 0})
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <FileDropzone
              label="Add photo to product gallery"
              accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
              onUploaded={handleGalleryUploaded}
            />
          </Box>

          <Grid container spacing={2}>
            {(data.images || []).map((img: any, idx: number) => {
              const fileId = img.fileId || img.file?.id || img.id;
              const imgUrl = fileId ? `${apiBase}/api/files/${fileId}` : null;

              return (
                <Grid item xs={6} sm={4} key={idx}>
                  <Card variant="outlined" sx={{ borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                    {imgUrl ? (
                      <CardMedia
                        component="img"
                        height="120"
                        image={imgUrl}
                        alt={`Gallery ${idx + 1}`}
                        sx={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box height="120" bgcolor="#f1f5f9" display="flex" alignItems="center" justifyContent="center">
                        <Typography variant="caption">Image #{idx + 1}</Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(255,255,255,0.85)',
                        borderRadius: '50%',
                      }}
                    >
                      <IconButton size="small" color="error" onClick={() => handleRemoveGalleryImage(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
