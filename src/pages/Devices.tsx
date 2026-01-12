import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { EntityForm } from '@/components/EntityForm';
import { PageActions } from '@/components/PageActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Column, FormField } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface Device {
  id: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  condition: string;
  client: string;
  purchaseDate: string;
  warrantyUntil: string;
}

export default function Devices() {
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      type: 'laptop',
      brand: 'Apple',
      model: 'MacBook Pro 2020',
      serialNumber: 'C02XG0FDH7JY',
      condition: 'good',
      client: 'Иванов И.И.',
      purchaseDate: '2020-03-15',
      warrantyUntil: '2023-03-15',
    },
    {
      id: '2',
      type: 'laptop',
      brand: 'HP',
      model: 'Pavilion 15',
      serialNumber: '5CD9421PQR',
      condition: 'fair',
      client: 'Петрова М.С.',
      purchaseDate: '2019-06-20',
      warrantyUntil: '2022-06-20',
    },
    {
      id: '3',
      type: 'desktop',
      brand: 'Dell',
      model: 'OptiPlex 7080',
      serialNumber: 'DELL7080XYZ',
      condition: 'excellent',
      client: 'ООО "ТехКомпани"',
      purchaseDate: '2021-01-10',
      warrantyUntil: '2024-01-10',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const columns: Column<Device>[] = [
    {
      key: 'type',
      label: 'Тип',
      sortable: true,
      render: (value) => {
        const typeMap: Record<string, string> = {
          laptop: 'Ноутбук',
          desktop: 'Компьютер',
          tablet: 'Планшет',
          phone: 'Телефон',
        };
        return typeMap[value] || value;
      },
    },
    { key: 'brand', label: 'Бренд', sortable: true },
    { key: 'model', label: 'Модель', sortable: true },
    { key: 'serialNumber', label: 'Серийный номер', sortable: true },
    {
      key: 'condition',
      label: 'Состояние',
      sortable: true,
      render: (value) => {
        const conditionMap: Record<string, { label: string; color: string }> = {
          excellent: { label: 'Отличное', color: 'bg-green-500' },
          good: { label: 'Хорошее', color: 'bg-blue-500' },
          fair: { label: 'Удовлетворительное', color: 'bg-yellow-500' },
          poor: { label: 'Плохое', color: 'bg-red-500' },
        };
        const condition = conditionMap[value] || conditionMap.good;
        return <Badge className={condition.color}>{condition.label}</Badge>;
      },
    },
    { key: 'client', label: 'Владелец', sortable: true },
  ];

  const formFields: FormField[] = [
    {
      name: 'type',
      label: 'Тип устройства',
      type: 'select',
      required: true,
      options: [
        { label: 'Ноутбук', value: 'laptop' },
        { label: 'Компьютер', value: 'desktop' },
        { label: 'Планшет', value: 'tablet' },
        { label: 'Телефон', value: 'phone' },
      ],
    },
    { name: 'brand', label: 'Бренд', type: 'text', required: true },
    { name: 'model', label: 'Модель', type: 'text', required: true },
    { name: 'serialNumber', label: 'Серийный номер', type: 'text', required: true },
    {
      name: 'condition',
      label: 'Состояние',
      type: 'select',
      required: true,
      options: [
        { label: 'Отличное', value: 'excellent' },
        { label: 'Хорошее', value: 'good' },
        { label: 'Удовлетворительное', value: 'fair' },
        { label: 'Плохое', value: 'poor' },
      ],
    },
    { name: 'client', label: 'Владелец', type: 'text', required: true },
    { name: 'purchaseDate', label: 'Дата покупки', type: 'date', required: true },
    { name: 'warrantyUntil', label: 'Гарантия до', type: 'date', required: true },
  ];

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedDevice(null);
    setDialogOpen(true);
  };

  const handleEdit = (device: Device) => {
    setDialogMode('edit');
    setSelectedDevice(device);
    setDialogOpen(true);
  };

  const handleView = (device: Device) => {
    setDialogMode('view');
    setSelectedDevice(device);
    setDialogOpen(true);
  };

  const handleDelete = (device: Device) => {
    setDevices(devices.filter((d) => d.id !== device.id));
    toast({ title: 'Устройство удалено', description: `${device.brand} ${device.model} успешно удалено` });
  };

  const handleSubmit = (data: Device) => {
    if (dialogMode === 'create') {
      const newDevice = { ...data, id: String(devices.length + 1) };
      setDevices([...devices, newDevice]);
      toast({ title: 'Устройство создано', description: `${newDevice.brand} ${newDevice.model} успешно создано` });
    } else if (dialogMode === 'edit' && selectedDevice) {
      setDevices(devices.map((d) => (d.id === selectedDevice.id ? { ...data, id: selectedDevice.id } : d)));
      toast({ title: 'Устройство обновлено', description: `${selectedDevice.brand} ${selectedDevice.model} успешно обновлено` });
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Устройства</h2>
          <p className="text-muted-foreground mt-1">Каталог устройств в обслуживании</p>
        </div>
        <PageActions
          data={devices}
          columns={columns}
          filename="devices"
          reportTitle="Отчёт по устройствам"
          onImport={(imported) => setDevices([...devices, ...imported.map((d, i) => ({ ...d, id: String(devices.length + i + 1) }))])}
          onCreate={handleCreate}
          createLabel="Новое устройство"
        />
      </div>

      <DataTable
        data={devices}
        columns={columns}
        searchKeys={['brand', 'model', 'serialNumber', 'client']}
        filters={[
          {
            key: 'type',
            label: 'Тип',
            type: 'select',
            options: [
              { label: 'Ноутбук', value: 'laptop' },
              { label: 'Компьютер', value: 'desktop' },
              { label: 'Планшет', value: 'tablet' },
            ],
          },
          {
            key: 'condition',
            label: 'Состояние',
            type: 'select',
            options: [
              { label: 'Отличное', value: 'excellent' },
              { label: 'Хорошее', value: 'good' },
              { label: 'Удовлетворительное', value: 'fair' },
              { label: 'Плохое', value: 'poor' },
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
              {dialogMode === 'create'
                ? 'Создать устройство'
                : dialogMode === 'edit'
                ? 'Редактировать устройство'
                : 'Просмотр устройства'}
            </DialogTitle>
          </DialogHeader>
          <EntityForm
            fields={formFields}
            initialData={selectedDevice || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            mode={dialogMode}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}