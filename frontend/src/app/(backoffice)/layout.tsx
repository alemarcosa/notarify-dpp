"use client";
import { Box } from '@mui/material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AuthGuard from '@/components/auth/AuthGuard';

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Header />
          <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </AuthGuard>
  );
}
