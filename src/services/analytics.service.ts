import { apiService, ApiResponse } from './api';

export interface AnalyticsData {
  revenue: {
    total: number;
    byMonth: Array<{ month: string; amount: number }>;
    byService: Array<{ service: string; amount: number }>;
  };
  orders: {
    total: number;
    completed: number;
    cancelled: number;
    inProgress: number;
    byStatus: Record<string, number>;
  };
  clients: {
    total: number;
    new: number;
    returning: number;
    vip: number;
  };
  performance: {
    averageRepairTime: number;
    customerSatisfaction: number;
    completionRate: number;
  };
}

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedToday: number;
  revenue: number;
  newClients: number;
  lowStock: number;
}

class AnalyticsService {
  private baseEndpoint = '/analytics';

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return apiService.get(`${this.baseEndpoint}/dashboard`);
  }

  async getAnalyticsData(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<AnalyticsData>> {
    return apiService.get(`${this.baseEndpoint}/data`, { startDate, endDate });
  }

  async getRevenueByPeriod(
    period: 'day' | 'week' | 'month' | 'year',
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<Array<{ date: string; amount: number }>>> {
    return apiService.get(`${this.baseEndpoint}/revenue`, {
      period,
      startDate,
      endDate,
    });
  }

  async getOrdersTrend(
    period: 'day' | 'week' | 'month',
    count: number = 30
  ): Promise<ApiResponse<Array<{ date: string; count: number }>>> {
    return apiService.get(`${this.baseEndpoint}/orders-trend`, { period, count });
  }

  async getTopClients(limit: number = 10): Promise<ApiResponse<Array<{
    clientId: string;
    name: string;
    totalSpent: number;
    orderCount: number;
  }>>> {
    return apiService.get(`${this.baseEndpoint}/top-clients`, { limit });
  }

  async getTopServices(limit: number = 10): Promise<ApiResponse<Array<{
    serviceId: string;
    name: string;
    usage: number;
    revenue: number;
  }>>> {
    return apiService.get(`${this.baseEndpoint}/top-services`, { limit });
  }

  async getTechnicianPerformance(): Promise<ApiResponse<Array<{
    technicianId: string;
    name: string;
    completedOrders: number;
    averageTime: number;
    rating: number;
  }>>> {
    return apiService.get(`${this.baseEndpoint}/technician-performance`);
  }

  async getDeviceTypeDistribution(): Promise<ApiResponse<Record<string, number>>> {
    return apiService.get(`${this.baseEndpoint}/device-distribution`);
  }

  async getCustomerSatisfaction(
    period: string
  ): Promise<ApiResponse<{
    average: number;
    trend: Array<{ date: string; score: number }>;
  }>> {
    return apiService.get(`${this.baseEndpoint}/satisfaction`, { period });
  }
}

export const analyticsService = new AnalyticsService();
