import { createApiResponse } from '@/lib/api/server';

export async function GET() {
  return createApiResponse({ status: 'ok' }, { message: 'Service is healthy' });
}
