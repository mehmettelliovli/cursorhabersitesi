import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Box,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';

interface User {
  id: number;
  email: string;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
}

const RoleManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const validateAccess = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/auth/validate-token', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const userData = await response.json();
      const isSuperAdmin = userData.roles.some((role: Role) => role.name === 'SUPER_ADMIN');
      
      if (!isSuperAdmin) {
        navigate('/dashboard');
      }
    } catch (err) {
      navigate('/login');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Kullanıcılar yüklenirken bir hata oluştu');
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }

      const data = await response.json();
      setRoles(data);
    } catch (err) {
      setError('Roller yüklenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      await validateAccess();
      await Promise.all([fetchUsers(), fetchRoles()]);
      setLoading(false);
    };

    initializePage();
  }, []);

  const handleUserSelect = (userId: number) => {
    setSelectedUser(userId);
    const user = users.find(u => u.id === userId);
    setSelectedRoles(user?.roles.map(role => role.name) || []);
    setError('');
    setSuccess('');
  };

  const handleRoleChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedRoles(event.target.value as string[]);
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      setError('Lütfen bir kullanıcı seçin');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/users/${selectedUser}/roles`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ roles: selectedRoles }),
      });

      if (!response.ok) {
        throw new Error('Failed to update roles');
      }

      await fetchUsers();
      setSuccess('Roller başarıyla güncellendi');
      setError('');
    } catch (err) {
      setError('Roller güncellenirken bir hata oluştu');
      setSuccess('');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
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

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kullanıcı</TableCell>
                <TableCell>Mevcut Roller</TableCell>
                <TableCell>İşlem</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.roles.map(role => role.name).join(', ')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUserSelect(user.id)}
                    >
                      Rolleri Düzenle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedUser && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Rol Ataması
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Roller</InputLabel>
              <Select
                multiple
                value={selectedRoles}
                onChange={handleRoleChange}
                label="Roller"
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
            >
              Rolleri Kaydet
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default RoleManagement; 