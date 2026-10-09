import { Box, Typography } from '@mui/material';

export default function PassportInfo({ product }: any) {
  if (!product) return null;
  return (
    <Box p={4} bgcolor="white" borderRadius={3} boxShadow={1}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Product Information</Typography>
      <Typography color="text.secondary" paragraph>{product.description}</Typography>
      <Typography variant="body2"><strong>Category:</strong> {product.category}</Typography>
      <Typography variant="body2"><strong>Origin:</strong> {product.origin}</Typography>
    </Box>
  );
}
