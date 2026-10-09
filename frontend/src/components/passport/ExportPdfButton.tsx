"use client";
import React from 'react';
import { Button } from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';

export default function ExportPdfButton() {
  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<PdfIcon />}
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.print();
        }
      }}
      sx={{
        color: '#e2e8f0',
        borderColor: 'rgba(255,255,255,0.25)',
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        '&:hover': {
          borderColor: '#ffffff',
          bgcolor: 'rgba(255,255,255,0.1)',
        },
      }}
    >
      Export / Print PDF
    </Button>
  );
}
