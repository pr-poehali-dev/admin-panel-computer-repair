import { CRUDService, ApiResponse, apiService } from './api';

export interface WarehouseItem {
  _id?: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  location: string;
  lastUpdated: string;
  partId?: string;
  unit?: string;
  notes?: string;
}

export interface StockMovement {
  _id?: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  performedBy: string;
  date: string;
  notes?: string;
}

class WarehouseService extends CRUDService<WarehouseItem> {
  constructor() {
    super('/warehouse');
  }

  async getLowStock(): Promise<ApiResponse<WarehouseItem[]>> {
    return apiService.get(`${this.baseEndpoint}/low-stock`);
  }

  async getByLocation(location: string): Promise<ApiResponse<WarehouseItem[]>> {
    return this.getAll(undefined, { location });
  }

  async updateStock(
    itemId: string,
    quantity: number,
    type: 'in' | 'out' | 'adjustment',
    reason: string
  ): Promise<ApiResponse<WarehouseItem>> {
    return apiService.post(`${this.baseEndpoint}/${itemId}/stock`, {
      quantity,
      type,
      reason,
    });
  }

  async getStockMovements(itemId: string): Promise<ApiResponse<StockMovement[]>> {
    return apiService.get(`${this.baseEndpoint}/${itemId}/movements`);
  }

  async getAllMovements(
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<StockMovement[]>> {
    return apiService.get(`${this.baseEndpoint}/movements`, { startDate, endDate });
  }

  async getWarehouseStatistics(): Promise<ApiResponse<{
    totalItems: number;
    totalValue: number;
    lowStockCount: number;
    byCategory: Record<string, number>;
    byLocation: Record<string, number>;
  }>> {
    return apiService.get(`${this.baseEndpoint}/statistics`);
  }

  async generateStockReport(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<any>> {
    return apiService.get(`${this.baseEndpoint}/report`, { startDate, endDate });
  }
}

export const warehouseService = new WarehouseService();
