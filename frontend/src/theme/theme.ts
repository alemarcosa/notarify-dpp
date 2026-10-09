import { createTheme } from '@mui/material/styles';
import { palette } from './palette';

export const theme = createTheme({
  palette,
  typography: {
    fontFamily: 'var(--font-inter), sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});
