'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 text-center">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full rounded-md bg-secondary px-6 py-3 text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
