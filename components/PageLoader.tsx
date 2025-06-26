import LoadingSpinner from './LoadingSpinner';

interface PageLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function PageLoader({ 
  message = 'Loading...', 
  size = 'lg',
  className = '' 
}: PageLoaderProps) {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${className}`}>
      <LoadingSpinner size={size} className="mb-4" />
      <p className="text-[var(--color-text-secondary)] font-medium">{message}</p>
    </div>
  );
} 