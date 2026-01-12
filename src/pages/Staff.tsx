import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { EntityForm } from '@/components/EntityForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Column, FormField } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface Staff {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  salary: number;
  hireDate: string;
  status: string;
}

export default function Staff() {
  const { toast } = useToast();
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: '1',
      name: 'Смирнов Петр Александрович',
      position: 'technician',
      email: 'smirnov@techrepair.ru',
      phone: '+7 (999) 111-22-33',
      specialization: 'Apple',
      experience: 5,
      salary: 80000,
      hireDate: '2019-03-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Кузнецов Владимир Игоревич',
      position: 'technician',
      email: 'kuznetsov@techrepair.ru',
      phone: '+7 (999) 222-33-44',
      specialization: 'Windows/Linux',
      experience: 3,
      salary: 65000,
      hireDate: '2021-06-20',
      status: 'active',
    },
    {
      id: '3',
      name: 'Иванова Анна Сергеевна',
      position: 'manager',
      email: 'ivanova@techrepair.ru',
      phone: '+7 (999) 333-44-55',
      specialization: 'Управление',
      experience: 7,
      salary: 95000,
      hireDate: '2017-01-10',
      status: 'active',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const columns: Column<Staff>[] = [
    { key: 'name', label: 'ФИО', sortable: true },
    {
      key: 'position',
      label: 'Должность',
      sortable: true,
      render: (value) => {
        const positionMap: Record<string, { label: string; color: string }> = {
          technician: { label: 'Техник', color: 'bg-blue-500' },
          manager: { label: 'Менеджер', color: 'bg-purple-500' },
          admin: { label: 'Администратор', color: 'bg-red-500' },
        };
        const position = positionMap[value] || positionMap.technician;
        return <Badge className={position.color}>{position.label}</Badge>;
      },
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Телефон', sortable: true },
    { key: 'specialization', label: 'Специализация', sortable: true },
    { key: 'experience', label: 'Опыт (лет)', sortable: true },
    {
      key: 'salary',
      label: 'Зарплата',
      sortable: true,
      render: (value) => `₽${value.toLocaleString()}`,
    },
  ];

  const formFields: FormField[] = [
    { name: 'name', label: 'ФИО', type: 'text', required: true },
    {
      name: 'position',
      label: 'Должность',
      type: 'select',
      required: true,
      options: [
        { label: 'Техник', value: 'technician' },
        { label: 'Менеджер', value: 'manager' },
        { label: 'Администратор', value: 'admin' },
      ],
    },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Телефон', type: 'text', required: true },
    { name: 'specialization', label: 'Специализация', type: 'text', required: true },
    { name: 'experience', label: 'Опыт работы (лет)', type: 'number', required: true },
    { name: 'salary', label: 'Зарплата', type: 'number', required: true },
    { name: 'hireDate', label: 'Дата приёма на работу', type: 'date', required: true },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      required: true,
      options: [
        { label: 'Активен', value: 'active' },
        { label: 'В отпуске', value: 'vacation' },
        { label: 'Уволен', value: 'fired' },
      ],
    },
  ];

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedStaff(null);
    setDialogOpen(true);
  };

  const handleEdit = (staffMember: Staff) => {
    setDialogMode('edit');
    setSelectedStaff(staffMember);
    setDialogOpen(true);
  };

  const handleView = (staffMember: Staff) => {
    setDialogMode('view');
    setSelectedStaff(staffMember);
    setDialogOpen(true);
  };

  const handleDelete = (staffMember: Staff) => {
    setStaff(staff.filter((s) => s.id !== staffMember.id));
    toast({ title: 'Сотрудник удалён', description: `${staffMember.name} успешно удалён` });
  };

  const handleSubmit = (data: Staff) => {
    if (dialogMode === 'create') {
      const newStaff = { ...data, id: String(staff.length + 1) };
      setStaff([...staff, newStaff]);
      toast({ title: 'Сотрудник создан', description: `${newStaff.name} успешно добавлен` });
    } else if (dialogMode === 'edit' && selectedStaff) {
      setStaff(staff.map((s) => (s.id === selectedStaff.id ? { ...data, id: selectedStaff.id } : s)));
      toast({ title: 'Сотрудник обновлён', description: `${selectedStaff.name} успешно обновлён` });
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Сотрудники</h2>
          <p className="text-muted-foreground mt-1">Управление персоналом</p>
        </div>
        <Button onClick={handleCreate}>
          <Icon name="Plus" size={16} />
          Новый сотрудник
        </Button>
      </div>

      <DataTable
        data={staff}
        columns={columns}
        searchKeys={['name', 'email', 'phone', 'specialization']}
        filters={[
          {
            key: 'position',
            label: 'Должность',
            type: 'select',
            options: [
              { label: 'Техник', value: 'technician' },
              { label: 'Менеджер', value: 'manager' },
              { label: 'Администратор', value: 'admin' },
            ],
          },
          {
            key: 'status',
            label: 'Статус',
            type: 'select',
            options: [
              { label: 'Активен', value: 'active' },
              { label: 'В отпуске', value: 'vacation' },
              { label: 'Уволен', value: 'fired' },
            ],
          },
        ]}
        actions={[
          { label: 'Просмотр', icon: 'Eye', onClick: handleView, variant: 'outline' },
          { label: 'Изменить', icon: 'Edit', onClick: handleEdit, variant: 'default', permission: ['admin'] },
          { label: 'Удалить', icon: 'Trash2', onClick: handleDelete, variant: 'destructive', permission: ['admin'] },
        ]}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create'
                ? 'Создать сотрудника'
                : dialogMode === 'edit'
                ? 'Редактировать сотрудника'
                : 'Просмотр сотрудника'}
            </DialogTitle>
          </DialogHeader>
          <EntityForm
            fields={formFields}
            initialData={selectedStaff || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            mode={dialogMode}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
