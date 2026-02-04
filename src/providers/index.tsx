'use client';

import StoreProvider from './StoreProvider';
import ThemeProvider from './ThemeProvider';
import ToasterProvider from './ToasterProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      <ThemeProvider>
        <ToasterProvider />
        {children}
      </ThemeProvider>
    </StoreProvider>
  );
}
