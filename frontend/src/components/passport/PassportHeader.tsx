import { Box, Typography, Chip, Container } from '@mui/material';
import { Verified as VerifiedIcon } from '@mui/icons-material';

export default function PassportHeader({ product }: any) {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', pt: 8, pb: 12 }}>
      <Container maxWidth="md">
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
          <Box>
            <Chip 
              icon={<VerifiedIcon sx={{ color: 'white !important' }} />} 
              label="Verified Product" 
              sx={{ bgcolor: 'success.main', color: 'white', mb: 2 }} 
            />
            <Typography variant="h3" fontWeight="bold" mb={1}>{product.name}</Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>SKU: {product.sku} | S/N: {product.serialNumber}</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
