'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="w-full max-w-md space-y-8 p-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-destructive">Something went wrong!</h1>
              <p className="text-muted-foreground">
                An unexpected error occurred. Please try again.
              </p>
              {error.digest && (
                <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>
              )}
            </div>
            <div className="space-y-4">
              <button
                onClick={reset}
                className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Try again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full rounded-md bg-secondary px-4 py-2 text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                Go to homepage
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
