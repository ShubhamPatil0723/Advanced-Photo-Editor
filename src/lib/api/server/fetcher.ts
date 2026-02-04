import { get } from 'lodash';
import type { ApiResponse, ApiError } from '@/types';

interface FetcherOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
}

interface FetcherResult<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

/**
 * @param url - API endpoint URL
 * @param options - Fetch options with Next.js enhancements
 * @returns Typed response with data or error
 */
export async function fetcher<T = any>(
  url: string,
  options?: FetcherOptions
): Promise<FetcherResult<T>> {
  // Return mock response during build to avoid network requests in private networks
  if (process.env['IS_BUILD']) {
    return {
      data: null as T,
      success: true,
    };
  }

  try {
    const revalidate = get(options, 'revalidate');
    const tags = get(options, 'tags');

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...get(options, 'headers'),
      },
      ...(!!revalidate || !!tags
        ? {
          next: {
            ...(!!revalidate && { revalidate }),
            ...(!!tags && { tags }),
          },
        }
        : {}),
    });

    if (!response.ok) {
      let errorData: ApiError;

      try {
        const jsonError = await response.json();
        errorData = {
          message: get(jsonError, 'message', response.statusText),
          code: get(jsonError, 'code'),
          statusCode: response.status,
          errors: get(jsonError, 'errors'),
        };
      } catch {
        errorData = {
          message: response.statusText || 'Request failed',
          statusCode: response.status,
        };
      }

      return {
        error: errorData,
        success: false,
      };
    }

    const jsonData: ApiResponse<T> = await response.json();

    return {
      data: get(jsonData, 'data'),
      success: get(jsonData, 'success', true),
    };
  } catch (error: any) {
    const errorMessage = get(error, 'message', 'Network error occurred');

    return {
      error: {
        message: errorMessage,
        code: 'FETCH_ERROR',
      },
      success: false,
    };
  }
}

export async function fetcherGet<T = any>(
  url: string,
  options?: Omit<FetcherOptions, 'method' | 'body'>
): Promise<FetcherResult<T>> {
  return fetcher<T>(url, { ...options, method: 'GET' });
}

export async function fetcherPost<T = any>(
  url: string,
  data?: any,
  options?: Omit<FetcherOptions, 'method' | 'body'>
): Promise<FetcherResult<T>> {
  return fetcher<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}
