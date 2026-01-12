import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { EntityForm } from '@/components/EntityForm';
import { PageActions } from '@/components/PageActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Column, FormField } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  totalOrders: number;
  totalSpent: number;
  registeredAt: string;
  status: string;
}

export default function Clients() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Иванов Иван Иванович',
      email: 'ivanov@mail.ru',
      phone: '+7 (999) 123-45-67',
      address: 'г. Москва, ул. Ленина, д. 10',
      type: 'individual',
      totalOrders: 5,
      totalSpent: 45000,
      registeredAt: '2023-05-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Петрова Мария Сергеевна',
      email: 'petrova@gmail.com',
      phone: '+7 (999) 234-56-78',
      address: 'г. Санкт-Петербург, пр. Невский, д. 25',
      type: 'individual',
      totalOrders: 2,
      totalSpent: 12000,
      registeredAt: '2023-08-20',
      status: 'active',
    },
    {
      id: '3',
      name: 'ООО "ТехКомпани"',
      email: 'info@techcompany.ru',
      phone: '+7 (495) 123-45-67',
      address: 'г. Москва, ул. Тверская, д. 5',
      type: 'corporate',
      totalOrders: 15,
      totalSpent: 250000,
      registeredAt: '2023-01-10',
      status: 'vip',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const columns: Column<Client>[] = [
    { key: 'name', label: 'Имя', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Телефон', sortable: true },
    {
      key: 'type',
      label: 'Тип',
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'corporate' ? 'default' : 'secondary'}>
          {value === 'corporate' ? 'Юр. лицо' : 'Физ. лицо'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Статус',
      sortable: true,
      render: (value) => {
        const statusMap: Record<string, { label: string; color: string }> = {
          active: { label: 'Активный', color: 'bg-green-500' },
          vip: { label: 'VIP', color: 'bg-purple-500' },
          inactive: { label: 'Неактивный', color: 'bg-gray-500' },
        };
        const status = statusMap[value] || statusMap.active;
        return <Badge className={status.color}>{status.label}</Badge>;
      },
    },
    { key: 'totalOrders', label: 'Заказов', sortable: true },
    {
      key: 'totalSpent',
      label: 'Потрачено',
      sortable: true,
      render: (value) => `₽${value.toLocaleString()}`,
    },
  ];

  const formFields: FormField[] = [
    { name: 'name', label: 'Имя / Название', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Телефон', type: 'text', required: true },
    { name: 'address', label: 'Адрес', type: 'textarea', required: true },
    {
      name: 'type',
      label: 'Тип клиента',
      type: 'select',
      required: true,
      options: [
        { label: 'Физическое лицо', value: 'individual' },
        { label: 'Юридическое лицо', value: 'corporate' },
      ],
    },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      required: true,
      options: [
        { label: 'Активный', value: 'active' },
        { label: 'VIP', value: 'vip' },
        { label: 'Неактивный', value: 'inactive' },
      ],
    },
    { name: 'registeredAt', label: 'Дата регистрации', type: 'date', required: true },
  ];

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedClient(null);
    setDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setDialogMode('edit');
    setSelectedClient(client);
    setDialogOpen(true);
  };

  const handleView = (client: Client) => {
    setDialogMode('view');
    setSelectedClient(client);
    setDialogOpen(true);
  };

  const handleDelete = (client: Client) => {
    setClients(clients.filter((c) => c.id !== client.id));
    toast({ title: 'Клиент удалён', description: `Клиент ${client.name} успешно удалён` });
  };

  const handleSubmit = (data: Client) => {
    if (dialogMode === 'create') {
      const newClient = {
        ...data,
        id: String(clients.length + 1),
        totalOrders: 0,
        totalSpent: 0,
      };
      setClients([...clients, newClient]);
      toast({ title: 'Клиент создан', description: `Клиент ${newClient.name} успешно создан` });
    } else if (dialogMode === 'edit' && selectedClient) {
      setClients(
        clients.map((c) =>
          c.id === selectedClient.id
            ? { ...data, id: selectedClient.id, totalOrders: selectedClient.totalOrders, totalSpent: selectedClient.totalSpent }
            : c
        )
      );
      toast({ title: 'Клиент обновлён', description: `Клиент ${selectedClient.name} успешно обновлён` });
    }
    setDialogOpen(false);
  };

  const handleImport = (importedClients: Client[]) => {
    const newClients = importedClients.map((client, index) => ({
      ...client,
      id: String(clients.length + index + 1),
      totalOrders: client.totalOrders || 0,
      totalSpent: client.totalSpent || 0,
    }));
    setClients([...clients, ...newClients]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Клиенты</h2>
          <p className="text-muted-foreground mt-1">База клиентов сервисного центра</p>
        </div>
        <PageActions
          data={clients}
          columns={columns}
          filename="clients"
          reportTitle="Отчёт по клиентам"
          onImport={handleImport}
          onCreate={handleCreate}
          createLabel="Новый клиент"
          aggregations={[{ key: 'totalSpent', label: 'Потрачено', aggregation: 'sum' }]}
        />
      </div>

      <DataTable
        data={clients}
        columns={columns}
        searchKeys={['name', 'email', 'phone']}
        filters={[
          {
            key: 'type',
            label: 'Тип',
            type: 'select',
            options: [
              { label: 'Физ. лицо', value: 'individual' },
              { label: 'Юр. лицо', value: 'corporate' },
            ],
          },
          {
            key: 'status',
            label: 'Статус',
            type: 'select',
            options: [
              { label: 'Активный', value: 'active' },
              { label: 'VIP', value: 'vip' },
              { label: 'Неактивный', value: 'inactive' },
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
              {dialogMode === 'create' ? 'Создать клиента' : dialogMode === 'edit' ? 'Редактировать клиента' : 'Просмотр клиента'}
            </DialogTitle>
          </DialogHeader>
          <EntityForm
            fields={formFields}
            initialData={selectedClient || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            mode={dialogMode}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}