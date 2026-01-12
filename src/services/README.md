# API Services Documentation

Полноценный API слой для работы с MongoDB через backend для всех сущностей админ панели.

## Структура

```
src/services/
├── api.ts                    # Базовый API клиент и CRUDService
├── auth.service.ts           # Аутентификация и авторизация
├── orders.service.ts         # Управление заказами
├── clients.service.ts        # Управление клиентами
├── devices.service.ts        # Управление устройствами
├── parts.service.ts          # Управление запчастями
├── staff.service.ts          # Управление персоналом
├── services.service.ts       # Управление услугами
├── repairs.service.ts        # Управление ремонтами
├── warehouse.service.ts      # Управление складом
├── notifications.service.ts  # Уведомления
├── analytics.service.ts      # Аналитика
├── reports.service.ts        # Генерация отчётов
└── index.ts                  # Центральный экспорт
```

## Использование

### Импорт сервисов

```typescript
import { api } from '@/services';
// или
import { ordersService, clientsService } from '@/services';
```

### Базовые CRUD операции

Все сервисы наследуются от `CRUDService` и предоставляют стандартные методы:

```typescript
// Получить все записи
const response = await api.orders.getAll();
// С пагинацией и фильтрами
const response = await api.orders.getAll(
  { page: 1, limit: 20, sort: 'createdAt', order: 'desc' },
  { status: 'in_progress' }
);

// Получить одну запись
const order = await api.orders.getById('order_id');

// Создать новую запись
const newOrder = await api.orders.create({
  number: '#1025',
  client: 'Client Name',
  device: 'Device Name',
  // ...
});

// Обновить запись (полное обновление)
const updated = await api.orders.update('order_id', orderData);

// Частичное обновление
const patched = await api.orders.patch('order_id', { status: 'completed' });

// Удалить запись
await api.orders.delete('order_id');

// Массовые операции
await api.orders.bulkCreate([order1, order2, order3]);
await api.orders.bulkUpdate([
  { id: 'id1', data: { status: 'completed' } },
  { id: 'id2', data: { status: 'cancelled' } }
]);
await api.orders.bulkDelete(['id1', 'id2', 'id3']);

// Поиск
const results = await api.orders.search('MacBook', ['device', 'issue']);

// Подсчёт
const count = await api.orders.count({ status: 'completed' });
```

### Специализированные методы

#### Orders Service
```typescript
// Получить заказы по статусу
const orders = await api.orders.getByStatus('in_progress');

// Получить заказы по приоритету
const urgentOrders = await api.orders.getByPriority('high');

// Получить заказы клиента
const clientOrders = await api.orders.getByClient('client_id');

// Получить заказы техника
const techOrders = await api.orders.getByTechnician('tech_id');

// Обновить статус
await api.orders.updateStatus('order_id', 'completed');

// Получить статистику
const stats = await api.orders.getStatistics();
```

#### Clients Service
```typescript
// Получить клиентов по типу
const corporate = await api.clients.getByType('corporate');

// VIP клиенты
const vipClients = await api.clients.getVipClients();

// Поиск по email/телефону
const client = await api.clients.searchByEmail('email@example.com');

// Заказы клиента
const orders = await api.clients.getClientOrders('client_id');

// Статистика клиента
const stats = await api.clients.getClientStatistics('client_id');
```

#### Parts Service
```typescript
// Запчасти с низким остатком
const lowStock = await api.parts.getLowStock();

// Нет в наличии
const outOfStock = await api.parts.getOutOfStock();

// Обновить остаток
await api.parts.updateStock('part_id', 10, 'add'); // add | subtract | set

// История движения
const history = await api.parts.getStockHistory('part_id');

// Заказать у поставщика
await api.parts.reorderPart('part_id', 50);
```

#### Analytics Service
```typescript
// Статистика для дашборда
const dashStats = await api.analytics.getDashboardStats();

// Полная аналитика за период
const analytics = await api.analytics.getAnalyticsData(
  '2024-01-01',
  '2024-01-31'
);

// Тренд заказов
const trend = await api.analytics.getOrdersTrend('day', 30);

// Топ клиенты
const topClients = await api.analytics.getTopClients(10);

// Производительность техников
const performance = await api.analytics.getTechnicianPerformance();
```

#### Reports Service
```typescript
// Сгенерировать отчёт
const report = await api.reports.generateReport({
  title: 'Monthly Report',
  type: 'orders',
  format: 'pdf',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  includeCharts: true
});

// Готовые отчёты
const ordersReport = await api.reports.getOrdersReport(
  '2024-01-01',
  '2024-01-31',
  'excel'
);

const financialReport = await api.reports.getFinancialReport(
  '2024-01-01',
  '2024-01-31'
);

// Скачать отчёт
await api.reports.downloadReport('report_id');

// Запланировать регулярный отчёт
await api.reports.scheduleReport(reportConfig, {
  frequency: 'monthly',
  dayOfMonth: 1,
  time: '09:00'
});
```

### Использование с React Hooks

```typescript
import { useApiList } from '@/hooks/useApi';
import { ordersService } from '@/services';

function OrdersComponent() {
  const {
    items: orders,
    loading,
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
  } = useApiList(ordersService, {
    autoLoad: true,
    onSuccess: (data) => console.log('Loaded:', data),
    onError: (error) => console.error('Error:', error),
  });

  const handleCreate = async () => {
    await createItem(newOrderData);
  };

  const handleUpdate = async (id: string) => {
    await updateItem(id, { status: 'completed' });
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {orders.map(order => (
        <div key={order._id}>
          {order.number} - {order.status}
        </div>
      ))}
    </div>
  );
}
```

## Конфигурация

### API Base URL

Установите переменную окружения `VITE_API_URL`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Аутентификация

API автоматически добавляет токен из localStorage к каждому запросу:

```typescript
// Логин
const response = await api.auth.login({
  email: 'user@example.com',
  password: 'password',
  role: 'admin'
});

// Токен сохраняется автоматически
// Последующие запросы включают Authorization header

// Логаут
await api.auth.logout();
```

## Типы данных

Все сервисы используют TypeScript типы для строгой типизации:

```typescript
import type { Order, Client, Device, Part } from '@/services';

const order: Order = {
  _id: '123',
  number: '#1024',
  status: 'in_progress',
  // TypeScript проверит все поля
};
```

## Обработка ошибок

Все методы возвращают `ApiResponse<T>`:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const response = await api.orders.create(orderData);

if (response.success) {
  console.log('Success:', response.data);
} else {
  console.error('Error:', response.error);
}
```

## Доступные сервисы

- **api.auth** - Аутентификация
- **api.orders** - Заказы (13 методов)
- **api.clients** - Клиенты (12 методов)
- **api.devices** - Устройства (11 методов)
- **api.parts** - Запчасти (13 методов)
- **api.staff** - Персонал (11 методов)
- **api.services** - Услуги (10 методов)
- **api.repairs** - Ремонты (10 методов)
- **api.warehouse** - Склад (10 методов)
- **api.notifications** - Уведомления (9 методов)
- **api.analytics** - Аналитика (9 методов)
- **api.reports** - Отчёты (12 методов)

**Всего: 12 сервисов, 130+ методов API**
