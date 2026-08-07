export const AUTH_REQUIRED_EVENT = 'auth:required';

export const notifyAuthRequired = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(AUTH_REQUIRED_EVENT));
};
