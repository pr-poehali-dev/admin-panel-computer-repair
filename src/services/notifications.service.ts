import { CRUDService, ApiResponse, apiService } from './api';

export interface Notification {
  _id?: string;
  type: 'order' | 'warning' | 'success' | 'info' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  userId?: string;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  relatedEntity?: {
    type: string;
    id: string;
  };
}

class NotificationsService extends CRUDService<Notification> {
  constructor() {
    super('/notifications');
  }

  async getUnread(): Promise<ApiResponse<Notification[]>> {
    return this.getAll(undefined, { read: false });
  }

  async getByType(type: Notification['type']): Promise<ApiResponse<Notification[]>> {
    return this.getAll(undefined, { type });
  }

  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    return this.patch(id, { read: true });
  }

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return apiService.post(`${this.baseEndpoint}/mark-all-read`, {});
  }

  async getUnreadCount(): Promise<ApiResponse<number>> {
    return apiService.get(`${this.baseEndpoint}/unread-count`);
  }

  async deleteOld(days: number = 30): Promise<ApiResponse<void>> {
    return apiService.delete(`${this.baseEndpoint}/old?days=${days}`);
  }

  async createNotification(
    notification: Omit<Notification, '_id' | 'time' | 'read'>
  ): Promise<ApiResponse<Notification>> {
    return this.create({
      ...notification,
      time: new Date().toISOString(),
      read: false,
    } as any);
  }
}

export const notificationsService = new NotificationsService();
