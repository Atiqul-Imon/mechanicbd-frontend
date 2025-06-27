'use client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect } from 'react';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#991B1B', // Brand deep red
    },
    secondary: {
      main: '#FFA726', // Brand accent orange
    },
    background: {
      default: '#F4F4F4', // Match Tailwind bg-light
      paper: '#FFFFFF',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#F44336',
    },
    info: {
      main: '#1e40af',
    },
  },
  typography: {
    fontFamily: `'Poppins', 'Hind Siliguri', Arial, Helvetica, sans-serif`,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0 4px 16px 0 rgba(153,27,27,0.08)',
          background: 'linear-gradient(135deg, #fff 80%, #F4F4F4 100%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: `'Poppins', Arial, Helvetica, sans-serif`,
          boxShadow: '0 2px 8px rgba(153,27,27,0.08)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: '#F4F4F4',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '1.05rem',
          color: '#991B1B',
          fontFamily: `'Poppins', Arial, Helvetica, sans-serif`,
        },
        body: {
          fontFamily: `'Poppins', Arial, Helvetica, sans-serif`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontFamily: `'Poppins', Arial, Helvetica, sans-serif`,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontFamily: `'Poppins', Arial, Helvetica, sans-serif`,
        },
      },
    },
  },
});

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  // Mark as client-side after hydration to prevent SSR/client mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render MUI components until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#F4F4F4]">
        <div className="animate-pulse">
          <div className="h-16 bg-gradient-to-br from-[#991B1B] to-[#7F1D1D]"></div>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#991B1B]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
} 