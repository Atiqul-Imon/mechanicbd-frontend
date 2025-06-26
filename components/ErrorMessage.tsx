import Link from 'next/link';

interface ErrorMessageProps {
  title?: string;
  message: string;
  icon?: string;
  showBackButton?: boolean;
  backUrl?: string;
  backText?: string;
  className?: string;
}

export default function ErrorMessage({
  title = 'Error',
  message,
  icon = '❌',
  showBackButton = true,
  backUrl = '/',
  backText = 'Go Back',
  className = ''
}: ErrorMessageProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-xl font-semibold text-[var(--color-text-main)] mb-2">{title}</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">{message}</p>
        {showBackButton && (
          <Link 
            href={backUrl}
            className="inline-block bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            {backText}
          </Link>
        )}
      </div>
    </div>
  );
} 