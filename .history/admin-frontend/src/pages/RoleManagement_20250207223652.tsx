import React, { useState, useEffect } from 'react';
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
  FormControl,
  Select,
  MenuItem,
  Chip,
  Button,
  Alert,
  Box,
  Grid
} from '@mui/material';
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/auth/validate-token', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Token geçersiz');
        }

        const userData = await response.json();
        const isSuperAdmin = userData.roles.some((role: { name: string }) => role.name === 'SUPER_ADMIN');

        if (!isSuperAdmin) {
          navigate('/dashboard');
        }
      } catch (err) {
        navigate('/login');
      }
    };

    validateAccess();
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
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
      setError('Veriler yüklenirken bir hata oluştu');
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles.map(role => role.id));
  };

  const handleRoleChange = async () => {
    if (!selectedUser) {
      setError('Lütfen bir kullanıcı seçin');
      return;
    }

    try {
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

      setSuccess('Roller başarıyla güncellendi');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Roller güncellenirken bir hata oluştu');
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Rol Yönetimi
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ad Soyad</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mevcut Roller</TableCell>
                  <TableCell>Yeni Roller</TableCell>
                  <TableCell>İşlem</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow 
                    key={user.id}
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: selectedUser?.id === user.id ? 'rgba(0, 0, 0, 0.04)' : 'inherit'
                    }}
                    onClick={() => handleUserSelect(user)}
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
                      {selectedUser?.id === user.id && (
                        <FormControl fullWidth size="small">
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
                                      size="small"
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
                              <MenuItem 
                                key={role.id} 
                                value={role.id}
                                disabled={role.name === 'SUPER_ADMIN' && user.email !== 'mehmet_developer@hotmail.com'}
                              >
                                {role.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </TableCell>
                    <TableCell>
                      {selectedUser?.id === user.id && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleRoleChange}
                          disabled={user.email === 'mehmet_developer@hotmail.com'}
                        >
                          Rolleri Güncelle
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RoleManagement; 