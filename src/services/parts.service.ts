import { CRUDService, ApiResponse, apiService } from './api';

export interface Part {
  _id?: string;
  name: string;
  category: 'display' | 'storage' | 'keyboard' | 'battery' | 'ram' | 'cooling' | 'other';
  brand: string;
  partNumber: string;
  quantity: number;
  minQuantity: number;
  price: number;
  supplier: string;
  supplierId?: string;
  location: string;
  lastRestocked?: string;
  specifications?: Record<string, any>;
  notes?: string;
}

class PartsService extends CRUDService<Part> {
  constructor() {
    super('/parts');
  }

  async getByCategory(category: Part['category']): Promise<ApiResponse<Part[]>> {
    return this.getAll(undefined, { category });
  }

  async getByBrand(brand: string): Promise<ApiResponse<Part[]>> {
    return this.getAll(undefined, { brand });
  }

  async getLowStock(): Promise<ApiResponse<Part[]>> {
    return apiService.get(`${this.baseEndpoint}/low-stock`);
  }

  async getOutOfStock(): Promise<ApiResponse<Part[]>> {
    return apiService.get(`${this.baseEndpoint}/out-of-stock`);
  }

  async searchByPartNumber(partNumber: string): Promise<ApiResponse<Part[]>> {
    return this.search(partNumber, ['partNumber']);
  }

  async updateStock(id: string, quantity: number, operation: 'add' | 'subtract' | 'set'): Promise<ApiResponse<Part>> {
    return apiService.post(`${this.baseEndpoint}/${id}/stock`, { quantity, operation });
  }

  async getStockHistory(partId: string): Promise<ApiResponse<any[]>> {
    return apiService.get(`${this.baseEndpoint}/${partId}/stock-history`);
  }

  async getStockStatistics(): Promise<ApiResponse<{
    totalValue: number;
    totalItems: number;
    lowStockCount: number;
    outOfStockCount: number;
    byCategory: Record<string, number>;
  }>> {
    return apiService.get(`${this.baseEndpoint}/statistics`);
  }

  async reorderPart(partId: string, quantity: number): Promise<ApiResponse<any>> {
    return apiService.post(`${this.baseEndpoint}/${partId}/reorder`, { quantity });
  }
}

export const partsService = new PartsService();
