import { apiService, ApiResponse } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'technician';
  avatar?: string;
  permissions?: string[];
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
}

class AuthService {
  private baseEndpoint = '/auth';

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>(`${this.baseEndpoint}/login`, credentials);
    
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
    
    return response;
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>(`${this.baseEndpoint}/register`, data);
    
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  async logout(): Promise<void> {
    await apiService.post(`${this.baseEndpoint}/logout`, {});
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    return apiService.get(`${this.baseEndpoint}/me`);
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await apiService.post<{ token: string }>(`${this.baseEndpoint}/refresh`, {
      refreshToken,
    });
    
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response;
  }

  async updateProfile(data: Partial<AuthUser>): Promise<ApiResponse<AuthUser>> {
    return apiService.put(`${this.baseEndpoint}/profile`, data);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiService.post(`${this.baseEndpoint}/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return apiService.post(`${this.baseEndpoint}/forgot-password`, { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiService.post(`${this.baseEndpoint}/reset-password`, {
      token,
      newPassword,
    });
  }

  getStoredUser(): AuthUser | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
