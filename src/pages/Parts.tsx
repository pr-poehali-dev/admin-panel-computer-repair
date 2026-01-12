import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { EntityForm } from '@/components/EntityForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Column, FormField } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface Part {
  id: string;
  name: string;
  category: string;
  brand: string;
  partNumber: string;
  quantity: number;
  minQuantity: number;
  price: number;
  supplier: string;
  location: string;
}

export default function Parts() {
  const { toast } = useToast();
  const [parts, setParts] = useState<Part[]>([
    {
      id: '1',
      name: 'Матрица 15.6" FHD IPS',
      category: 'display',
      brand: 'LG',
      partNumber: 'LP156WF6-SPB1',
      quantity: 12,
      minQuantity: 5,
      price: 4500,
      supplier: 'ООО "КомпТрейд"',
      location: 'A-12-3',
    },
    {
      id: '2',
      name: 'SSD 512GB NVMe',
      category: 'storage',
      brand: 'Samsung',
      partNumber: '970 EVO Plus',
      quantity: 25,
      minQuantity: 10,
      price: 5200,
      supplier: 'ООО "ТехноСнаб"',
      location: 'B-05-1',
    },
    {
      id: '3',
      name: 'Клавиатура для MacBook Pro',
      category: 'keyboard',
      brand: 'Apple',
      partNumber: 'A2141-KB-RU',
      quantity: 3,
      minQuantity: 5,
      price: 8900,
      supplier: 'ООО "АплКомпоненты"',
      location: 'C-08-2',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  const columns: Column<Part>[] = [
    { key: 'name', label: 'Название', sortable: true },
    {
      key: 'category',
      label: 'Категория',
      sortable: true,
      render: (value) => {
        const categoryMap: Record<string, string> = {
          display: 'Экраны',
          storage: 'Накопители',
          keyboard: 'Клавиатуры',
          battery: 'Батареи',
          ram: 'Оперативная память',
          cooling: 'Охлаждение',
        };
        return categoryMap[value] || value;
      },
    },
    { key: 'brand', label: 'Бренд', sortable: true },
    { key: 'partNumber', label: 'Артикул', sortable: true },
    {
      key: 'quantity',
      label: 'Остаток',
      sortable: true,
      render: (value, item) => {
        const isLow = value <= item.minQuantity;
        return (
          <Badge className={isLow ? 'bg-red-500' : 'bg-green-500'}>
            {value} шт.
          </Badge>
        );
      },
    },
    {
      key: 'price',
      label: 'Цена',
      sortable: true,
      render: (value) => `₽${value.toLocaleString()}`,
    },
    { key: 'location', label: 'Место', sortable: true },
  ];

  const formFields: FormField[] = [
    { name: 'name', label: 'Название', type: 'text', required: true },
    {
      name: 'category',
      label: 'Категория',
      type: 'select',
      required: true,
      options: [
        { label: 'Экраны', value: 'display' },
        { label: 'Накопители', value: 'storage' },
        { label: 'Клавиатуры', value: 'keyboard' },
        { label: 'Батареи', value: 'battery' },
        { label: 'Оперативная память', value: 'ram' },
        { label: 'Охлаждение', value: 'cooling' },
      ],
    },
    { name: 'brand', label: 'Бренд', type: 'text', required: true },
    { name: 'partNumber', label: 'Артикул', type: 'text', required: true },
    { name: 'quantity', label: 'Количество', type: 'number', required: true },
    { name: 'minQuantity', label: 'Минимальный остаток', type: 'number', required: true },
    { name: 'price', label: 'Цена', type: 'number', required: true },
    { name: 'supplier', label: 'Поставщик', type: 'text', required: true },
    { name: 'location', label: 'Место на складе', type: 'text', required: true },
  ];

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedPart(null);
    setDialogOpen(true);
  };

  const handleEdit = (part: Part) => {
    setDialogMode('edit');
    setSelectedPart(part);
    setDialogOpen(true);
  };

  const handleView = (part: Part) => {
    setDialogMode('view');
    setSelectedPart(part);
    setDialogOpen(true);
  };

  const handleDelete = (part: Part) => {
    setParts(parts.filter((p) => p.id !== part.id));
    toast({ title: 'Запчасть удалена', description: `${part.name} успешно удалена` });
  };

  const handleSubmit = (data: Part) => {
    if (dialogMode === 'create') {
      const newPart = { ...data, id: String(parts.length + 1) };
      setParts([...parts, newPart]);
      toast({ title: 'Запчасть создана', description: `${newPart.name} успешно добавлена` });
    } else if (dialogMode === 'edit' && selectedPart) {
      setParts(parts.map((p) => (p.id === selectedPart.id ? { ...data, id: selectedPart.id } : p)));
      toast({ title: 'Запчасть обновлена', description: `${selectedPart.name} успешно обновлена` });
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Запчасти</h2>
          <p className="text-muted-foreground mt-1">Управление запчастями и комплектующими</p>
        </div>
        <Button onClick={handleCreate}>
          <Icon name="Plus" size={16} />
          Новая запчасть
        </Button>
      </div>

      <DataTable
        data={parts}
        columns={columns}
        searchKeys={['name', 'brand', 'partNumber', 'supplier']}
        filters={[
          {
            key: 'category',
            label: 'Категория',
            type: 'select',
            options: [
              { label: 'Экраны', value: 'display' },
              { label: 'Накопители', value: 'storage' },
              { label: 'Клавиатуры', value: 'keyboard' },
              { label: 'Батареи', value: 'battery' },
              { label: 'Оперативная память', value: 'ram' },
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
              {dialogMode === 'create' ? 'Создать запчасть' : dialogMode === 'edit' ? 'Редактировать запчасть' : 'Просмотр запчасти'}
            </DialogTitle>
          </DialogHeader>
          <EntityForm
            fields={formFields}
            initialData={selectedPart || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            mode={dialogMode}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
