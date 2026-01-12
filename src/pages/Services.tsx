import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { EntityForm } from '@/components/EntityForm';
import { PageActions } from '@/components/PageActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Column, FormField } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  isActive: boolean;
}

export default function Services() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Диагностика компьютера',
      category: 'diagnostics',
      price: 500,
      duration: 30,
      description: 'Полная диагностика состояния компьютера',
      isActive: true,
    },
    {
      id: '2',
      name: 'Замена матрицы ноутбука',
      category: 'repair',
      price: 8000,
      duration: 120,
      description: 'Замена разбитого экрана на ноутбуке',
      isActive: true,
    },
    {
      id: '3',
      name: 'Установка Windows',
      category: 'software',
      price: 1500,
      duration: 60,
      description: 'Установка операционной системы Windows 10/11',
      isActive: true,
    },
    {
      id: '4',
      name: 'Чистка от пыли',
      category: 'maintenance',
      price: 1000,
      duration: 45,
      description: 'Чистка внутренних компонентов от пыли',
      isActive: true,
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const columns: Column<Service>[] = [
    { key: 'name', label: 'Название', sortable: true },
    {
      key: 'category',
      label: 'Категория',
      sortable: true,
      render: (value) => {
        const categoryMap: Record<string, string> = {
          diagnostics: 'Диагностика',
          repair: 'Ремонт',
          software: 'ПО',
          maintenance: 'Обслуживание',
          upgrade: 'Модернизация',
        };
        return categoryMap[value] || value;
      },
    },
    {
      key: 'price',
      label: 'Цена',
      sortable: true,
      render: (value) => `₽${value.toLocaleString()}`,
    },
    {
      key: 'duration',
      label: 'Длительность',
      sortable: true,
      render: (value) => `${value} мин`,
    },
    {
      key: 'isActive',
      label: 'Статус',
      sortable: true,
      render: (value) => (
        <Badge className={value ? 'bg-green-500' : 'bg-gray-500'}>
          {value ? 'Активна' : 'Неактивна'}
        </Badge>
      ),
    },
  ];

  const formFields: FormField[] = [
    { name: 'name', label: 'Название услуги', type: 'text', required: true },
    {
      name: 'category',
      label: 'Категория',
      type: 'select',
      required: true,
      options: [
        { label: 'Диагностика', value: 'diagnostics' },
        { label: 'Ремонт', value: 'repair' },
        { label: 'Программное обеспечение', value: 'software' },
        { label: 'Обслуживание', value: 'maintenance' },
        { label: 'Модернизация', value: 'upgrade' },
      ],
    },
    { name: 'price', label: 'Цена (₽)', type: 'number', required: true },
    { name: 'duration', label: 'Длительность (мин)', type: 'number', required: true },
    { name: 'description', label: 'Описание', type: 'textarea', required: true },
    { name: 'isActive', label: 'Активна', type: 'switch', required: false },
  ];

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedService(null);
    setDialogOpen(true);
  };

  const handleEdit = (service: Service) => {
    setDialogMode('edit');
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleView = (service: Service) => {
    setDialogMode('view');
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleDelete = (service: Service) => {
    setServices(services.filter((s) => s.id !== service.id));
    toast({ title: 'Услуга удалена', description: `${service.name} успешно удалена` });
  };

  const handleSubmit = (data: Service) => {
    if (dialogMode === 'create') {
      const newService = { ...data, id: String(services.length + 1) };
      setServices([...services, newService]);
      toast({ title: 'Услуга создана', description: `${newService.name} успешно добавлена` });
    } else if (dialogMode === 'edit' && selectedService) {
      setServices(services.map((s) => (s.id === selectedService.id ? { ...data, id: selectedService.id } : s)));
      toast({ title: 'Услуга обновлена', description: `${selectedService.name} успешно обновлена` });
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Услуги</h2>
          <p className="text-muted-foreground mt-1">Каталог услуг сервисного центра</p>
        </div>
        <PageActions
          data={services}
          columns={columns}
          filename="services"
          reportTitle="Отчёт по услугам"
          onImport={(imported) => setServices([...services, ...imported.map((s, i) => ({ ...s, id: String(services.length + i + 1) }))])}
          onCreate={handleCreate}
          createLabel="Новая услуга"
          aggregations={[{ key: 'price', label: 'Цена', aggregation: 'avg' }]}
        />
      </div>

      <DataTable
        data={services}
        columns={columns}
        searchKeys={['name', 'description']}
        filters={[
          {
            key: 'category',
            label: 'Категория',
            type: 'select',
            options: [
              { label: 'Диагностика', value: 'diagnostics' },
              { label: 'Ремонт', value: 'repair' },
              { label: 'ПО', value: 'software' },
              { label: 'Обслуживание', value: 'maintenance' },
              { label: 'Модернизация', value: 'upgrade' },
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
              {dialogMode === 'create' ? 'Создать услугу' : dialogMode === 'edit' ? 'Редактировать услугу' : 'Просмотр услуги'}
            </DialogTitle>
          </DialogHeader>
          <EntityForm
            fields={formFields}
            initialData={selectedService || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            mode={dialogMode}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}