import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Column } from '@/types';

interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  location: string;
  lastUpdated: string;
}

export default function Warehouse() {
  const [items] = useState<WarehouseItem[]>([
    { id: '1', name: 'Матрица 15.6" FHD', category: 'display', quantity: 12, minQuantity: 5, location: 'A-12-3', lastUpdated: '2024-01-10' },
    { id: '2', name: 'SSD 512GB', category: 'storage', quantity: 25, minQuantity: 10, location: 'B-05-1', lastUpdated: '2024-01-09' },
    { id: '3', name: 'Клавиатура MacBook', category: 'keyboard', quantity: 3, minQuantity: 5, location: 'C-08-2', lastUpdated: '2024-01-08' },
    { id: '4', name: 'RAM 8GB DDR4', category: 'ram', quantity: 45, minQuantity: 15, location: 'B-03-4', lastUpdated: '2024-01-10' },
  ]);

  const lowStockItems = items.filter(item => item.quantity <= item.minQuantity);
  const totalValue = 1250000;

  const columns: Column<WarehouseItem>[] = [
    { key: 'name', label: 'Название', sortable: true },
    { key: 'location', label: 'Место', sortable: true },
    {
      key: 'quantity',
      label: 'Остаток',
      sortable: true,
      render: (value, item) => (
        <Badge className={value <= item.minQuantity ? 'bg-red-500' : 'bg-green-500'}>
          {value} шт.
        </Badge>
      ),
    },
    { key: 'minQuantity', label: 'Минимум', sortable: true },
    { key: 'lastUpdated', label: 'Обновлено', sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Склад</h2>
        <p className="text-muted-foreground mt-1">Управление складскими запасами</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Всего позиций</CardTitle>
            <Icon name="Package" size={20} className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{items.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Низкий остаток</CardTitle>
            <Icon name="AlertTriangle" size={20} className="text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Общая стоимость</CardTitle>
            <Icon name="DollarSign" size={20} className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₽{totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={items}
        columns={columns}
        searchKeys={['name', 'location']}
        filters={[
          {
            key: 'category',
            label: 'Категория',
            type: 'select',
            options: [
              { label: 'Экраны', value: 'display' },
              { label: 'Накопители', value: 'storage' },
              { label: 'Клавиатуры', value: 'keyboard' },
              { label: 'Память', value: 'ram' },
            ],
          },
        ]}
      />
    </div>
  );
}
