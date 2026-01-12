import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function Notifications() {
  const notifications = [
    {
      id: '1',
      type: 'order',
      title: 'Новый заказ #1024',
      message: 'Поступил новый заказ от клиента Иванов И.И.',
      time: '5 мин назад',
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Низкий остаток запчастей',
      message: 'Клавиатура MacBook Pro: осталось 3 шт. (минимум 5)',
      time: '1 час назад',
      read: false,
    },
    {
      id: '3',
      type: 'success',
      title: 'Заказ #1023 завершён',
      message: 'Ремонт успешно завершён, клиент уведомлён',
      time: '2 часа назад',
      read: true,
    },
    {
      id: '4',
      type: 'info',
      title: 'Поступление запчастей',
      message: 'Получена партия SSD 512GB - 20 шт.',
      time: '3 часа назад',
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return 'ShoppingCart';
      case 'warning':
        return 'AlertTriangle';
      case 'success':
        return 'CheckCircle';
      case 'info':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-50 dark:bg-blue-950 text-blue-600';
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-950 text-orange-600';
      case 'success':
        return 'bg-green-50 dark:bg-green-950 text-green-600';
      case 'info':
        return 'bg-purple-50 dark:bg-purple-950 text-purple-600';
      default:
        return 'bg-gray-50 dark:bg-gray-950 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Уведомления</h2>
          <p className="text-muted-foreground mt-1">Все уведомления системы</p>
        </div>
        <Button variant="outline">
          <Icon name="CheckCheck" size={16} />
          Отметить все как прочитанные
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последние уведомления</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                  !notification.read ? 'bg-accent' : ''
                }`}
              >
                <div className={`p-2 rounded-lg ${getColor(notification.type)}`}>
                  <Icon name={getIcon(notification.type)} size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{notification.title}</h4>
                        {!notification.read && <Badge className="bg-blue-500">Новое</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                </div>
                {!notification.read && (
                  <Button variant="ghost" size="sm">
                    <Icon name="Check" size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
