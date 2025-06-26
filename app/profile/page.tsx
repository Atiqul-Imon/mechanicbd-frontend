'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { get, put } from '../../utils/api';
import ProtectedRoute from '../../components/ProtectedRoute';
import Link from 'next/link';

interface UserProfile {
  _id: string;
  fullName: string;
  email?: string;
  phoneNumber: string;
  role: 'customer' | 'mechanic' | 'admin';
  isActive: boolean;
  isVerified: boolean;
  profilePhoto?: string;
  address?: {
    street?: string;
    city?: string;
    district?: string;
    postalCode?: string;
  };
  bio?: string;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  createdAt: string;
}

interface UserStats {
  totalBookings?: number;
  completedBookings?: number;
  totalSpent?: number;
  avgRating?: number;
  totalServices?: number;
  activeServices?: number;
  totalEarnings?: number;
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user: authUser, login } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    bio: '',
    address: {
      street: '',
      city: '',
      district: '',
      postalCode: ''
    }
  });
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const [profileRes, statsRes] = await Promise.all([
          get('/users/me'),
          get('/users/me/stats')
        ]);
        
        setProfile(profileRes.data.data.user);
        setStats(statsRes.data.data.stats);
        
        setEditForm({
          fullName: profileRes.data.data.user.fullName,
          email: profileRes.data.data.user.email || '',
          bio: profileRes.data.data.user.bio || '',
          address: {
            street: profileRes.data.data.user.address?.street || '',
            city: profileRes.data.data.user.address?.city || '',
            district: profileRes.data.data.user.address?.district || '',
            postalCode: profileRes.data.data.user.address?.postalCode || ''
          }
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const response = await put('/users/me', editForm);
      setProfile(response.data.data.user);
      setIsEditing(false);
      
      if (authUser) {
        login(localStorage.getItem('token') || '', response.data.data.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Error</h2>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-warning text-white px-6 py-3 rounded-lg hover:bg-warning-light transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary font-poppins">Profile</h1>
          <p className="text-text-secondary mt-2 font-hind">Manage your account and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-background-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {profile.profilePhoto ? (
                    <img 
                      src={profile.profilePhoto} 
                      alt={profile.fullName}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {profile.fullName.charAt(0)}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold">{profile.fullName}</h2>
                <p className="text-accent capitalize">{profile.role}</p>
                {profile.isVerified && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-success">✓</span>
                    <span className="text-sm">Verified</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-text-muted">Phone</label>
                    <p className="text-text-primary">{profile.phoneNumber}</p>
                  </div>
                  {profile.email && (
                    <div>
                      <label className="text-sm font-medium text-text-muted">Email</label>
                      <p className="text-text-primary">{profile.email}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-text-muted">Member Since</label>
                    <p className="text-text-primary">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-6 bg-accent text-white py-2 rounded-lg hover:bg-accent-dark transition-colors font-medium"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.role === 'customer' && (
                <>
                  <div className="bg-background-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-text-secondary">Total Bookings</p>
                        <p className="text-lg font-semibold text-text-primary">{stats?.totalBookings || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-success/10 rounded-lg">
                        <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-text-secondary">Completed</p>
                        <p className="text-lg font-semibold text-text-primary">{stats?.completedBookings || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-text-secondary">Total Spent</p>
                        <p className="text-lg font-semibold text-text-primary">৳{stats?.totalSpent || 0}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {profile.role === 'mechanic' && (
                <>
                  <div className="bg-background-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-text-secondary">Active Services</p>
                        <p className="text-lg font-semibold text-text-primary">{stats?.activeServices || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-success/10 rounded-lg">
                        <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-text-secondary">Total Earnings</p>
                        <p className="text-lg font-semibold text-text-primary">৳{stats?.totalEarnings || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-text-secondary">Rating</p>
                        <p className="text-lg font-semibold text-text-primary">{stats?.avgRating?.toFixed(1) || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Information */}
            <div className="bg-background-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-text-primary">Profile Information</h3>
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-text-secondary border border-gray-300 rounded-lg hover:bg-background-light transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saveLoading}
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
                    >
                      {saveLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg text-warning text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-text-primary">{profile.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-text-primary">{profile.email || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-text-primary">{profile.bio || 'No bio provided'}</p>
                  )}
                </div>

                {/* Mechanic Specific Info */}
                {profile.role === 'mechanic' && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">Professional Information</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Experience (Years)
                        </label>
                        <p className="text-text-primary">{profile.experience || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Hourly Rate
                        </label>
                        <p className="text-text-primary">{profile.hourlyRate ? `৳${profile.hourlyRate}` : 'Not specified'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills && profile.skills.length > 0 ? (
                            profile.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-text-muted">No skills specified</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-background-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.role === 'customer' && (
                  <Link
                    href="/dashboard/customer"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-background-light transition-colors"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-text-primary">My Bookings</p>
                      <p className="text-sm text-text-secondary">View booking history</p>
                    </div>
                  </Link>
                )}

                {profile.role === 'mechanic' && (
                  <>
                    <Link
                      href="/dashboard/mechanic"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-background-light transition-colors"
                    >
                      <div className="p-2 bg-success/10 rounded-lg">
                        <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-text-primary">Dashboard</p>
                        <p className="text-sm text-text-secondary">View earnings & bookings</p>
                      </div>
                    </Link>
                    <Link
                      href="/services/add"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-background-light transition-colors"
                    >
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-text-primary">Add Service</p>
                        <p className="text-sm text-text-secondary">Create new service</p>
                      </div>
                    </Link>
                  </>
                )}

                {profile.role === 'admin' && (
                  <Link
                    href="/dashboard/admin"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-background-light transition-colors"
                  >
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-text-primary">Admin Panel</p>
                      <p className="text-sm text-text-secondary">Manage platform</p>
                    </div>
                  </Link>
                )}

                <Link
                  href="/services"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-background-light transition-colors"
                >
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-text-primary">Browse Services</p>
                    <p className="text-sm text-text-secondary">Find services</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 