import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Настройки сохранены',
      description: 'Изменения успешно применены',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Настройки</h2>
        <p className="text-muted-foreground mt-1">Конфигурация системы</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Общие настройки</CardTitle>
            <CardDescription>Основные параметры системы</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Название компании</Label>
              <Input id="companyName" defaultValue="TechRepair" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email компании</Label>
              <Input id="companyEmail" type="email" defaultValue="info@techrepair.ru" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Телефон</Label>
              <Input id="companyPhone" defaultValue="+7 (495) 123-45-67" />
            </div>
            <Button onClick={handleSave}>
              <Icon name="Save" size={16} />
              Сохранить
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Уведомления</CardTitle>
            <CardDescription>Настройка уведомлений</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications">Email уведомления</Label>
              <Switch id="emailNotifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="smsNotifications">SMS уведомления</Label>
              <Switch id="smsNotifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications">Push уведомления</Label>
              <Switch id="pushNotifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="lowStockAlerts">Оповещения о низком остатке</Label>
              <Switch id="lowStockAlerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Рабочее время</CardTitle>
            <CardDescription>График работы сервиса</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workDays">Рабочие дни</Label>
              <Select defaultValue="weekdays">
                <SelectTrigger id="workDays">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekdays">Будние дни</SelectItem>
                  <SelectItem value="all">Все дни</SelectItem>
                  <SelectItem value="custom">Индивидуально</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openTime">Открытие</Label>
                <Input id="openTime" type="time" defaultValue="09:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closeTime">Закрытие</Label>
                <Input id="closeTime" type="time" defaultValue="18:00" />
              </div>
            </div>
            <Button onClick={handleSave}>
              <Icon name="Save" size={16} />
              Сохранить
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Безопасность</CardTitle>
            <CardDescription>Параметры безопасности</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="twoFactor">Двухфакторная аутентификация</Label>
              <Switch id="twoFactor" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sessionTimeout">Автовыход через 30 мин</Label>
              <Switch id="sessionTimeout" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordPolicy">Политика паролей</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="passwordPolicy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Базовая</SelectItem>
                  <SelectItem value="medium">Средняя</SelectItem>
                  <SelectItem value="high">Высокая</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Опасная зона</CardTitle>
          <CardDescription>Необратимые действия</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-lg">
            <div>
              <p className="font-medium">Очистить все данные</p>
              <p className="text-sm text-muted-foreground">Удалить все заказы, клиентов и историю</p>
            </div>
            <Button variant="destructive">
              <Icon name="Trash2" size={16} />
              Очистить
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-lg">
            <div>
              <p className="font-medium">Сбросить настройки</p>
              <p className="text-sm text-muted-foreground">Вернуть все настройки к значениям по умолчанию</p>
            </div>
            <Button variant="destructive">
              <Icon name="RotateCcw" size={16} />
              Сбросить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
