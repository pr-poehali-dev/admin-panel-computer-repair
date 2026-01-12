import { CRUDService, ApiResponse, apiService } from './api';

export interface Staff {
  _id?: string;
  name: string;
  position: 'technician' | 'manager' | 'admin';
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  salary: number;
  hireDate: string;
  status: 'active' | 'vacation' | 'fired';
  certifications?: string[];
  avatar?: string;
  notes?: string;
}

class StaffService extends CRUDService<Staff> {
  constructor() {
    super('/staff');
  }

  async getByPosition(position: Staff['position']): Promise<ApiResponse<Staff[]>> {
    return this.getAll(undefined, { position });
  }

  async getByStatus(status: Staff['status']): Promise<ApiResponse<Staff[]>> {
    return this.getAll(undefined, { status });
  }

  async getActiveStaff(): Promise<ApiResponse<Staff[]>> {
    return this.getAll(undefined, { status: 'active' });
  }

  async getTechnicians(): Promise<ApiResponse<Staff[]>> {
    return this.getAll(undefined, { position: 'technician', status: 'active' });
  }

  async getStaffOrders(staffId: string): Promise<ApiResponse<any[]>> {
    return apiService.get(`${this.baseEndpoint}/${staffId}/orders`);
  }

  async getStaffPerformance(staffId: string): Promise<ApiResponse<{
    completedOrders: number;
    averageRepairTime: number;
    customerRating: number;
    revenue: number;
  }>> {
    return apiService.get(`${this.baseEndpoint}/${staffId}/performance`);
  }

  async updateStatus(id: string, status: Staff['status']): Promise<ApiResponse<Staff>> {
    return this.patch(id, { status });
  }

  async getStaffStatistics(): Promise<ApiResponse<{
    total: number;
    byPosition: Record<string, number>;
    byStatus: Record<string, number>;
    totalSalary: number;
    averageExperience: number;
  }>> {
    return apiService.get(`${this.baseEndpoint}/statistics`);
  }
}

export const staffService = new StaffService();
