'use client';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Mark as client-side after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle scroll effect - only on client-side
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  // Close mobile menu when clicking outside - only on client-side
  useEffect(() => {
    if (!isClient) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('header')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen, isClient]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    // Use router instead of window.location for better UX
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <header className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-md sticky top-0 z-40 font-poppins py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <span className="text-3xl">🛠️</span>
            <span className="font-poppins text-white drop-shadow font-bold">Mechanic <span className="text-accent drop-shadow">BD</span></span>
          </div>
          <div className="animate-pulse bg-white/20 h-8 w-32 rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className={`bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-md sticky top-0 z-40 font-poppins transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight transition hover:scale-105">
          <span className="text-3xl">🛠️</span>
          <span className="font-poppins text-white drop-shadow font-bold">Mechanic <span className="text-accent drop-shadow">BD</span></span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8">
          <Link href="/services" className="px-4 py-2 rounded-lg font-medium bg-accent text-white hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105">Services</Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.role === 'customer' && (
                <Link href="/dashboard/customer" className="px-4 py-2 rounded-lg font-medium bg-accent text-white hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105">My Bookings</Link>
              )}
              {user?.role === 'mechanic' && (
                <>
                  <Link href="/dashboard/mechanic" className="px-4 py-2 rounded-lg font-medium bg-accent text-white hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105">Dashboard</Link>
                  <Link href="/services/add" className="px-4 py-2 rounded-lg font-medium bg-accent text-white hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105">Add Service</Link>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <Link href="/dashboard/admin" className="px-4 py-2 rounded-lg font-medium bg-accent text-white hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105">Admin Panel</Link>
                  <Link href="/services/add" className="px-4 py-2 rounded-lg font-medium bg-accent text-white hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105">Add Service</Link>
                </>
              )}
              {/* User Menu */}
              <div className="flex items-center gap-2 ml-2 relative group">
                <span className="text-sm font-hind text-white">Welcome, {user?.fullName}</span>
                <div className="relative group">
                  <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-accent text-white hover:bg-[var(--color-primary-dark)] hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 transform hover:scale-105">
                    <span>Account</span>
                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 transform scale-95 group-hover:scale-100">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-[var(--color-primary)] hover:bg-[var(--color-bg-light)] hover:text-accent transition-colors">Profile</Link>
                    <Link href="/bookings" className="block px-4 py-2 text-sm text-[var(--color-primary)] hover:bg-[var(--color-bg-light)] hover:text-accent transition-colors">My Bookings</Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm !text-white hover:bg-[var(--color-bg-light)] hover:text-accent transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 lg:gap-4">
              <Link href="/login" className="px-4 py-2 rounded-lg font-medium bg-accent text-white hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105">Login</Link>
              <Link 
                href="/register" 
                className="bg-accent text-[var(--color-primary-dark)] px-4 py-2 rounded-full font-semibold hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
        
        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden flex items-center px-3 py-2 rounded-lg bg-accent text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 transform hover:scale-105"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] px-4 pb-6 pt-2 space-y-2 shadow-lg">
          <Link 
            href="/services" 
            className="block py-3 px-4 font-medium bg-accent text-white rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105"
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'customer' && (
                <Link 
                  href="/dashboard/customer" 
                  className="block py-3 px-4 font-medium bg-accent text-white rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
              )}
              {user?.role === 'mechanic' && (
                <>
                  <Link 
                    href="/dashboard/mechanic" 
                    className="block py-3 px-4 font-medium bg-accent text-white rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/services/add" 
                    className="block py-3 px-4 font-medium bg-accent text-white rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Add Service
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <Link 
                    href="/dashboard/admin" 
                    className="block py-3 px-4 font-medium bg-accent text-white rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                  <Link 
                    href="/services/add" 
                    className="block py-3 px-4 font-medium bg-accent text-white rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Add Service
                  </Link>
                </>
              )}
              <Link 
                href="/profile" 
                className="block py-3 px-4 font-medium bg-accent text-white rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link 
                href="/bookings" 
                className="block py-3 px-4 font-medium bg-accent text-white rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Bookings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-3 px-4 font-medium !text-white hover:text-accent transition-all duration-200 transform hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="block py-3 px-4 font-medium bg-accent text-white rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="block py-3 px-4 font-medium bg-accent text-white rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 transform hover:scale-105"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
} 