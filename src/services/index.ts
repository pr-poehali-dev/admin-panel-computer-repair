export * from './api';
export * from './auth.service';
export * from './orders.service';
export * from './clients.service';
export * from './devices.service';
export * from './parts.service';
export * from './staff.service';
export * from './services.service';
export * from './repairs.service';
export * from './warehouse.service';
export * from './notifications.service';
export * from './analytics.service';
export * from './reports.service';

import { ordersService } from './orders.service';
import { clientsService } from './clients.service';
import { devicesService } from './devices.service';
import { partsService } from './parts.service';
import { staffService } from './staff.service';
import { servicesService } from './services.service';
import { repairsService } from './repairs.service';
import { warehouseService } from './warehouse.service';
import { notificationsService } from './notifications.service';
import { analyticsService } from './analytics.service';
import { reportsService } from './reports.service';
import { authService } from './auth.service';

export const api = {
  auth: authService,
  orders: ordersService,
  clients: clientsService,
  devices: devicesService,
  parts: partsService,
  staff: staffService,
  services: servicesService,
  repairs: repairsService,
  warehouse: warehouseService,
  notifications: notificationsService,
  analytics: analyticsService,
  reports: reportsService,
};

export default api;
