import authService from './Auth';

export class AuthRequiredError extends Error {
  constructor() {
    super('Authentication is required');
    this.name = 'AuthRequiredError';
  }
}

const withAuthorizationHeader = (init: RequestInit, token: string): RequestInit => {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return {
    ...init,
    headers,
  };
};

export async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = await authService.ensureValidAccessToken();
  if (!token) {
    throw new AuthRequiredError();
  }

  let response = await fetch(input, withAuthorizationHeader(init, token));
  if (response.status !== 401) {
    return response;
  }

  const refreshedToken = await authService.refreshToken();
  if (!refreshedToken) {
    throw new AuthRequiredError();
  }

  response = await fetch(input, withAuthorizationHeader(init, refreshedToken));
  return response;
}
