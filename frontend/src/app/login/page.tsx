"use client";
import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { useLogin } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@notarify.io');
  const [password, setPassword] = useState('Admin123!');
  const { mutate: login, isPending } = useLogin();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email, password },
      {
        onSuccess: () => {
          enqueueSnackbar('Access granted. Welcome back!', { variant: 'success' });
          router.push('/dashboard');
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || 'Invalid email or password';
          enqueueSnackbar(msg, { variant: 'error' });
        },
      },
    );
  };

  const setCredentials = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f1f5f9',
        p: 2,
      }}
    >
      <Card
        sx={{
          p: { xs: 3, sm: 4 },
          width: '100%',
          maxWidth: 440,
          borderRadius: 3,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
            }}
          >
            <LockIcon fontSize="medium" />
          </Box>
          <Typography variant="h5" component="h1" fontWeight={700} color="primary.main">
            Notarify DPP
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Digital Product Passport Management
          </Typography>
        </Box>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email Address"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            autoComplete="email"
            size="small"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            size="small"
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={isPending}
            sx={{ mt: 3, mb: 2, height: 44, borderRadius: 2 }}
          >
            {isPending ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>
          <Typography variant="caption" color="text.secondary">
            DEMO CREDENTIALS
          </Typography>
        </Divider>

        <Stack spacing={1}>
          <Box
            onClick={() => setCredentials('admin@notarify.io', 'Admin123!')}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Administrator
              </Typography>
              <Typography variant="caption" color="text.secondary">
                admin@notarify.io / Admin123!
              </Typography>
            </Box>
            <Chip label="Admin" size="small" color="primary" />
          </Box>

          <Box
            onClick={() => setCredentials('editor@notarify.io', 'Editor123!')}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Editor
              </Typography>
              <Typography variant="caption" color="text.secondary">
                editor@notarify.io / Editor123!
              </Typography>
            </Box>
            <Chip label="Editor" size="small" color="default" />
          </Box>
        </Stack>
      </Card>
    </Box>
  );
}
