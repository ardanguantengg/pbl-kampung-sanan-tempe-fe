export const API_BASE_URL = 'http://localhost:5000/api';
export const SERVER_URL = 'http://localhost:5000';

export function getFullImageUrl(imagePath?: string): string | undefined {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  return `${SERVER_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('sanan_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('sanan_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('sanan_token');
  localStorage.removeItem('sanan_user');
}

export function getStoredUser() {
  const user = localStorage.getItem('sanan_user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
  return null;
}

export function setStoredUser(user: any) {
  localStorage.setItem('sanan_user', JSON.stringify(user));
}

// Universal fetch helper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // If not FormData, set Content-Type JSON
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || `Request gagal dengan status ${response.status}`;
    const err: any = new Error(errorMsg);
    err.errors = data.errors;
    err.status = response.status;
    throw err;
  }

  return data;
}

// API Services
export const api = {
  auth: {
    login: async (body: any) => {
      const res: any = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (res.token) {
        setAuthToken(res.token);
        if (res.user) setStoredUser(res.user);
      }
      return res;
    },
    register: (body: any) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getMe: () => request('/auth/me'),
    logout: () => {
      removeAuthToken();
    },
  },

  dashboard: {
    getStats: () => request<{ success: boolean; data: any }>('/dashboard'),
  },

  stores: {
    getAll: (params?: { search?: string; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.status && params.status !== 'Semua') query.append('status', params.status);
      return request<{ success: boolean; data: any[] }>(`/stores?${query.toString()}`);
    },
    getById: (id: number | string) => request<{ success: boolean; data: any }>(`/stores/${id}`),
    create: (data: FormData | any) =>
      request<{ success: boolean; data: any }>('/stores', {
        method: 'POST',
        body: data instanceof FormData ? data : JSON.stringify(data),
      }),
    update: (id: number | string, data: FormData | any) =>
      request<{ success: boolean; data: any }>(`/stores/${id}`, {
        method: 'PUT',
        body: data instanceof FormData ? data : JSON.stringify(data),
      }),
    delete: (id: number | string) =>
      request<{ success: boolean; message: string }>(`/stores/${id}`, {
        method: 'DELETE',
      }),
  },

  products: {
    getAll: (params?: { search?: string; store_id?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.store_id) query.append('store_id', String(params.store_id));
      if (params?.status && params.status !== 'Semua') query.append('status', params.status);
      return request<{ success: boolean; data: any[] }>(`/products?${query.toString()}`);
    },
    getById: (id: number | string) => request<{ success: boolean; data: any }>(`/products/${id}`),
    getByStore: (storeId: number | string) =>
      request<{ success: boolean; data: any[] }>(`/stores/${storeId}/products`),
    create: (data: FormData | any) =>
      request<{ success: boolean; data: any }>('/products', {
        method: 'POST',
        body: data instanceof FormData ? data : JSON.stringify(data),
      }),
    update: (id: number | string, data: FormData | any) =>
      request<{ success: boolean; data: any }>(`/products/${id}`, {
        method: 'PUT',
        body: data instanceof FormData ? data : JSON.stringify(data),
      }),
    delete: (id: number | string) =>
      request<{ success: boolean; message: string }>(`/products/${id}`, {
        method: 'DELETE',
      }),
  },

  hampers: {
    getAll: (params?: { search?: string; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.status && params.status !== 'Semua') query.append('status', params.status);
      return request<{ success: boolean; data: any[] }>(`/hampers?${query.toString()}`);
    },
    getById: (id: number | string) => request<{ success: boolean; data: any }>(`/hampers/${id}`),
    create: (data: FormData | any) =>
      request<{ success: boolean; data: any }>('/hampers', {
        method: 'POST',
        body: data instanceof FormData ? data : JSON.stringify(data),
      }),
    update: (id: number | string, data: FormData | any) =>
      request<{ success: boolean; data: any }>(`/hampers/${id}`, {
        method: 'PUT',
        body: data instanceof FormData ? data : JSON.stringify(data),
      }),
    delete: (id: number | string) =>
      request<{ success: boolean; message: string }>(`/hampers/${id}`, {
        method: 'DELETE',
      }),
  },

  activity: {
    getAll: (page: number = 1, limit: number = 10) =>
      request<{ success: boolean; data: any[]; pagination: any }>(`/activity?page=${page}&limit=${limit}`),
  },
};
