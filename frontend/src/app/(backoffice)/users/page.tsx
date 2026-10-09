"use client";
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'EDITOR',
  });

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    },
  });

  const { mutateAsync: createUser, isPending: isCreating } = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/users', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      enqueueSnackbar('User created successfully', { variant: 'success' });
      setOpenModal(false);
      setNewUser({ firstName: '', lastName: '', email: '', password: '', role: 'EDITOR' });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Failed to create user';
      enqueueSnackbar(msg, { variant: 'error' });
    },
  });

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/users/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      enqueueSnackbar('User deactivated', { variant: 'info' });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password || !newUser.firstName) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'warning' });
      return;
    }
    createUser(newUser);
  };

  const usersList = Array.isArray(usersData) ? usersData : usersData?.data || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Team & User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage organization members, assign Administrator or Editor privileges.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{ borderRadius: 2 }}
        >
          Add Member
        </Button>
      </Box>

      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {isLoading ? (
          <Box p={6} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Member</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Registered</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersList.map((u: any) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: u.role === 'ADMIN' ? 'primary.main' : '#e2e8f0',
                          color: u.role === 'ADMIN' ? 'white' : 'text.primary',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {u.role === 'ADMIN' ? <AdminIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {u.firstName} {u.lastName}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role}
                      size="small"
                      color={u.role === 'ADMIN' ? 'primary' : 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={u.isActive ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                    {u.createdAt ? format(new Date(u.createdAt), 'MMM dd, yyyy') : '—'}
                  </TableCell>
                  <TableCell align="right">
                    {u.role !== 'ADMIN' && (
                      <Tooltip title="Deactivate Member">
                        <IconButton size="small" color="error" onClick={() => deleteUser(u.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Create User Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleCreate}>
          <DialogTitle fontWeight={700}>Add New Team Member</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="First Name"
                required
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              />
              <TextField
                fullWidth
                size="small"
                label="Last Name"
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              />
              <TextField
                fullWidth
                size="small"
                type="email"
                label="Email Address"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <TextField
                fullWidth
                size="small"
                type="password"
                label="Temporary Password"
                required
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                helperText="Minimum 8 characters"
              />
              <TextField
                select
                fullWidth
                size="small"
                label="Role"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <MenuItem value="EDITOR">Editor (Manage Products & Passports)</MenuItem>
                <MenuItem value="ADMIN">Administrator (Full System Access)</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isCreating}>
              {isCreating ? <CircularProgress size={20} /> : 'Create User'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
