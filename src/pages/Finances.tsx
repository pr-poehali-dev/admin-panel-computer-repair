import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportGenerator } from '@/components/ReportGenerator';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/icon';

export default function Finances() {
  const stats = [
    { label: 'Доход за месяц', value: '₽450,000', icon: 'TrendingUp', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
    { label: 'Расходы за месяц', value: '₽180,000', icon: 'TrendingDown', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950' },
    { label: 'Чистая прибыль', value: '₽270,000', icon: 'DollarSign', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
    { label: 'Средний чек', value: '₽6,700', icon: 'TrendingUp', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950' },
  ];

  const incomeData = [
    { month: 'Янв', income: 320000, expenses: 140000 },
    { month: 'Фев', income: 280000, expenses: 130000 },
    { month: 'Мар', income: 350000, expenses: 160000 },
    { month: 'Апр', income: 420000, expenses: 170000 },
    { month: 'Май', income: 390000, expenses: 150000 },
    { month: 'Июн', income: 450000, expenses: 180000 },
  ];

  const categoryRevenue = [
    { name: 'Ремонт', value: 250000 },
    { name: 'Запчасти', value: 120000 },
    { name: 'ПО', value: 50000 },
    { name: 'Обслуживание', value: 30000 },
  ];

  const categoryColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  const recentTransactions = [
    { id: '1', description: 'Оплата за ремонт MacBook Pro', amount: 15000, type: 'income' as const, date: '10.01.2024' },
    { id: '2', description: 'Закупка запчастей у ООО "КомпТрейд"', amount: 45000, type: 'expense' as const, date: '09.01.2024' },
    { id: '3', description: 'Оплата за чистку ноутбука', amount: 1000, type: 'income' as const, date: '09.01.2024' },
    { id: '4', description: 'Аренда помещения', amount: 50000, type: 'expense' as const, date: '08.01.2024' },
    { id: '5', description: 'Оплата за установку Windows', amount: 1500, type: 'income' as const, date: '08.01.2024' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Финансы</h2>
          <p className="text-muted-foreground mt-1">Финансовая аналитика и отчётность</p>
        </div>
        <ReportGenerator
          config={{
            title: 'Финансовый отчёт',
            data: incomeData,
            columns: [
              { key: 'month', label: 'Месяц' },
              { key: 'income', label: 'Доход', aggregation: 'sum' },
              { key: 'expenses', label: 'Расходы', aggregation: 'sum' },
            ],
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Доходы за период</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Доход" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Расходы" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Распределение доходов</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryColors.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
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
          <CardTitle>Последние транзакции</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                    <Icon name={transaction.type === 'income' ? 'TrendingUp' : 'TrendingDown'} size={20} className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'} />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}₽{transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}