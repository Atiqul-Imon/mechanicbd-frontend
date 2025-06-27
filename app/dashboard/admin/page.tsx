'use client';
import { useState, useEffect } from 'react';
import api, { get } from '../../../utils/api';
import ProtectedRoute from '../../../components/ProtectedRoute';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Paper,
  Chip,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Snackbar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon
} from '@mui/icons-material';

const drawerWidth = 240;

interface Booking {
  _id: string;
  bookingNumber: string;
  service: {
    _id: string;
    title: string;
    category: string;
    basePrice: number;
  };
  customer: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  mechanic: {
    _id: string;
    fullName: string;
    phoneNumber: string;
  };
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalCustomers: number;
  totalMechanics: number;
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
  todayRevenue: number;
  pendingMechanics: number;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  basePrice: number;
  serviceArea: string;
  isActive: boolean;
  mechanic: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  createdAt: string;
}

function UserManagement({ users, onRefresh }: { users: User[]; onRefresh: () => void }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phoneNumber.includes(search);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? user.isActive : !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusToggle = async (userId: string) => {
    setLoading(true);
    try {
      await api.patch(`/users/${userId}`, { isActive: !users.find(u => u._id === userId)?.isActive });
      setSnackbar({ open: true, message: 'User status updated', severity: 'success' });
      onRefresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(true);
    try {
      await api.patch(`/users/${userId}`, { role: newRole });
      setSnackbar({ open: true, message: 'User role updated', severity: 'success' });
      onRefresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update role';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search users"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Role</InputLabel>
          <Select value={roleFilter} label="Role" onChange={e => setRoleFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="mechanic">Mechanic</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No users found.</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map(user => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28 }}>{user.fullName.charAt(0)}</Avatar>
                      <span>{user.fullName}</span>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>
                    <FormControl size="small">
                      <Select
                        value={user.role}
                        onChange={e => handleRoleChange(user._id, e.target.value)}
                        disabled={user.role === 'admin'}
                      >
                        <MenuItem value="customer">Customer</MenuItem>
                        <MenuItem value="mechanic">Mechanic</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      color={user.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color={user.isActive ? 'error' : 'success'}
                      onClick={() => handleStatusToggle(user._id)}
                      disabled={loading || user.role === 'admin'}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => { setSelectedUser(user); setDetailsOpen(true); }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* User Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ minWidth: 300 }}>
              <Typography variant="subtitle1" fontWeight={600}>{selectedUser.fullName}</Typography>
              <Typography variant="body2">Email: {selectedUser.email}</Typography>
              <Typography variant="body2">Phone: {selectedUser.phoneNumber}</Typography>
              <Typography variant="body2">Role: {selectedUser.role}</Typography>
              <Typography variant="body2">Status: {selectedUser.isActive ? 'Active' : 'Inactive'}</Typography>
              <Typography variant="body2">Created: {new Date(selectedUser.createdAt).toLocaleString()}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function ServiceManagement({ services, onRefresh }: { services: Service[]; onRefresh: () => void }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const filteredServices = services.filter(service => {
    const matchesSearch =
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase()) ||
      service.mechanic.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? service.isActive : !service.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStatusToggle = async (serviceId: string) => {
    setLoading(true);
    try {
      await api.patch(`/services/admin/${serviceId}/toggle`);
      setSnackbar({ open: true, message: 'Service status updated', severity: 'success' });
      onRefresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update service status';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    
    setLoading(true);
    try {
      await api.delete(`/services/${serviceToDelete._id}`);
      setSnackbar({ open: true, message: 'Service deleted successfully', severity: 'success' });
      onRefresh();
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete service';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'HVAC': '❄️',
      'Electrical': '⚡',
      'Plumbing': '🚰',
      'Appliances': '🏠',
      'Carpentry': '🔨',
      'Painting': '🎨',
      'Cleaning': '🧹',
      'Other': '🔧'
    };
    return icons[category] || '🔧';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search services"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          placeholder="Search by title, description, or mechanic..."
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select value={categoryFilter} label="Category" onChange={e => setCategoryFilter(e.target.value)}>
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="HVAC">HVAC</MenuItem>
            <MenuItem value="Electrical">Electrical</MenuItem>
            <MenuItem value="Plumbing">Plumbing</MenuItem>
            <MenuItem value="Appliances">Appliances</MenuItem>
            <MenuItem value="Carpentry">Carpentry</MenuItem>
            <MenuItem value="Painting">Painting</MenuItem>
            <MenuItem value="Cleaning">Cleaning</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Mechanic</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No services found.</TableCell>
              </TableRow>
            ) : (
              filteredServices.map(service => (
                <TableRow key={service._id}>
                  <TableCell>
                    <Box sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {service.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {service.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{getCategoryIcon(service.category)}</span>
                      <span>{service.category}</span>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24 }}>
                        {service.mechanic.fullName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">{service.mechanic.fullName}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {service.mechanic.phoneNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      ৳{service.basePrice}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {service.serviceArea}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={service.isActive ? 'Active' : 'Inactive'}
                      color={service.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => { setSelectedService(service); setDetailsOpen(true); }}
                      >
                        <ViewIcon />
                      </IconButton>
                      <Button
                        size="small"
                        variant="outlined"
                        color={service.isActive ? 'error' : 'success'}
                        onClick={() => handleStatusToggle(service._id)}
                        disabled={loading}
                      >
                        {service.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => { setServiceToDelete(service); setDeleteDialogOpen(true); }}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Service Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Service Details</DialogTitle>
        <DialogContent>
          {selectedService && (
            <Box sx={{ minWidth: 400 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>{selectedService.title}</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>{selectedService.description}</Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ flex: '1 1 200px' }}>
                  <Typography variant="subtitle2" color="textSecondary">Category</Typography>
                  <Typography variant="body1">
                    {getCategoryIcon(selectedService.category)} {selectedService.category}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px' }}>
                  <Typography variant="subtitle2" color="textSecondary">Base Price</Typography>
                  <Typography variant="body1" fontWeight={600}>৳{selectedService.basePrice}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px' }}>
                  <Typography variant="subtitle2" color="textSecondary">Service Area</Typography>
                  <Typography variant="body1">{selectedService.serviceArea}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px' }}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip
                    label={selectedService.isActive ? 'Active' : 'Inactive'}
                    color={selectedService.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>Mechanic Information</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Avatar sx={{ width: 48, height: 48 }}>
                    {selectedService.mechanic.fullName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>{selectedService.mechanic.fullName}</Typography>
                    <Typography variant="body2" color="textSecondary">{selectedService.mechanic.email}</Typography>
                    <Typography variant="body2" color="textSecondary">{selectedService.mechanic.phoneNumber}</Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Created</Typography>
                <Typography variant="body2">{new Date(selectedService.createdAt).toLocaleString()}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Service</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{serviceToDelete?.title}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleDeleteService} color="error" variant="contained" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function AdminDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [availableMechanics, setAvailableMechanics] = useState<User[]>([]);
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [bookingsRes, usersRes, statsRes, servicesRes] = await Promise.all([
        get('/bookings'),
        get('/users'),
        get('/users/admin/dashboard-stats'),
        get('/services/admin')
      ]);
      
      setBookings(bookingsRes.data.data.bookings);
      setUsers(usersRes.data.data.users);
      setStats(statsRes.data.data.stats);
      setServices(servicesRes.data.data.services);
      
      // Filter mechanics for assignment
      const mechanics = usersRes.data.data.users.filter((u: User) => u.role === 'mechanic' && u.isActive);
      setAvailableMechanics(mechanics);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleAssignMechanic = async () => {
    if (!selectedBooking || !selectedMechanic) return;
    
    try {
      await api.patch(`/bookings/${selectedBooking._id}/assign`, {
        mechanicId: selectedMechanic
      });
      
      // Update booking in state
      setBookings(bookings.map(b => 
        b._id === selectedBooking._id 
          ? { ...b, mechanic: availableMechanics.find(m => m._id === selectedMechanic)! }
          : b
      ));
      
      setAssignDialogOpen(false);
      setSelectedBooking(null);
      setSelectedMechanic('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign mechanic';
      alert(errorMessage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'in_progress': return 'secondary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, value: 'dashboard' },
    { text: 'Bookings', icon: <AssignmentIcon />, value: 'bookings' },
    { text: 'Users', icon: <PeopleIcon />, value: 'users' },
    { text: 'Services', icon: <BuildIcon />, value: 'services' },
    { text: 'Reports', icon: <AssessmentIcon />, value: 'reports' },
    { text: 'Settings', icon: <SettingsIcon />, value: 'settings' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Mechanic BD Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={selectedMenu === item.value}
              onClick={() => handleMenuClick(item.value)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: selectedMenu === item.value ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const renderDashboard = () => (
    <Box sx={{ p: 3 }}>
      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Users
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats?.totalUsers || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Active Bookings
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats?.activeBookings || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <ScheduleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" component="div">
                    ৳{stats?.totalRevenue || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Today&apos;s Revenue
                  </Typography>
                  <Typography variant="h4" component="div">
                    ৳{stats?.todayRevenue || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Recent Bookings */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Recent Bookings
            </Typography>
            <Button variant="outlined" startIcon={<AddIcon />}>
              View All
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking #</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Mechanic</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.slice(0, 10).map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking.bookingNumber}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {booking.customer.fullName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{booking.customer.fullName}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {booking.customer.phoneNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{booking.service.title}</TableCell>
                    <TableCell>
                      {booking.mechanic ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24 }}>
                            {booking.mechanic.fullName.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">{booking.mechanic.fullName}</Typography>
                        </Box>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setAssignDialogOpen(true);
                          }}
                        >
                          Assign
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                      <br />
                      <Typography variant="caption" color="textSecondary">
                        {booking.scheduledTime}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status.replace('_', ' ')}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>৳{booking.totalAmount}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" color="primary">
                          <ViewIcon />
                        </IconButton>
                        <IconButton size="small" color="secondary">
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return renderDashboard();
      case 'bookings':
        return <Typography>Bookings Management</Typography>;
      case 'users':
        return <UserManagement users={users} onRefresh={fetchDashboardData} />;
      case 'services':
        return <ServiceManagement services={services} onRefresh={fetchDashboardData} />;
      case 'reports':
        return <Typography>Reports & Analytics</Typography>;
      case 'settings':
        return <Typography>Settings</Typography>;
      default:
        return renderDashboard();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.value === selectedMenu)?.text || 'Dashboard'}
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {renderContent()}
      </Box>

      {/* Assign Mechanic Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
        <DialogTitle>Assign Mechanic</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Mechanic</InputLabel>
            <Select
              value={selectedMechanic}
              label="Select Mechanic"
              onChange={(e) => setSelectedMechanic(e.target.value)}
            >
              {availableMechanics.map((mechanic) => (
                <MenuItem key={mechanic._id} value={mechanic._id}>
                  {mechanic.fullName} - {mechanic.phoneNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAssignMechanic} variant="contained">
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}

export default function AdminDashboardWrapper() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  );
} 