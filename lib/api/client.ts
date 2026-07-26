import 'server-only';
import { API_BASE } from '@/lib/constants';

export class ApiError extends Error {
  constructor(public status: number, public code: string | undefined, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Codul trimis de gateway când access token-ul aparține unui cont suspendat.
export const SUSPENDED_CODE = 'ACCOUNT_SUSPENDED';

/**
 * Sesiunea nu mai e validă pe o cerere autentificată — fie token respins (401),
 * fie cont suspendat (403 cu SUSPENDED_CODE). Subtip de ApiError, tratat distinct:
 * închide sesiunea + redirect la login, în loc de simplu mesaj de eroare.
 */
export class SessionExpiredError extends ApiError {
  constructor(status: number, code: string | undefined, message: string) {
    super(status, code, message);
    this.name = 'SessionExpiredError';
  }
}

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  accessToken?: string;
};

export async function apiFetch<T = unknown>(
  path: string,
  { body, accessToken, headers, cache = 'no-store', ...rest }: FetchOptions = {},
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
    cache,
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

    // Sesiune moartă pe o cerere autentificată → închide sesiunea + redirect la login.
    // Doar când avem accessToken; altfel (ex. cod OTP greșit la verify) e eroare normală.
    if (accessToken) {
      // 401: token respins de backend (expirat, semnătură invalidă, revocat).
      if (res.status === 401) {
        throw new SessionExpiredError(res.status, code, message);
      }
      // 403 + cod dedicat: cont suspendat (revocare instantă de la gateway). Distinct
      // de un 403 de autorizare obișnuit (rol/ownership greșit), care rămâne eroare normală.
      if (res.status === 403 && code === SUSPENDED_CODE) {
        throw new SessionExpiredError(res.status, code, message);
      }
    }
    throw new ApiError(res.status, code, message);
  }

  return payload as T;
}