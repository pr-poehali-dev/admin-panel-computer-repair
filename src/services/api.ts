const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: any;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('authToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

export abstract class CRUDService<T extends { _id?: string }> {
  protected baseEndpoint: string;

  constructor(endpoint: string) {
    this.baseEndpoint = endpoint;
  }

  async getAll(
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Promise<ApiResponse<{ items: T[]; total: number; page: number; totalPages: number }>> {
    const params = {
      ...pagination,
      ...filters,
    };
    return apiService.get(`${this.baseEndpoint}`, params);
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    return apiService.get(`${this.baseEndpoint}/${id}`);
  }

  async create(data: Omit<T, '_id'>): Promise<ApiResponse<T>> {
    return apiService.post(`${this.baseEndpoint}`, data);
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    return apiService.put(`${this.baseEndpoint}/${id}`, data);
  }

  async patch(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    return apiService.patch(`${this.baseEndpoint}/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`${this.baseEndpoint}/${id}`);
  }

  async bulkCreate(items: Omit<T, '_id'>[]): Promise<ApiResponse<T[]>> {
    return apiService.post(`${this.baseEndpoint}/bulk`, items);
  }

  async bulkUpdate(updates: { id: string; data: Partial<T> }[]): Promise<ApiResponse<T[]>> {
    return apiService.put(`${this.baseEndpoint}/bulk`, updates);
  }

  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    return apiService.post(`${this.baseEndpoint}/bulk-delete`, { ids });
  }

  async search(query: string, fields: string[]): Promise<ApiResponse<T[]>> {
    return apiService.get(`${this.baseEndpoint}/search`, { query, fields: fields.join(',') });
  }

  async count(filters?: FilterParams): Promise<ApiResponse<number>> {
    return apiService.get(`${this.baseEndpoint}/count`, filters);
  }
}
