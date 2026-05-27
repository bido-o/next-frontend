import { API_BASE } from '@/lib/constants';

export class ApiError extends Error {
  constructor(public status: number, public code: string | undefined, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  accessToken?: string;
};

export async function apiFetch<T = unknown>(
  path: string,
  { body, accessToken, headers, ...rest }: FetchOptions = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  const isJson = (res.headers.get('content-type') ?? '').includes('application/json');
  const payload: unknown = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message = isJson && payload && typeof payload === 'object' && 'message' in payload
                    ? String((payload as Record<string, unknown>).message)
                    : typeof payload === 'string' && payload
                      ? payload
                      : `Request failed (${res.status})`;
    const code = isJson && payload && typeof payload === 'object' && 'code' in payload
                      ? String((payload as Record<string, unknown>).code)
                      : undefined;
                  throw new ApiError(res.status, code, message);
  }

  return payload as T;
}