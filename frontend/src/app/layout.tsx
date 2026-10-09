import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Inter } from 'next/font/google';
import { theme } from '@/theme/theme';
import QueryProvider from '@/components/providers/QueryProvider';
import SnackbarProvider from '@/components/providers/SnackbarProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Notarify DPP',
  description: 'Digital Product Passport Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryProvider>
            <SnackbarProvider>
              {children}
            </SnackbarProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
