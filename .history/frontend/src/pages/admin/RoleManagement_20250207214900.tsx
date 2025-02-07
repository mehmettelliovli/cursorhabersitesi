import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  fullName: string;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
}

const RoleManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [currentUserRoles, setCurrentUserRoles] = useState<string[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const validateToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/auth/validate-token', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const userData = await response.json();
      const hasRequiredRole = userData.roles.some((role: { name: string }) => 
        role.name === 'SUPER_ADMIN'
      );

      setCurrentUserRoles(userData.roles.map((role: { name: string }) => role.name));
      setIsSuperAdmin(hasRequiredRole);

      if (!hasRequiredRole) {
        throw new Error('Insufficient permissions');
      }
    } catch (err) {
      console.error('Token validation error:', err);
      localStorage.removeItem('token');
      navigate('/admin/login');
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found');
      }

      const [usersResponse, rolesResponse] = await Promise.all([
        fetch('http://localhost:3000/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:3000/roles', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!usersResponse.ok || !rolesResponse.ok) {
        throw new Error('Veri çekme hatası');
      }

      const [usersData, rolesData] = await Promise.all([
        usersResponse.json(),
        rolesResponse.json()
      ]);

      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    validateToken();
    fetchData();
  }, [navigate, validateToken, fetchData]);

  const handleOpenDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles.map(role => role.id));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setSelectedRoles([]);
  };

  const handleSubmit = async () => {
    try {
      if (!selectedUser) return;

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roleIds: selectedRoles
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Güncelleme başarısız');
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Error updating roles:', err);
      setError(err instanceof Error ? err.message : 'Roller güncellenirken bir hata oluştu');
    }
  };

  const canEditRoles = useCallback((user: User) => {
    const isSuperAdmin = currentUserRoles.includes('SUPER_ADMIN');
    const isProtectedUser = user.email === 'mehmet_developer@hotmail.com';
    return isSuperAdmin && !isProtectedUser;
  }, [currentUserRoles]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isSuperAdmin) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          Bu sayfaya erişim yetkiniz bulunmamaktadır. Sadece SUPER_ADMIN kullanıcıları erişebilir.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" component="h1" gutterBottom>
        Rol Yönetimi
      </Typography>

      <Grid container spacing={3}>
        {/* Sol Panel - Rol Atama */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Rol Atama
            </Typography>
            
            {selectedUser ? (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Seçili Kullanıcı: {selectedUser.fullName}
                </Typography>
                
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Roller</InputLabel>
                  <Select
                    multiple
                    value={selectedRoles}
                    onChange={(e) => setSelectedRoles(e.target.value as number[])}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const role = roles.find(r => r.id === value);
                          return (
                            <Chip
                              key={value}
                              label={role?.name}
                              sx={{
                                bgcolor: role?.name === 'SUPER_ADMIN' ? '#f44336' :
                                        role?.name === 'ADMIN' ? '#2196f3' :
                                        role?.name === 'AUTHOR' ? '#4caf50' : '#757575',
                                color: 'white'
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleSubmit}
                >
                  Rolleri Güncelle
                </Button>
              </>
            ) : (
              <Typography color="textSecondary">
                Rol atamak için bir kullanıcı seçin
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Sağ Panel - Kullanıcı Listesi */}
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ad Soyad</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Roller</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow 
                    key={user.id}
                    onClick={() => handleOpenDialog(user)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      bgcolor: selectedUser?.id === user.id ? 'rgba(0, 0, 0, 0.08)' : 'inherit'
                    }}
                  >
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.roles.map((role) => (
                        <Chip
                          key={role.id}
                          label={role.name}
                          size="small"
                          sx={{ 
                            mr: 0.5,
                            bgcolor: role.name === 'SUPER_ADMIN' ? '#f44336' :
                                    role.name === 'ADMIN' ? '#2196f3' :
                                    role.name === 'AUTHOR' ? '#4caf50' : '#757575',
                            color: 'white'
                          }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(user);
                        }}
                        disabled={!canEditRoles(user)}
                        color="primary"
                        title={!canEditRoles(user) ? 'Bu kullanıcının rollerini değiştirme yetkiniz yok' : ''}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Kullanıcı Rollerini Düzenle: {selectedUser?.fullName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Roller</InputLabel>
              <Select
                multiple
                value={selectedRoles}
                onChange={(e) => setSelectedRoles(e.target.value as number[])}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const role = roles.find(r => r.id === value);
                      return (
                        <Chip
                          key={value}
                          label={role?.name}
                          sx={{
                            bgcolor: role?.name === 'SUPER_ADMIN' ? '#f44336' :
                                    role?.name === 'ADMIN' ? '#2196f3' :
                                    role?.name === 'AUTHOR' ? '#4caf50' : '#757575',
                            color: 'white'
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoleManagement; 