const computeDefaultBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin || '';
    const isLocalhost =
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('0.0.0.0');

    if (!isLocalhost) {
      return `${origin}/saiguru_industries`;
    }
  }

  return 'http://localhost:8080/saiguru_industries';
};

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || computeDefaultBaseUrl();
