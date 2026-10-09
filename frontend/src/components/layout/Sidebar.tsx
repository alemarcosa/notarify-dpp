"use client";
import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useAuth';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Products', icon: <InventoryIcon />, path: '/products' },
  { text: 'Product Passports', icon: <QrCodeIcon />, path: '/passports' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useCurrentUser();

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.name || user?.email || 'User';

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
        },
      }}
    >
      {/* Brand Header */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShieldIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ lineHeight: 1.1 }}>
            NOTARIFY
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ letterSpacing: 0.5 }}>
            DPP Platform
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {/* Navigation List */}
      <List sx={{ px: 1.5, flex: 1 }}>
        {menuItems.map((item) => {
          const active = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 2,
                  bgcolor: active ? 'primary.main' : 'transparent',
                  color: active ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: active ? 'primary.dark' : '#f1f5f9',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? 'white' : '#64748b',
                    minWidth: 38,
                    '& svg': { fontSize: 20 },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Footer Profile */}
      <Divider />
      <Box sx={{ p: 2, bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          sx={{
            width: 38,
            height: 38,
            bgcolor: user?.role === 'ADMIN' ? 'primary.main' : '#64748b',
            fontSize: '0.9rem',
            fontWeight: 700,
          }}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ overflow: 'hidden', flex: 1 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap display="block">
            {user?.role || 'EDITOR'}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
