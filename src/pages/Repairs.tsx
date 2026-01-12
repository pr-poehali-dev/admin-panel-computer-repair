import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { DataExport } from '@/components/DataExport';
import { ReportGenerator } from '@/components/ReportGenerator';
import { Badge } from '@/components/ui/badge';
import { Column } from '@/types';

interface Repair {
  id: string;
  orderId: string;
  device: string;
  issue: string;
  technician: string;
  status: string;
  startDate: string;
  estimatedCompletion: string;
}

export default function Repairs() {
  const [repairs] = useState<Repair[]>([
    {
      id: '1',
      orderId: '#1024',
      device: 'MacBook Pro 2020',
      issue: 'Замена матрицы',
      technician: 'Смирнов П.А.',
      status: 'in_progress',
      startDate: '2024-01-10',
      estimatedCompletion: '2024-01-12',
    },
    {
      id: '2',
      orderId: '#1023',
      device: 'HP Pavilion',
      issue: 'Чистка от пыли',
      technician: 'Кузнецов В.И.',
      status: 'diagnostics',
      startDate: '2024-01-09',
      estimatedCompletion: '2024-01-10',
    },
    {
      id: '3',
      orderId: '#1022',
      device: 'Lenovo ThinkPad',
      issue: 'Замена клавиатуры',
      technician: 'Смирнов П.А.',
      status: 'waiting_parts',
      startDate: '2024-01-08',
      estimatedCompletion: '2024-01-14',
    },
  ]);

  const columns: Column<Repair>[] = [
    { key: 'orderId', label: 'Заказ', sortable: true },
    { key: 'device', label: 'Устройство', sortable: true },
    { key: 'issue', label: 'Проблема', sortable: true },
    { key: 'technician', label: 'Техник', sortable: true },
    {
      key: 'status',
      label: 'Статус',
      sortable: true,
      render: (value) => {
        const statusMap: Record<string, { label: string; color: string }> = {
          diagnostics: { label: 'Диагностика', color: 'bg-yellow-500' },
          in_progress: { label: 'В работе', color: 'bg-blue-500' },
          waiting_parts: { label: 'Ожидание запчастей', color: 'bg-orange-500' },
          testing: { label: 'Тестирование', color: 'bg-purple-500' },
          completed: { label: 'Завершён', color: 'bg-green-500' },
        };
        const status = statusMap[value] || statusMap.diagnostics;
        return <Badge className={status.color}>{status.label}</Badge>;
      },
    },
    { key: 'startDate', label: 'Начало', sortable: true },
    { key: 'estimatedCompletion', label: 'Завершение', sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="text-3xl font-bold">Ремонты</h2>
          <p className="text-muted-foreground mt-1">Текущие ремонтные работы</p>
        </div>
        <div className="flex gap-2">
          <DataExport data={repairs} columns={columns} filename="repairs" />
          <ReportGenerator
            config={{
              title: 'Отчёт по ремонтам',
              data: repairs,
              columns,
            }}
          />
        </div>
      </div>

      <DataTable
        data={repairs}
        columns={columns}
        searchKeys={['orderId', 'device', 'technician']}
        filters={[
          {
            key: 'status',
            label: 'Статус',
            type: 'select',
            options: [
              { label: 'Диагностика', value: 'diagnostics' },
              { label: 'В работе', value: 'in_progress' },
              { label: 'Ожидание запчастей', value: 'waiting_parts' },
              { label: 'Тестирование', value: 'testing' },
              { label: 'Завершён', value: 'completed' },
            ],
          },
        ]}
      />
    </div>
  );
}