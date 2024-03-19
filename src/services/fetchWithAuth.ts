interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export const fetchWithAuth = async (url: string, options: FetchOptions = {}): Promise<Response> => {
  const token = localStorage.getItem('token');

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers: headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
  }

  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }

  return response;
};
