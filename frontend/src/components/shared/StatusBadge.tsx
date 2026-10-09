import { Chip } from '@mui/material';
import { getStatusColor } from '@/lib/utils';
export default function StatusBadge({ status }: { status: string }) {
  return <Chip label={status} color={getStatusColor(status) as any} size="small" />;
}
