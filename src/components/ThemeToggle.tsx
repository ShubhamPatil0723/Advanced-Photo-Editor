'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { LightIcon, DarkIcon } from '@/assets/icons';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-7 w-14 animate-pulse rounded-full bg-muted" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative h-7 w-14 rounded-full bg-muted p-1 transition-colors duration-300 hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      role="switch"
      aria-checked={isDark}
    >
      <div
        className={`absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-md transition-transform duration-300 ${isDark ? 'translate-x-7' : 'translate-x-0'
          }`}
      >
        {isDark ? (
          <DarkIcon className="h-3 w-3 text-foreground" />
        ) : (
          <LightIcon className="h-3 w-3 text-foreground" />
        )}
      </div>

      {/* Background icons */}
      <div className="flex items-center justify-between px-1.5">
        <LightIcon
          className={`h-3 w-3 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'
            }`}
        />
        <DarkIcon
          className={`h-3 w-3 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'
            }`}
        />
      </div>
    </button>
  );
}
