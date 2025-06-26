'use client';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    window.location.href = '/';
  };

  return (
    <header className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-md sticky top-0 z-40 font-poppins">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight transition">
          <span className="text-3xl">🛠️</span>
          <span className="font-poppins text-white drop-shadow font-bold">Mechanic <span className="text-accent drop-shadow">BD</span></span>
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8">
          <Link href="/services" className="px-4 py-2 rounded-lg font-medium bg-accent text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Services</Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.role === 'customer' && (
                <Link href="/dashboard/customer" className="px-4 py-2 rounded-lg font-medium bg-accent text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] hover:text-accent transition">My Bookings</Link>
              )}
              {user?.role === 'mechanic' && (
                <>
                  <Link href="/dashboard/mechanic" className="px-4 py-2 rounded-lg font-medium bg-accent text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Dashboard</Link>
                  <Link href="/services/add" className="px-4 py-2 rounded-lg font-medium bg-accent text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Add Service</Link>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <Link href="/dashboard/admin" className="px-4 py-2 rounded-lg font-medium bg-accent text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Admin Panel</Link>
                  <Link href="/services/add" className="px-4 py-2 rounded-lg font-medium bg-accent text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Add Service</Link>
                </>
              )}
              {/* User Menu */}
              <div className="flex items-center gap-2 ml-2 relative group">
                <span className="text-sm font-hind text-white">Welcome, {user?.fullName}</span>
                <div className="relative group">
                  <button className="flex items-center gap-1 px-2 py-1 rounded bg-accent text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent transition">
                    <span>Account</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-[var(--color-primary)] hover:bg-background-light hover:text-accent">Profile</Link>
                    <Link href="/bookings" className="block px-4 py-2 text-sm text-[var(--color-primary)] hover:bg-background-light hover:text-accent">My Bookings</Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-warning hover:bg-background-light hover:text-accent"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 lg:gap-4">
              <Link href="/login" className="px-4 py-2 rounded-lg font-medium bg-accent text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Login</Link>
              <Link 
                href="/register" 
                className="bg-accent text-[var(--color-primary-dark)] px-4 py-2 rounded-full font-semibold hover:bg-[var(--color-primary-dark)] hover:text-accent transition"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden flex items-center px-2 py-1 rounded bg-accent text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] px-4 pb-4 pt-2 space-y-2 shadow-lg">
          <Link href="/services" className="block py-2 font-medium bg-accent text-[var(--color-primary-dark)] rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Services</Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'customer' && (
                <Link href="/dashboard/customer" className="block py-2 font-medium bg-accent text-[var(--color-primary-dark)] rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition">My Bookings</Link>
              )}
              {user?.role === 'mechanic' && (
                <>
                  <Link href="/dashboard/mechanic" className="block py-2 font-medium bg-accent text-[var(--color-primary-dark)] rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Dashboard</Link>
                  <Link href="/services/add" className="block py-2 font-medium bg-accent text-[var(--color-primary-dark)] rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Add Service</Link>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <Link href="/dashboard/admin" className="block py-2 font-medium bg-accent text-[var(--color-primary-dark)] rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Admin Panel</Link>
                  <Link href="/services/add" className="block py-2 font-medium bg-accent text-[var(--color-primary-dark)] rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Add Service</Link>
                </>
              )}
              <Link href="/profile" className="block py-2 font-medium bg-accent text-[var(--color-primary-dark)] rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Profile</Link>
              <Link href="/bookings" className="block py-2 font-medium bg-accent text-[var(--color-primary-dark)] rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition">My Bookings</Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 font-medium text-warning hover:text-accent transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 font-medium bg-accent text-[var(--color-primary-dark)] rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Login</Link>
              <Link href="/register" className="block py-2 font-medium bg-accent text-[var(--color-primary-dark)] rounded-full text-center hover:bg-[var(--color-primary-dark)] hover:text-accent transition">Register</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
} 