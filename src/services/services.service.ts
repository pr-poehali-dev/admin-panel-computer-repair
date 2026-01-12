import { CRUDService, ApiResponse, apiService } from './api';

export interface ServiceItem {
  _id?: string;
  name: string;
  category: 'diagnostics' | 'repair' | 'software' | 'maintenance' | 'upgrade';
  price: number;
  duration: number;
  description: string;
  isActive: boolean;
  popularity?: number;
  requirements?: string[];
  partsRequired?: string[];
  notes?: string;
}

class ServicesService extends CRUDService<ServiceItem> {
  constructor() {
    super('/services');
  }

  async getByCategory(category: ServiceItem['category']): Promise<ApiResponse<ServiceItem[]>> {
    return this.getAll(undefined, { category });
  }

  async getActiveServices(): Promise<ApiResponse<ServiceItem[]>> {
    return this.getAll(undefined, { isActive: true });
  }

  async getPopularServices(limit: number = 10): Promise<ApiResponse<ServiceItem[]>> {
    return apiService.get(`${this.baseEndpoint}/popular`, { limit });
  }

  async toggleActive(id: string): Promise<ApiResponse<ServiceItem>> {
    return apiService.post(`${this.baseEndpoint}/${id}/toggle-active`, {});
  }

  async updatePrice(id: string, price: number): Promise<ApiResponse<ServiceItem>> {
    return this.patch(id, { price });
  }

  async getServiceStatistics(): Promise<ApiResponse<{
    total: number;
    active: number;
    byCategory: Record<string, number>;
    averagePrice: number;
    totalRevenue: number;
  }>> {
    return apiService.get(`${this.baseEndpoint}/statistics`);
  }

  async getServiceUsage(serviceId: string): Promise<ApiResponse<{
    timesUsed: number;
    revenue: number;
    averageRating: number;
  }>> {
    return apiService.get(`${this.baseEndpoint}/${serviceId}/usage`);
  }
}

export const servicesService = new ServicesService();
