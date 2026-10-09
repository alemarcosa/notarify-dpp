"use client";
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const pathname = usePathname();

  // Derive section title from route
  const getPageTitle = () => {
    if (pathname.includes('/products/new')) return 'New Product Passport';
    if (pathname.includes('/products/')) return 'Edit Product Passport';
    if (pathname.includes('/products')) return 'Product Management';
    if (pathname.includes('/passports')) return 'Product Passports';
    if (pathname.includes('/analytics')) return 'Analytics & Telemetry';
    if (pathname.includes('/users')) return 'User Administration';
    if (pathname.includes('/settings')) return 'Platform Settings';
    return 'Dashboard Overview';
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.name || user?.email || 'User';

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            {getPageTitle()}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            size="small"
            label={user?.role === 'ADMIN' ? 'Administrator' : 'Editor'}
            color={user?.role === 'ADMIN' ? 'primary' : 'default'}
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />

          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              p: 0.5,
              borderRadius: 2,
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              {displayName}
            </Typography>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: { minWidth: 200, mt: 1, borderRadius: 2, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" fontWeight={700}>
                {displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                logout();
              }}
              sx={{ color: 'error.main', py: 1.2 }}
            >
              <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
