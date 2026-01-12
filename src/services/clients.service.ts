import { CRUDService, ApiResponse, apiService } from './api';

export interface Client {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'individual' | 'corporate';
  totalOrders: number;
  totalSpent: number;
  registeredAt: string;
  status: 'active' | 'vip' | 'inactive';
  notes?: string;
  companyName?: string;
  taxId?: string;
}

class ClientsService extends CRUDService<Client> {
  constructor() {
    super('/clients');
  }

  async getByType(type: Client['type']): Promise<ApiResponse<Client[]>> {
    return this.getAll(undefined, { type });
  }

  async getByStatus(status: Client['status']): Promise<ApiResponse<Client[]>> {
    return this.getAll(undefined, { status });
  }

  async getVipClients(): Promise<ApiResponse<Client[]>> {
    return this.getAll(undefined, { status: 'vip' });
  }

  async searchByEmail(email: string): Promise<ApiResponse<Client[]>> {
    return this.search(email, ['email']);
  }

  async searchByPhone(phone: string): Promise<ApiResponse<Client[]>> {
    return this.search(phone, ['phone']);
  }

  async getClientOrders(clientId: string): Promise<ApiResponse<any[]>> {
    return apiService.get(`${this.baseEndpoint}/${clientId}/orders`);
  }

  async getClientStatistics(clientId: string): Promise<ApiResponse<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate: string;
  }>> {
    return apiService.get(`${this.baseEndpoint}/${clientId}/statistics`);
  }

  async updateStatus(id: string, status: Client['status']): Promise<ApiResponse<Client>> {
    return this.patch(id, { status });
  }
}

export const clientsService = new ClientsService();
