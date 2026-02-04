'use client';

import { Toaster } from 'sonner';

export default function ToasterProvider() {
  return <Toaster position="bottom-right" expand={false} richColors closeButton duration={4000} />;
}
