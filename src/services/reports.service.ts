import { apiService, ApiResponse } from './api';

export interface ReportConfig {
  title: string;
  type: 'orders' | 'clients' | 'finances' | 'inventory' | 'staff' | 'custom';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  startDate?: string;
  endDate?: string;
  filters?: Record<string, any>;
  groupBy?: string[];
  columns?: string[];
  includeCharts?: boolean;
}

export interface Report {
  _id: string;
  title: string;
  type: string;
  format: string;
  createdAt: string;
  createdBy: string;
  fileUrl: string;
  fileSize: number;
  status: 'generating' | 'completed' | 'failed';
}

class ReportsService {
  private baseEndpoint = '/reports';

  async generateReport(config: ReportConfig): Promise<ApiResponse<Report>> {
    return apiService.post(`${this.baseEndpoint}/generate`, config);
  }

  async getReports(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<{ items: Report[]; total: number }>> {
    return apiService.get(`${this.baseEndpoint}`, { page, limit });
  }

  async getReportById(id: string): Promise<ApiResponse<Report>> {
    return apiService.get(`${this.baseEndpoint}/${id}`);
  }

  async downloadReport(id: string): Promise<ApiResponse<Blob>> {
    return apiService.get(`${this.baseEndpoint}/${id}/download`);
  }

  async deleteReport(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`${this.baseEndpoint}/${id}`);
  }

  async getOrdersReport(
    startDate: string,
    endDate: string,
    format: 'pdf' | 'excel' = 'pdf'
  ): Promise<ApiResponse<Report>> {
    return this.generateReport({
      title: 'Отчёт по заказам',
      type: 'orders',
      format,
      startDate,
      endDate,
    });
  }

  async getFinancialReport(
    startDate: string,
    endDate: string,
    format: 'pdf' | 'excel' = 'pdf'
  ): Promise<ApiResponse<Report>> {
    return this.generateReport({
      title: 'Финансовый отчёт',
      type: 'finances',
      format,
      startDate,
      endDate,
      includeCharts: true,
    });
  }

  async getInventoryReport(format: 'pdf' | 'excel' = 'pdf'): Promise<ApiResponse<Report>> {
    return this.generateReport({
      title: 'Складской отчёт',
      type: 'inventory',
      format,
    });
  }

  async getStaffReport(format: 'pdf' | 'excel' = 'pdf'): Promise<ApiResponse<Report>> {
    return this.generateReport({
      title: 'Отчёт по сотрудникам',
      type: 'staff',
      format,
    });
  }

  async getCustomReport(
    title: string,
    config: Partial<ReportConfig>
  ): Promise<ApiResponse<Report>> {
    return this.generateReport({
      title,
      type: 'custom',
      format: 'pdf',
      ...config,
    });
  }

  async scheduleReport(
    config: ReportConfig,
    schedule: {
      frequency: 'daily' | 'weekly' | 'monthly';
      dayOfWeek?: number;
      dayOfMonth?: number;
      time: string;
    }
  ): Promise<ApiResponse<any>> {
    return apiService.post(`${this.baseEndpoint}/schedule`, { config, schedule });
  }

  async getScheduledReports(): Promise<ApiResponse<any[]>> {
    return apiService.get(`${this.baseEndpoint}/scheduled`);
  }

  async deleteScheduledReport(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`${this.baseEndpoint}/scheduled/${id}`);
  }
}

export const reportsService = new ReportsService();
