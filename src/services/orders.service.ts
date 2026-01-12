import { CRUDService, ApiResponse } from './api';

export interface Order {
  _id?: string;
  number: string;
  client: string;
  clientId?: string;
  device: string;
  deviceId?: string;
  issue: string;
  status: 'new' | 'diagnostics' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  technician: string;
  technicianId?: string;
  createdAt: string;
  updatedAt?: string;
  cost: number;
  estimatedCompletion?: string;
  notes?: string;
}

class OrdersService extends CRUDService<Order> {
  constructor() {
    super('/orders');
  }

  async getByStatus(status: Order['status']): Promise<ApiResponse<Order[]>> {
    return this.getAll(undefined, { status });
  }

  async getByPriority(priority: Order['priority']): Promise<ApiResponse<Order[]>> {
    return this.getAll(undefined, { priority });
  }

  async getByClient(clientId: string): Promise<ApiResponse<Order[]>> {
    return this.getAll(undefined, { clientId });
  }

  async getByTechnician(technicianId: string): Promise<ApiResponse<Order[]>> {
    return this.getAll(undefined, { technicianId });
  }

  async updateStatus(id: string, status: Order['status']): Promise<ApiResponse<Order>> {
    return this.patch(id, { status });
  }

  async getStatistics(): Promise<ApiResponse<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    totalRevenue: number;
    averageCost: number;
  }>> {
    return this.apiService.get(`${this.baseEndpoint}/statistics`);
  }

  private get apiService() {
    return (this as any).constructor.prototype.apiService || require('./api').apiService;
  }
}

export const ordersService = new OrdersService();
