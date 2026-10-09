import { Box, Typography } from '@mui/material';
export default function EmptyState({ message }: { message: string }) {
  return <Box p={4} textAlign="center"><Typography color="text.secondary">{message}</Typography></Box>;
}
