import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { EntityForm } from '@/components/EntityForm';
import { PageActions } from '@/components/PageActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Column, FormField } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  number: string;
  client: string;
  device: string;
  issue: string;
  status: string;
  priority: string;
  technician: string;
  createdAt: string;
  cost: number;
}

export default function Orders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      number: '#1024',
      client: 'Иванов Иван Иванович',
      device: 'MacBook Pro 2020',
      issue: 'Не включается, требуется диагностика',
      status: 'in_progress',
      priority: 'high',
      technician: 'Смирнов П.А.',
      createdAt: '2024-01-10',
      cost: 15000,
    },
    {
      id: '2',
      number: '#1023',
      client: 'Петрова Мария Сергеевна',
      device: 'HP Pavilion',
      issue: 'Перегревается, требуется чистка',
      status: 'diagnostics',
      priority: 'medium',
      technician: 'Кузнецов В.И.',
      createdAt: '2024-01-09',
      cost: 3000,
    },
    {
      id: '3',
      number: '#1022',
      client: 'Сидоров Андрей Владимирович',
      device: 'Lenovo ThinkPad',
      issue: 'Разбит экран',
      status: 'waiting_parts',
      priority: 'low',
      technician: 'Смирнов П.А.',
      createdAt: '2024-01-08',
      cost: 8000,
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const columns: Column<Order>[] = [
    { key: 'number', label: 'Номер', sortable: true },
    { key: 'client', label: 'Клиент', sortable: true },
    { key: 'device', label: 'Устройство', sortable: true },
    {
      key: 'status',
      label: 'Статус',
      sortable: true,
      render: (value) => {
        const statusMap: Record<string, { label: string; color: string }> = {
          new: { label: 'Новый', color: 'bg-blue-500' },
          diagnostics: { label: 'Диагностика', color: 'bg-yellow-500' },
          in_progress: { label: 'В работе', color: 'bg-purple-500' },
          waiting_parts: { label: 'Ожидание запчастей', color: 'bg-orange-500' },
          completed: { label: 'Завершён', color: 'bg-green-500' },
          cancelled: { label: 'Отменён', color: 'bg-red-500' },
        };
        const status = statusMap[value] || { label: value, color: 'bg-gray-500' };
        return <Badge className={status.color}>{status.label}</Badge>;
      },
    },
    {
      key: 'priority',
      label: 'Приоритет',
      sortable: true,
      render: (value) => {
        const priorityMap: Record<string, { label: string; color: string }> = {
          low: { label: 'Низкий', color: 'bg-green-500' },
          medium: { label: 'Средний', color: 'bg-yellow-500' },
          high: { label: 'Высокий', color: 'bg-red-500' },
        };
        const priority = priorityMap[value] || { label: value, color: 'bg-gray-500' };
        return <Badge className={priority.color}>{priority.label}</Badge>;
      },
    },
    { key: 'technician', label: 'Техник', sortable: true },
    {
      key: 'cost',
      label: 'Стоимость',
      sortable: true,
      render: (value) => `₽${value.toLocaleString()}`,
    },
  ];

  const formFields: FormField[] = [
    { name: 'client', label: 'Клиент', type: 'text', required: true },
    { name: 'device', label: 'Устройство', type: 'text', required: true },
    { name: 'issue', label: 'Проблема', type: 'textarea', required: true },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      required: true,
      options: [
        { label: 'Новый', value: 'new' },
        { label: 'Диагностика', value: 'diagnostics' },
        { label: 'В работе', value: 'in_progress' },
        { label: 'Ожидание запчастей', value: 'waiting_parts' },
        { label: 'Завершён', value: 'completed' },
        { label: 'Отменён', value: 'cancelled' },
      ],
    },
    {
      name: 'priority',
      label: 'Приоритет',
      type: 'select',
      required: true,
      options: [
        { label: 'Низкий', value: 'low' },
        { label: 'Средний', value: 'medium' },
        { label: 'Высокий', value: 'high' },
      ],
    },
    { name: 'technician', label: 'Техник', type: 'text', required: true },
    { name: 'cost', label: 'Стоимость', type: 'number', required: true },
    { name: 'createdAt', label: 'Дата создания', type: 'date', required: true },
  ];

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedOrder(null);
    setDialogOpen(true);
  };

  const handleEdit = (order: Order) => {
    setDialogMode('edit');
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleView = (order: Order) => {
    setDialogMode('view');
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleDelete = (order: Order) => {
    setOrders(orders.filter((o) => o.id !== order.id));
    toast({ title: 'Заказ удалён', description: `Заказ ${order.number} успешно удалён` });
  };

  const handleSubmit = (data: Order) => {
    if (dialogMode === 'create') {
      const newOrder = {
        ...data,
        id: String(orders.length + 1),
        number: `#${1024 + orders.length}`,
      };
      setOrders([...orders, newOrder]);
      toast({ title: 'Заказ создан', description: `Заказ ${newOrder.number} успешно создан` });
    } else if (dialogMode === 'edit' && selectedOrder) {
      setOrders(orders.map((o) => (o.id === selectedOrder.id ? { ...data, id: selectedOrder.id, number: selectedOrder.number } : o)));
      toast({ title: 'Заказ обновлён', description: `Заказ ${selectedOrder.number} успешно обновлён` });
    }
    setDialogOpen(false);
  };

  const handleImport = (importedOrders: Order[]) => {
    const newOrders = importedOrders.map((order, index) => ({
      ...order,
      id: String(orders.length + index + 1),
      number: order.number || `#${1024 + orders.length + index}`,
    }));
    setOrders([...orders, ...newOrders]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Заказы</h2>
          <p className="text-muted-foreground mt-1">Управление заказами на ремонт</p>
        </div>
        <PageActions
          data={orders}
          columns={columns}
          filename="orders"
          reportTitle="Отчёт по заказам"
          onImport={handleImport}
          onCreate={handleCreate}
          createLabel="Новый заказ"
          aggregations={[{ key: 'cost', label: 'Стоимость', aggregation: 'sum' }]}
        />
      </div>

      <DataTable
        data={orders}
        columns={columns}
        searchKeys={['number', 'client', 'device']}
        filters={[
          {
            key: 'status',
            label: 'Статус',
            type: 'select',
            options: [
              { label: 'Новый', value: 'new' },
              { label: 'Диагностика', value: 'diagnostics' },
              { label: 'В работе', value: 'in_progress' },
              { label: 'Ожидание запчастей', value: 'waiting_parts' },
              { label: 'Завершён', value: 'completed' },
            ],
          },
          {
            key: 'priority',
            label: 'Приоритет',
            type: 'select',
            options: [
              { label: 'Низкий', value: 'low' },
              { label: 'Средний', value: 'medium' },
              { label: 'Высокий', value: 'high' },
            ],
          },
        ]}
        actions={[
          { label: 'Просмотр', icon: 'Eye', onClick: handleView, variant: 'outline' },
          { label: 'Изменить', icon: 'Edit', onClick: handleEdit, variant: 'default', permission: ['admin', 'manager'] },
          { label: 'Удалить', icon: 'Trash2', onClick: handleDelete, variant: 'destructive', permission: ['admin'] },
        ]}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Создать заказ' : dialogMode === 'edit' ? 'Редактировать заказ' : 'Просмотр заказа'}
            </DialogTitle>
          </DialogHeader>
          <EntityForm
            fields={formFields}
            initialData={selectedOrder || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            mode={dialogMode}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}