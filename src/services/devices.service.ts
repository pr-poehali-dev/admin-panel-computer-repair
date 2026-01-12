import { CRUDService, ApiResponse, apiService } from './api';

export interface Device {
  _id?: string;
  type: 'laptop' | 'desktop' | 'tablet' | 'phone';
  brand: string;
  model: string;
  serialNumber: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  client: string;
  clientId?: string;
  purchaseDate: string;
  warrantyUntil: string;
  specifications?: {
    cpu?: string;
    ram?: string;
    storage?: string;
    gpu?: string;
  };
  notes?: string;
}

class DevicesService extends CRUDService<Device> {
  constructor() {
    super('/devices');
  }

  async getByType(type: Device['type']): Promise<ApiResponse<Device[]>> {
    return this.getAll(undefined, { type });
  }

  async getByBrand(brand: string): Promise<ApiResponse<Device[]>> {
    return this.getAll(undefined, { brand });
  }

  async getByCondition(condition: Device['condition']): Promise<ApiResponse<Device[]>> {
    return this.getAll(undefined, { condition });
  }

  async getByClient(clientId: string): Promise<ApiResponse<Device[]>> {
    return this.getAll(undefined, { clientId });
  }

  async searchBySerial(serialNumber: string): Promise<ApiResponse<Device[]>> {
    return this.search(serialNumber, ['serialNumber']);
  }

  async getDeviceHistory(deviceId: string): Promise<ApiResponse<any[]>> {
    return apiService.get(`${this.baseEndpoint}/${deviceId}/history`);
  }

  async updateCondition(id: string, condition: Device['condition']): Promise<ApiResponse<Device>> {
    return this.patch(id, { condition });
  }

  async getWarrantyStatus(): Promise<ApiResponse<{
    active: number;
    expired: number;
    expiringSoon: number;
  }>> {
    return apiService.get(`${this.baseEndpoint}/warranty-status`);
  }
}

export const devicesService = new DevicesService();
