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
  Snackbar,
  Tooltip
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
  Add as AddIcon,
  Payment as PaymentIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import type { JSX } from 'react';

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
  paymentStatus: string;
  createdAt: string;
  refund?: {
    refundStatus: string;
    refundAmount?: number;
    refundReason?: string;
  };
  reschedule?: {
    status: string;
    newDate?: string;
    newTime?: string;
    note?: string;
  };
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
  status: string;
  mechanic: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  createdAt: string;
}

interface Payment {
  _id: string;
  paymentId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  customer: {
    _id: string;
    fullName: string;
    phoneNumber: string;
  };
  mechanic: {
    _id: string;
    fullName: string;
    phoneNumber: string;
  };
  booking: {
    _id: string;
    bookingNumber: string;
  };
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
                  <TableCell>{new Date(user.createdAt).toISOString().slice(0, 10)}</TableCell>
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
              <Typography variant="body2">Created: {new Date(selectedUser.createdAt).toISOString().slice(0, 10)}</Typography>
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

  const handleApprove = async (serviceId: string) => {
    setLoading(true);
    try {
      await api.patch(`/services/admin/${serviceId}/approve`);
      setSnackbar({ open: true, message: 'Service approved', severity: 'success' });
      onRefresh();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to approve service', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (serviceId: string) => {
    setLoading(true);
    try {
      await api.patch(`/services/admin/${serviceId}/reject`);
      setSnackbar({ open: true, message: 'Service rejected', severity: 'success' });
      onRefresh();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to reject service', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending': return <Chip label="Pending" color="warning" size="small" />;
      case 'approved': return <Chip label="Approved" color="success" size="small" />;
      case 'rejected': return <Chip label="Rejected" color="error" size="small" />;
      default: return <Chip label={status} size="small" />;
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
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'primary.main', fontFamily: 'Poppins, Arial, Helvetica, sans-serif', letterSpacing: 0.5 }}>
        Service Management
      </Typography>
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
      
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(153,27,27,0.08)', mt: 2 }}>
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
                <TableRow key={service?._id || Math.random()}>
                  <TableCell>
                    <Box sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {service?.title || <i>Service missing</i>}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {service?.description || ''}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{service ? getCategoryIcon(service.category) : ''}</span>
                      <span>{service?.category || ''}</span>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24 }}>
                        {service?.mechanic?.fullName?.charAt(0) || '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">{service?.mechanic?.fullName || <i>Unknown</i>}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {service?.mechanic?.phoneNumber || ''}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      ৳{service?.basePrice ?? ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {service?.serviceArea || ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(service?.status || '')}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {service?.createdAt ? new Date(service.createdAt).toISOString().slice(0, 10) : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => { if (service) { setSelectedService(service); setDetailsOpen(true); } }}
                        disabled={!service}
                      >
                        <ViewIcon />
                      </IconButton>
                      {service?.status === 'pending' && (
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => service && handleApprove(service._id)}
                            disabled={loading || !service}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => service && handleReject(service._id)}
                            disabled={loading || !service}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        color={service?.isActive ? 'error' : 'success'}
                        onClick={() => service && handleStatusToggle(service._id)}
                        disabled={loading || !service}
                      >
                        {service?.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => { if (service) { setServiceToDelete(service); setDeleteDialogOpen(true); } }}
                        disabled={loading || !service}
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
                  {getStatusChip(selectedService.status)}
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
                <Typography variant="body2">{new Date(selectedService.createdAt).toISOString().slice(0, 10)}</Typography>
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
          <Button onClick={() => {
            setLoading(true);
            api.delete(`/services/${serviceToDelete?._id}`)
              .then(() => {
                setSnackbar({ open: true, message: 'Service deleted successfully', severity: 'success' });
                onRefresh();
                setDeleteDialogOpen(false);
                setServiceToDelete(null);
              })
              .catch((err: unknown) => {
                const errorMessage = err instanceof Error ? err.message : 'Failed to delete service';
                setSnackbar({ open: true, message: errorMessage, severity: 'error' });
              })
              .finally(() => setLoading(false));
          }} color="error" variant="contained" disabled={loading}>
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

function PaymentManagement({ payments, onRefresh }: { payments: Payment[]; onRefresh: () => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.paymentId.toLowerCase().includes(search.toLowerCase()) ||
      payment.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      payment.booking.bookingNumber.includes(search);
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleRefund = async () => {
    if (!selectedPayment || !refundAmount || !refundReason) return;
    
    setLoading(true);
    try {
      await api.post(`/payments/admin/${selectedPayment._id}/refund`, {
        amount: parseFloat(refundAmount),
        reason: refundReason
      });
      setSnackbar({ open: true, message: 'Refund processed successfully', severity: 'success' });
      onRefresh();
      setRefundDialogOpen(false);
      setSelectedPayment(null);
      setRefundAmount('');
      setRefundReason('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process refund';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'cancelled': return 'default';
      case 'refunded': return 'secondary';
      default: return 'default';
    }
  };

  const getMethodDisplay = (method: string) => {
    const methodMap: { [key: string]: string } = {
      bkash: 'bKash',
      nagad: 'Nagad',
      rocket: 'Rocket',
      upay: 'Upay',
      tap: 'Tap',
      sure_cash: 'Sure Cash'
    };
    return methodMap[method] || method;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search payments"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="refunded">Refunded</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Method</InputLabel>
          <Select value={methodFilter} label="Method" onChange={e => setMethodFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="bkash">bKash</MenuItem>
            <MenuItem value="nagad">Nagad</MenuItem>
            <MenuItem value="rocket">Rocket</MenuItem>
            <MenuItem value="upay">Upay</MenuItem>
            <MenuItem value="tap">Tap</MenuItem>
            <MenuItem value="sure_cash">Sure Cash</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Booking</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No payments found.</TableCell>
              </TableRow>
            ) : (
              filteredPayments.map(payment => (
                <TableRow key={payment._id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {payment.paymentId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{payment.customer.fullName}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {payment.customer.phoneNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      #{payment.booking.bookingNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      ৳{payment.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getMethodDisplay(payment.paymentMethod)} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.status} 
                      color={getStatusColor(payment.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(payment.createdAt).toISOString().slice(0, 10)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setDetailsOpen(true);
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                      {payment.status === 'completed' && (
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setRefundAmount(payment.amount.toString());
                            setRefundDialogOpen(true);
                          }}
                        >
                          <MoneyIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payment Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Payment ID</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {selectedPayment.paymentId}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Amount</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    ৳{selectedPayment.amount.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Method</Typography>
                  <Typography variant="body2">{getMethodDisplay(selectedPayment.paymentMethod)}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip 
                    label={selectedPayment.status} 
                    color={getStatusColor(selectedPayment.status) as any}
                    size="small"
                  />
                </Box>
              </Box>
              
              <Divider />
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Customer</Typography>
                <Typography variant="body2">{selectedPayment.customer.fullName}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {selectedPayment.customer.phoneNumber}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Booking</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  #{selectedPayment.booking.bookingNumber}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Created</Typography>
                <Typography variant="body2">
                  {new Date(selectedPayment.createdAt).toISOString().slice(0, 10)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onClose={() => setRefundDialogOpen(false)}>
        <DialogTitle>Process Refund</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Refund Amount"
              type="number"
              value={refundAmount}
              onChange={e => setRefundAmount(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Refund Reason"
              value={refundReason}
              onChange={e => setRefundReason(e.target.value)}
              fullWidth
              multiline
              rows={3}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundDialogOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleRefund} color="warning" variant="contained" disabled={loading}>
            {loading ? 'Processing...' : 'Process Refund'}
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

function AdminDashboard(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
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
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundAction, setRefundAction] = useState<'approve' | 'reject' | 'process'>('approve');
  const [refundNote, setRefundNote] = useState('');
  const [processingRefund, setProcessingRefund] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!loading && stats) {
      setShowStats(true);
    }
  }, [loading, stats]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [bookingsRes, usersRes, statsRes, servicesRes, paymentsRes] = await Promise.all([
        get('/bookings'),
        get('/users'),
        get('/users/admin/dashboard-stats'),
        get('/services/admin'),
        get('/payments/admin/all')
      ]);
      
      setBookings(bookingsRes.data.data.bookings);
      setUsers(usersRes.data.data.users);
      setStats(statsRes.data.data.stats);
      setServices(servicesRes.data.data.services);
      setPayments(paymentsRes.data.data.payments);
      
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

  const handleRefundAction = async () => {
    if (!selectedBooking) return;
    
    setProcessingRefund(true);
    try {
      await api.patch(`/bookings/${selectedBooking._id}/refund`, {
        action: refundAction,
        note: refundNote
      });
      
      // Update booking in state
      setBookings(bookings.map(b => 
        b._id === selectedBooking._id 
          ? { 
              ...b, 
              refund: {
                ...b.refund,
                refundStatus: refundAction === 'approve' ? 'approved' : 
                             refundAction === 'reject' ? 'rejected' : 'processed'
              }
            }
          : b
      ));
      
      setRefundModalOpen(false);
      setSelectedBooking(null);
      setRefundAction('approve');
      setRefundNote('');
      alert(`Refund ${refundAction}ed successfully!`);
    } catch (err: any) {
      alert(err.response?.data?.message || `Failed to ${refundAction} refund`);
    } finally {
      setProcessingRefund(false);
    }
  };

  const openRefundModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setRefundModalOpen(true);
  };

  const getRefundStatusBadge = (refundStatus: string) => {
    switch (refundStatus) {
      case 'requested': return 'bg-yellow-100 text-yellow-900';
      case 'approved': return 'bg-blue-100 text-blue-900';
      case 'rejected': return 'bg-red-100 text-red-900';
      case 'processed': return 'bg-green-100 text-green-900';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  const getRescheduleStatusBadge = (rescheduleStatus: string) => {
    switch (rescheduleStatus) {
      case 'requested': return 'bg-yellow-100 text-yellow-900';
      case 'accepted': return 'bg-green-100 text-green-900';
      case 'declined': return 'bg-red-100 text-red-900';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, value: 'dashboard' },
    { text: 'Bookings', icon: <AssignmentIcon />, value: 'bookings' },
    { text: 'Users', icon: <PeopleIcon />, value: 'users' },
    { text: 'Services', icon: <BuildIcon />, value: 'services' },
    { text: 'Payments', icon: <PaymentIcon />, value: 'payments' },
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

  const renderDashboard = () => {
    const statCards: Array<{
      label: string;
      value: number;
      icon: JSX.Element;
      color: string;
      tooltip: string;
      detailsLink: string;
      isCurrency?: boolean;
      trend?: string;
      trendValue?: number;
    }> = [
      {
        label: 'Total Users',
        value: stats?.totalUsers || 0,
        icon: <PeopleIcon sx={{ fontSize: 40, color: '#991B1B' }} />,
        color: 'linear-gradient(135deg, #fff0f0 0%, #ffeaea 100%)',
        tooltip: 'All registered users on the platform',
        detailsLink: '/dashboard/admin/users',
        trend: '+12%',
        trendValue: 12,
      },
      {
        label: 'Total Bookings',
        value: stats?.totalBookings || 0,
        icon: <AssignmentIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
        color: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
        tooltip: 'All service bookings made',
        detailsLink: '/dashboard/admin/bookings',
        trend: '+8%',
        trendValue: 8,
      },
      {
        label: 'Total Revenue',
        value: stats?.totalRevenue || 0,
        icon: <MoneyIcon sx={{ fontSize: 40, color: '#FFA726' }} />,
        color: 'linear-gradient(135deg, #fff8e1 0%, #fff3e0 100%)',
        tooltip: 'Total revenue generated',
        detailsLink: '/dashboard/admin/payments',
        isCurrency: true,
        trend: '+15%',
        trendValue: 15,
      },
      {
        label: 'Active Services',
        value: services.filter(s => s.status === 'approved').length,
        icon: <BuildIcon sx={{ fontSize: 40, color: '#1976D2' }} />,
        color: 'linear-gradient(135deg, #e3f2fd 0%, #e1f5fe 100%)',
        tooltip: 'Currently approved and active services',
        detailsLink: '/dashboard/admin/services',
        trend: '+5%',
        trendValue: 5,
      },
    ];

    return (
      <Box>
        {/* Stats Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, 
          gap: 3, 
          mb: 4 
        }}>
          {loading || !showStats ? (
            Array.from({ length: 4 }).map((_, idx: number) => (
              <Card key={idx} sx={{ 
                borderRadius: 3, 
                minHeight: 160, 
                boxShadow: '0 2px 16px 0 rgba(153,27,27,0.10)',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      width: 56, 
                      height: 56, 
                      borderRadius: 2, 
                      bgcolor: '#f5f5f5', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      animation: 'pulse 2s infinite'
                    }}>
                      <CircularProgress size={32} thickness={4} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ 
                        width: '60%', 
                        height: 18, 
                        bgcolor: '#eee', 
                        borderRadius: 1, 
                        mb: 1,
                        animation: 'pulse 2s infinite'
                      }} />
                      <Box sx={{ 
                        width: '40%', 
                        height: 28, 
                        bgcolor: '#eee', 
                        borderRadius: 1,
                        animation: 'pulse 2s infinite'
                      }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            statCards.map((card: typeof statCards[number], idx: number) => (
              <Card key={card.label} sx={{ 
                borderRadius: 3, 
                minHeight: 160, 
                boxShadow: '0 2px 16px 0 rgba(153,27,27,0.10)', 
                background: card.color, 
                position: 'relative', 
                overflow: 'visible', 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                cursor: 'pointer',
                '&:hover': { 
                  transform: 'translateY(-8px) scale(1.02)', 
                  boxShadow: '0 12px 32px 0 rgba(153,27,27,0.25)',
                  '& .card-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #991B1B, #DC2626)',
                  borderRadius: '12px 12px 0 0',
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ 
                      width: 64, 
                      height: 64, 
                      borderRadius: 3, 
                      bgcolor: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      boxShadow: '0 4px 12px 0 rgba(0,0,0,0.1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      className: 'card-icon'
                    }}>
                      {card.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ 
                        fontWeight: 600, 
                        fontFamily: 'Poppins, Arial, Helvetica, sans-serif', 
                        mb: 0.5,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontSize: '0.75rem'
                      }}>
                        {card.label}
                      </Typography>
                      <Typography variant="h3" sx={{ 
                        fontWeight: 800, 
                        color: '#1f2937', 
                        fontFamily: 'Poppins, Arial, Helvetica, sans-serif', 
                        lineHeight: 1.1,
                        mb: 1,
                        fontVariantNumeric: 'tabular-nums'
                      }}>
                        {card.isCurrency ? '৳' : ''}
                        <span style={{ 
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'inline-block',
                          animation: 'countUp 1s ease-out'
                        }}>
                          {card.value.toLocaleString()}
                        </span>
                      </Typography>
                      {card.trend && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingUpIcon sx={{ fontSize: 16, color: '#10B981' }} />
                          <Typography variant="caption" sx={{ 
                            color: '#10B981', 
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}>
                            {card.trend} from last month
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ ml: 1 }}>
                      <Tooltip title={card.tooltip} arrow placement="top">
                        <IconButton size="small" sx={{ 
                          color: '#6B7280',
                          '&:hover': {
                            color: '#991B1B',
                            bgcolor: 'rgba(153, 27, 27, 0.1)'
                          }
                        }}>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Button
                    href={card.detailsLink}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      mt: 3, 
                      borderRadius: 2, 
                      fontWeight: 600, 
                      textTransform: 'none', 
                      color: '#991B1B', 
                      borderColor: '#991B1B', 
                      '&:hover': { 
                        bgcolor: '#fff0f0', 
                        borderColor: '#991B1B',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px rgba(153, 27, 27, 0.2)'
                      },
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </Box>

        {/* Recent Bookings */}
        <Card sx={{ 
          mt: 4, 
          borderRadius: 3, 
          boxShadow: '0 2px 12px 0 rgba(153,27,27,0.08)',
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              p: 3,
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <Box>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: '#1f2937', 
                  fontFamily: 'Poppins, Arial, Helvetica, sans-serif',
                  mb: 0.5
                }}>
                  Recent Bookings
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                  Latest service requests and their status
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />} 
                sx={{ 
                  fontWeight: 600, 
                  borderRadius: 2,
                  borderColor: '#991B1B',
                  color: '#991B1B',
                  '&:hover': {
                    borderColor: '#7F1D1D',
                    backgroundColor: '#fff0f0'
                  }
                }}
              >
                View All
              </Button>
            </Box>
            
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      fontSize: '0.875rem'
                    }}>
                      Booking #
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      fontSize: '0.875rem'
                    }}>
                      Customer
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      fontSize: '0.875rem'
                    }}>
                      Service
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      fontSize: '0.875rem'
                    }}>
                      Mechanic
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      fontSize: '0.875rem'
                    }}>
                      Date & Time
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      fontSize: '0.875rem'
                    }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      fontSize: '0.875rem'
                    }}>
                      Amount
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      fontSize: '0.875rem'
                    }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.slice(0, 10).map((booking, index) => (
                    <TableRow 
                      key={booking._id} 
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: '#f9fafb',
                          '& .action-buttons': {
                            opacity: 1
                          }
                        },
                        transition: 'all 0.2s ease-in-out',
                        animation: `slideInUp 0.3s ease-out ${index * 0.05}s both`
                      }}
                    >
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: '#991B1B',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem'
                      }}>
                        {booking.bookingNumber}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            width: 40, 
                            height: 40,
                            bgcolor: '#991B1B',
                            fontSize: '1rem',
                            fontWeight: 600
                          }}>
                            {booking.customer.fullName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 600, 
                              color: '#1f2937',
                              mb: 0.5
                            }}>
                              {booking.customer.fullName}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: '#6B7280',
                              fontSize: '0.75rem'
                            }}>
                              {booking.customer.phoneNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500,
                          color: '#374151'
                        }}>
                          {booking.service?.title || <i style={{ color: '#9CA3AF' }}>Service missing</i>}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: '#6B7280',
                          fontSize: '0.75rem'
                        }}>
                          {booking.service?.category}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {booking.mechanic ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              width: 32, 
                              height: 32,
                              bgcolor: '#4CAF50',
                              fontSize: '0.875rem',
                              fontWeight: 600
                            }}>
                              {booking.mechanic.fullName.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 500,
                              color: '#374151'
                            }}>
                              {booking.mechanic.fullName}
                            </Typography>
                          </Box>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setAssignDialogOpen(true);
                            }}
                            sx={{ 
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              borderColor: '#991B1B',
                              color: '#991B1B',
                              '&:hover': {
                                backgroundColor: '#fff0f0',
                                borderColor: '#7F1D1D'
                              }
                            }}
                          >
                            Assign
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 600,
                          color: '#374151',
                          mb: 0.5
                        }}>
                          {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: '#6B7280',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace'
                        }}>
                          {booking.scheduledTime}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Chip 
                            label={booking.status.replace('_', ' ').toUpperCase()} 
                            size="small"
                            sx={{ 
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                            color={booking.status === 'completed' ? 'success' : 
                                   booking.status === 'cancelled' ? 'error' : 'primary'}
                          />
                          {/* Show refund status if exists */}
                          {booking.refund && booking.refund.refundStatus !== 'none' && (
                            <Chip 
                              label={`Refund: ${booking.refund.refundStatus}`}
                              size="small"
                              sx={{ 
                                bgcolor: getRefundStatusBadge(booking.refund.refundStatus).split(' ')[0].replace('bg-', ''),
                                color: getRefundStatusBadge(booking.refund.refundStatus).split(' ')[1].replace('text-', ''),
                                fontSize: '0.625rem',
                                height: 20
                              }}
                            />
                          )}
                          {/* Show reschedule status if exists */}
                          {booking.reschedule && booking.reschedule.status !== 'none' && (
                            <Chip 
                              label={`Reschedule: ${booking.reschedule.status}`}
                              size="small"
                              sx={{ 
                                bgcolor: getRescheduleStatusBadge(booking.reschedule.status).split(' ')[0].replace('bg-', ''),
                                color: getRescheduleStatusBadge(booking.reschedule.status).split(' ')[1].replace('text-', ''),
                                fontSize: '0.625rem',
                                height: 20
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 700,
                          color: '#991B1B',
                          fontFamily: 'monospace'
                        }}>
                          ৳{booking.totalAmount.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: '#6B7280',
                          fontSize: '0.75rem'
                        }}>
                          {booking.paymentStatus}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1,
                          opacity: 0,
                          transition: 'opacity 0.2s ease-in-out',
                          className: 'action-buttons'
                        }}>
                          <IconButton 
                            size="small" 
                            sx={{ 
                              color: '#6B7280',
                              '&:hover': {
                                color: '#991B1B',
                                backgroundColor: '#fff0f0'
                              }
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            sx={{ 
                              color: '#6B7280',
                              '&:hover': {
                                color: '#4CAF50',
                                backgroundColor: '#f0f9f0'
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
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

        {/* Refund Management Modal */}
        {refundModalOpen && selectedBooking && (
          <Dialog open={refundModalOpen} onClose={() => setRefundModalOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Handle Refund Request</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Refund Details:
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  Amount: ৳{selectedBooking.refund?.refundAmount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Reason: {selectedBooking.refund?.refundReason}
                </Typography>
              </Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Action</InputLabel>
                <Select
                  value={refundAction}
                  label="Action"
                  onChange={(e) => setRefundAction(e.target.value as 'approve' | 'reject' | 'process')}
                >
                  <MenuItem value="approve">Approve</MenuItem>
                  <MenuItem value="reject">Reject</MenuItem>
                  <MenuItem value="process">Process Refund</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Note (Optional)"
                value={refundNote}
                onChange={(e) => setRefundNote(e.target.value)}
                placeholder="Add a note about your decision"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRefundModalOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleRefundAction} 
                variant="contained"
                disabled={processingRefund}
              >
                {processingRefund ? 'Processing...' : `${refundAction.charAt(0).toUpperCase() + refundAction.slice(1)} Refund`}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    );
  };

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
      case 'payments':
        return <PaymentManagement payments={payments} onRefresh={fetchDashboardData} />;
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1f2937',
            color: 'white',
            borderRight: '1px solid #374151',
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: 2,
          borderBottom: '1px solid #374151',
          backgroundColor: '#111827'
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #991B1B, #DC2626)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.5rem'
          }}>
            Mechanic BD Admin
          </Typography>
        </Box>
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {[
              { text: 'Dashboard', icon: <DashboardIcon />, value: 'dashboard' },
              { text: 'Users', icon: <PeopleIcon />, value: 'users' },
              { text: 'Services', icon: <BuildIcon />, value: 'services' },
              { text: 'Bookings', icon: <AssignmentIcon />, value: 'bookings' },
              { text: 'Payments', icon: <PaymentIcon />, value: 'payments' },
              { text: 'Analytics', icon: <AssessmentIcon />, value: 'analytics' },
              { text: 'Settings', icon: <SettingsIcon />, value: 'settings' },
            ].map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleMenuClick(item.value)}
                  selected={selectedMenu === item.value}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: '#991B1B',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#7F1D1D',
                      },
                    },
                    '&:hover': {
                      backgroundColor: '#374151',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: selectedMenu === item.value ? 'white' : '#9CA3AF',
                    minWidth: 40 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      '& .MuiTypography-root': {
                        fontWeight: selectedMenu === item.value ? 600 : 400,
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        {/* Top Bar */}
        <AppBar 
          position="static" 
          sx={{ 
            backgroundColor: 'white',
            color: '#1f2937',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                {selectedMenu.charAt(0).toUpperCase() + selectedMenu.slice(1)} Management
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#991B1B' }}>
                  <AccountCircleIcon />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Admin
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content Area */}
        <Box sx={{ 
          flexGrow: 1, 
          p: 3,
          backgroundColor: '#f9fafb',
          minHeight: 'calc(100vh - 64px)'
        }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '400px'
            }}>
              <CircularProgress size={60} sx={{ color: '#991B1B' }} />
            </Box>
          ) : (
            <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
              {renderContent()}
            </Box>
          )}
        </Box>
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
    </div>
  );
}

export default function AdminDashboardWrapper() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  );
} 