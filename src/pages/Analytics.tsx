import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/icon';

export default function Analytics() {
  const performanceData = [
    { month: 'Янв', orders: 45, satisfaction: 4.5, avgRepairTime: 48 },
    { month: 'Фев', orders: 38, satisfaction: 4.3, avgRepairTime: 52 },
    { month: 'Мар', orders: 52, satisfaction: 4.6, avgRepairTime: 45 },
    { month: 'Апр', orders: 61, satisfaction: 4.7, avgRepairTime: 42 },
    { month: 'Май', orders: 58, satisfaction: 4.8, avgRepairTime: 40 },
    { month: 'Июн', orders: 67, satisfaction: 4.9, avgRepairTime: 38 },
  ];

  const technicianPerformance = [
    { name: 'Смирнов П.', completed: 45, avgTime: 38, rating: 4.9 },
    { name: 'Кузнецов В.', completed: 38, avgTime: 42, rating: 4.7 },
    { name: 'Петров А.', completed: 32, avgTime: 45, rating: 4.6 },
  ];

  const devicePopularity = [
    { category: 'MacBook', count: 28 },
    { category: 'HP', count: 22 },
    { category: 'Lenovo', count: 18 },
    { category: 'Dell', count: 15 },
    { category: 'Asus', count: 12 },
    { category: 'Другие', count: 10 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Аналитика</h2>
        <p className="text-muted-foreground mt-1">Детальный анализ работы сервисного центра</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Средняя оценка</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">4.7</div>
            <p className="text-sm text-muted-foreground mt-1">из 5.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Среднее время ремонта</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">42</div>
            <p className="text-sm text-muted-foreground mt-1">часа</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Процент завершённых</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600">94%</div>
            <p className="text-sm text-muted-foreground mt-1">успешно завершено</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Динамика показателей</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="orders" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrders)" name="Заказы" />
              <Area yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#10b981" fillOpacity={1} fill="url(#colorSatisfaction)" name="Оценка" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Производительность техников</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={technicianPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#3b82f6" name="Завершено" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Популярность брендов</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={devicePopularity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" name="Устройств" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Среднее время ремонта по месяцам</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgRepairTime" stroke="#f59e0b" strokeWidth={2} name="Часы" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
