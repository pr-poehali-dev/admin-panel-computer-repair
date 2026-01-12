import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function Dashboard() {
  const stats = [
    { label: 'Активные заказы', value: '24', icon: 'ClipboardList', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
    { label: 'Новые клиенты', value: '12', icon: 'Users', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
    { label: 'Выполнено за день', value: '8', icon: 'CheckCircle', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
    { label: 'Ожидают запчасти', value: '5', icon: 'Package', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950' },
    { label: 'Доход за месяц', value: '₽450,000', icon: 'DollarSign', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950' },
    { label: 'Запчасти на складе', value: '247', icon: 'Warehouse', color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-950' },
  ];

  const recentOrders = [
    { id: '#1024', client: 'Иванов И.И.', device: 'MacBook Pro 2020', status: 'В работе', priority: 'Высокий' },
    { id: '#1023', client: 'Петрова М.С.', device: 'HP Pavilion', status: 'Диагностика', priority: 'Средний' },
    { id: '#1022', client: 'Сидоров А.В.', device: 'Lenovo ThinkPad', status: 'Ожидает запчастей', priority: 'Низкий' },
    { id: '#1021', client: 'Кузнецова О.П.', device: 'Dell XPS 15', status: 'Завершён', priority: 'Средний' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <Icon name={stat.icon} size={20} className={stat.color} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последние заказы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium">{order.id}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="font-medium">{order.client}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.device}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.priority === 'Высокий'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                        : order.priority === 'Средний'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                    }`}
                  >
                    {order.priority}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Завершён'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : order.status === 'В работе'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
