"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { Box, CircularProgress } from '@mui/material';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const check = isAuthenticated();
    setIsAuth(check);
    if (!check) {
      router.push('/login');
    }
  }, [router]);

  if (isAuth === null) {
    return (
      <Box display="flex" height="100vh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return isAuth ? <>{children}</> : null;
}
