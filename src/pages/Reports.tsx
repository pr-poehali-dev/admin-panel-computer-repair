import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Reports() {
  const { toast } = useToast();

  const reports = [
    {
      title: 'Финансовый отчёт',
      description: 'Доходы, расходы и прибыль за период',
      icon: 'FileText',
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Отчёт по заказам',
      description: 'Статистика выполненных заказов',
      icon: 'ClipboardList',
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Отчёт по клиентам',
      description: 'База клиентов и история заказов',
      icon: 'Users',
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Складской отчёт',
      description: 'Остатки запчастей и движение товаров',
      icon: 'Package',
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      title: 'Отчёт по сотрудникам',
      description: 'Производительность и статистика работы',
      icon: 'UserCog',
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 dark:bg-cyan-950',
    },
    {
      title: 'Аналитический отчёт',
      description: 'Комплексная аналитика за период',
      icon: 'BarChart3',
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-950',
    },
  ];

  const handleGenerateReport = (reportTitle: string) => {
    toast({
      title: 'Отчёт формируется',
      description: `${reportTitle} будет готов через несколько секунд`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Отчёты</h2>
        <p className="text-muted-foreground mt-1">Формирование отчётов и документов</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${report.bg}`}>
                  <Icon name={report.icon} size={24} className={report.color} />
                </div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{report.description}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleGenerateReport(report.title)}
                  className="flex-1"
                  size="sm"
                >
                  <Icon name="FileDown" size={16} />
                  Сформировать
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последние отчёты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Финансовый отчёт за июнь 2024', date: '01.07.2024', size: '245 KB' },
              { name: 'Отчёт по заказам за июнь 2024', date: '01.07.2024', size: '189 KB' },
              { name: 'Складской отчёт за май 2024', date: '01.06.2024', size: '156 KB' },
            ].map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Icon name="FileText" size={20} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.date} • {file.size}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Icon name="Download" size={16} />
                  Скачать
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
