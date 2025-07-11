import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ThemeWrapper from '../components/ThemeWrapper';
import ErrorBoundary from '../components/ErrorBoundary';
import { Suspense } from 'react';

export const metadata = {
  title: 'Mechanic BD - আপনার নির্ভরযোগ্য মেকানিক এবং হোম সার্ভিস প্ল্যাটফর্ম',
  description: 'Connect with qualified mechanics for vehicle maintenance and repair services across Bangladesh. Book reliable auto services online.',
  keywords: 'mechanic, auto service, car repair, vehicle maintenance, Bangladesh, automotive',
  authors: [{ name: 'Mechanic BD Team' }],
  creator: 'Mechanic BD',
  publisher: 'Mechanic BD',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mechanic BD - আপনার নির্ভরযোগ্য মেকানিক এবং হোম সার্ভিস প্ল্যাটফর্ম',
    description: 'Connect with qualified mechanics for vehicle maintenance and repair services across Bangladesh.',
    url: '/',
    siteName: 'Mechanic BD',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mechanic BD - আপনার নির্ভরযোগ্য মেকানিক এবং হোম সার্ভিস প্ল্যাটফর্ম',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mechanic BD - আপনার নির্ভরযোগ্য মেকানিক এবং হোম সার্ভিস প্ল্যাটফর্ম',
    description: 'Connect with qualified mechanics for vehicle maintenance and repair services across Bangladesh.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
        <p className="text-[var(--color-text-secondary)] font-medium">Loading Mechanic BD...</p>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Performance and UX */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#991B1B" />
        <meta name="color-scheme" content="light" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <ThemeWrapper>
            <Suspense fallback={<LoadingFallback />}>
              <AuthProvider>
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </AuthProvider>
            </Suspense>
          </ThemeWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
