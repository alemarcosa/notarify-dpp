import { format } from 'date-fns';

export const formatDate = (date: string | Date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const truncateText = (text: string, length = 50) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PUBLISHED':
      return 'success';
    case 'DRAFT':
      return 'warning';
    default:
      return 'default';
  }
};
