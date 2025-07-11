import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-4">
          Page Not Found
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition-colors w-full"
          >
            Go to Homepage
          </Link>
          
          <Link
            href="/services"
            className="inline-block bg-gray-100 text-[var(--color-text-main)] px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors w-full"
          >
            Browse Services
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-[var(--color-text-muted)] mb-2">Need help?</p>
          <Link
            href="/contact"
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] text-sm font-medium transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
} 