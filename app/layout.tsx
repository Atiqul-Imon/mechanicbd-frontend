import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ThemeWrapper from '../components/ThemeWrapper';

export const metadata = {
  title: 'Mechanic BD',
  description: 'Service booking platform for Bangladesh',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ThemeWrapper>
          <AuthProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
}
