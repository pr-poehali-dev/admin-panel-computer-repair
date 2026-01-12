import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/icon';

export default function Dashboard() {
  const stats = [
    { label: 'Активные заказы', value: '24', icon: 'ClipboardList', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950', change: '+12%' },
    { label: 'Новые клиенты', value: '12', icon: 'Users', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950', change: '+8%' },
    { label: 'Выполнено за день', value: '8', icon: 'CheckCircle', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950', change: '+5%' },
    { label: 'Ожидают запчасти', value: '5', icon: 'Package', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950', change: '-3%' },
    { label: 'Доход за месяц', value: '₽450,000', icon: 'DollarSign', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950', change: '+15%' },
    { label: 'Запчасти на складе', value: '247', icon: 'Warehouse', color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-950', change: '+2%' },
  ];

  const revenueData = [
    { month: 'Янв', revenue: 320000, orders: 45 },
    { month: 'Фев', revenue: 280000, orders: 38 },
    { month: 'Мар', revenue: 350000, orders: 52 },
    { month: 'Апр', revenue: 420000, orders: 61 },
    { month: 'Май', revenue: 390000, orders: 58 },
    { month: 'Июн', revenue: 450000, orders: 67 },
  ];

  const ordersByStatus = [
    { name: 'Новые', value: 12, color: '#3b82f6' },
    { name: 'Диагностика', value: 8, color: '#eab308' },
    { name: 'В работе', value: 24, color: '#a855f7' },
    { name: 'Ожидание', value: 5, color: '#f97316' },
    { name: 'Завершено', value: 156, color: '#10b981' },
  ];

  const deviceTypes = [
    { type: 'Ноутбуки', count: 45 },
    { type: 'ПК', count: 28 },
    { type: 'Планшеты', count: 15 },
    { type: 'Телефоны', count: 12 },
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
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold">{stat.value}</div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Доход и заказы по месяцам</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Доход (₽)" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Заказы" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Заказы по статусам</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Устройства по типам</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deviceTypes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8b5cf6" name="Количество" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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