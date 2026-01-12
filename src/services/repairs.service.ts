import { CRUDService, ApiResponse, apiService } from './api';

export interface Repair {
  _id?: string;
  orderId: string;
  device: string;
  deviceId?: string;
  issue: string;
  technician: string;
  technicianId?: string;
  status: 'diagnostics' | 'in_progress' | 'waiting_parts' | 'testing' | 'completed';
  startDate: string;
  estimatedCompletion: string;
  actualCompletion?: string;
  partsUsed?: Array<{
    partId: string;
    quantity: number;
    cost: number;
  }>;
  laborCost?: number;
  totalCost?: number;
  notes?: string;
}

class RepairsService extends CRUDService<Repair> {
  constructor() {
    super('/repairs');
  }

  async getByStatus(status: Repair['status']): Promise<ApiResponse<Repair[]>> {
    return this.getAll(undefined, { status });
  }

  async getByTechnician(technicianId: string): Promise<ApiResponse<Repair[]>> {
    return this.getAll(undefined, { technicianId });
  }

  async getByOrder(orderId: string): Promise<ApiResponse<Repair[]>> {
    return this.getAll(undefined, { orderId });
  }

  async updateStatus(id: string, status: Repair['status']): Promise<ApiResponse<Repair>> {
    return this.patch(id, { status });
  }

  async addPart(repairId: string, partId: string, quantity: number): Promise<ApiResponse<Repair>> {
    return apiService.post(`${this.baseEndpoint}/${repairId}/parts`, { partId, quantity });
  }

  async removePart(repairId: string, partId: string): Promise<ApiResponse<Repair>> {
    return apiService.delete(`${this.baseEndpoint}/${repairId}/parts/${partId}`);
  }

  async completeRepair(repairId: string, notes?: string): Promise<ApiResponse<Repair>> {
    return apiService.post(`${this.baseEndpoint}/${repairId}/complete`, { notes });
  }

  async getRepairStatistics(): Promise<ApiResponse<{
    total: number;
    byStatus: Record<string, number>;
    averageCompletionTime: number;
    averageCost: number;
  }>> {
    return apiService.get(`${this.baseEndpoint}/statistics`);
  }
}

export const repairsService = new RepairsService();
