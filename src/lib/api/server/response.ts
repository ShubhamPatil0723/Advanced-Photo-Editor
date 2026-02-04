import { get } from 'lodash';
import type { ApiResponse, ApiError } from '@/types';

export function createApiResponse<T>(
  data: T,
  options?: { message?: string; success?: boolean; status?: number }
): Response {
  const message = get(options, 'message');
  const responseBody: ApiResponse<T> = {
    data,
    ...(message && { message }),
    success: get(options, 'success', true),
    timestamp: new Date().toISOString(),
  };

  return Response.json(responseBody, {
    status: get(options, 'status', 200),
  });
}

export function createErrorResponse(
  message: string,
  options?: {
    code?: string;
    statusCode?: number;
    errors?: Record<string, string[]>;
  }
): Response {
  const statusCode = get(options, 'statusCode', 500);
  const code = get(options, 'code');
  const errors = get(options, 'errors');

  const errorBody: ApiError & { success: boolean; timestamp: string } = {
    message,
    ...(code && { code }),
    statusCode,
    ...(errors && { errors }),
    success: false,
    timestamp: new Date().toISOString(),
  };

  return Response.json(errorBody, { status: statusCode });
}

export function validateMethod(request: Request, allowedMethods: string[]): void {
  if (!allowedMethods.includes(request.method)) {
    throw new Error(`Method ${request.method} not allowed`);
  }
}

export function getAuthToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1] || null;
  return token;
}

export async function parseBody<T = any>(request: Request): Promise<T> {
  try {
    return await request.json();
  } catch {
    throw new Error('Invalid JSON body');
  }
}
