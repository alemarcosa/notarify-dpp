import { Box, Typography, Button } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';

export default function DocumentsSection({ docs = [] }: any) {
  if (!docs.length) return null;
  return (
    <Box p={4} bgcolor="white" borderRadius={3} boxShadow={1}>
      <Typography variant="h5" fontWeight="bold" mb={3}>Documents</Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        {docs.map((d: any, i: number) => (
          <Button key={i} startIcon={<PictureAsPdf />} variant="text" sx={{ justifyContent: 'flex-start' }} href={d.url} target="_blank">
            {d.name} ({d.type})
          </Button>
        ))}
      </Box>
    </Box>
  );
}
