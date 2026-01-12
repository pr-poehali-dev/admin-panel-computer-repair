import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ReportConfig<T> {
  title: string;
  data: T[];
  columns: { key: keyof T | string; label: string; aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max' }[];
  groupBy?: (keyof T)[];
  filters?: {
    key: keyof T;
    operator: 'eq' | 'gt' | 'lt' | 'contains';
    value: any;
  }[];
}

interface ReportGeneratorProps<T> {
  config: ReportConfig<T>;
  buttonVariant?: 'default' | 'outline' | 'ghost';
}

type ReportFormat = 'pdf' | 'excel' | 'html' | 'csv';
type ChartType = 'none' | 'bar' | 'line' | 'pie';

export function ReportGenerator<T extends Record<string, any>>({ config, buttonVariant = 'default' }: ReportGeneratorProps<T>) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ReportFormat>('pdf');
  const [chartType, setChartType] = useState<ChartType>('none');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(config.columns.map((c) => String(c.key)));
  const [includeStats, setIncludeStats] = useState(true);
  const [comments, setComments] = useState('');

  const toggleColumn = (key: string) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const calculateAggregations = (data: T[], column: typeof config.columns[0]) => {
    if (!column.aggregation) return null;

    const values = data.map((item) => Number(item[column.key as keyof T]) || 0);

    switch (column.aggregation) {
      case 'sum':
        return values.reduce((a, b) => a + b, 0);
      case 'avg':
        return values.reduce((a, b) => a + b, 0) / values.length;
      case 'count':
        return values.length;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      default:
        return null;
    }
  };

  const generateHTMLReport = () => {
    const selectedCols = config.columns.filter((c) => selectedColumns.includes(String(c.key)));
    let html = '<html><head><style>';
    html += 'body { font-family: Arial, sans-serif; margin: 40px; color: #333; }';
    html += 'h1 { color: #1e293b; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }';
    html += '.meta { background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; }';
    html += '.meta p { margin: 5px 0; }';
    html += 'table { width: 100%; border-collapse: collapse; margin: 20px 0; }';
    html += 'th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }';
    html += 'th { background-color: #3b82f6; color: white; font-weight: 600; }';
    html += 'tr:nth-child(even) { background-color: #f8fafc; }';
    html += 'tr:hover { background-color: #e0f2fe; }';
    html += '.stats { background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; }';
    html += '.stats h3 { color: #059669; margin-top: 0; }';
    html += '.stat-item { display: inline-block; margin: 10px 20px 10px 0; }';
    html += '.stat-label { color: #6b7280; font-size: 14px; }';
    html += '.stat-value { font-size: 24px; font-weight: bold; color: #059669; }';
    html += '.footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; }';
    html += '</style></head><body>';
    html += `<h1>${config.title}</h1>`;
    html += '<div class="meta">';
    html += `<p><strong>Дата формирования:</strong> ${new Date().toLocaleDateString('ru-RU')}</p>`;
    if (dateFrom && dateTo) {
      html += `<p><strong>Период:</strong> с ${dateFrom} по ${dateTo}</p>`;
    }
    html += `<p><strong>Всего записей:</strong> ${config.data.length}</p>`;
    if (comments) {
      html += `<p><strong>Комментарии:</strong> ${comments}</p>`;
    }
    html += '</div>';

    if (includeStats) {
      html += '<div class="stats">';
      html += '<h3>Сводная статистика</h3>';
      selectedCols.forEach((col) => {
        if (col.aggregation) {
          const value = calculateAggregations(config.data, col);
          if (value !== null) {
            html += '<div class="stat-item">';
            html += `<div class="stat-label">${col.label} (${col.aggregation})</div>`;
            html += `<div class="stat-value">${value.toFixed(2)}</div>`;
            html += '</div>';
          }
        }
      });
      html += '</div>';
    }

    html += '<table><thead><tr>';
    selectedCols.forEach((col) => {
      html += `<th>${col.label}</th>`;
    });
    html += '</tr></thead><tbody>';
    config.data.forEach((item) => {
      html += '<tr>';
      selectedCols.forEach((col) => {
        html += `<td>${item[col.key as keyof T]}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    html += '<div class="footer">';
    html += `<p>Отчёт создан автоматически • TechRepair Admin</p>`;
    html += '</div>';
    html += '</body></html>';

    return html;
  };

  const generateReport = () => {
    if (selectedColumns.length === 0) {
      toast({
        title: 'Ошибка генерации',
        description: 'Выберите хотя бы одну колонку',
        variant: 'destructive',
      });
      return;
    }

    const html = generateHTMLReport();

    switch (format) {
      case 'html': {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${config.title.replace(/\s+/g, '_')}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        break;
      }
      case 'pdf': {
        const printWindow = window.open();
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.onload = () => {
            printWindow.print();
          };
        }
        break;
      }
      case 'excel': {
        const selectedCols = config.columns.filter((c) => selectedColumns.includes(String(c.key)));
        let excel = '<?xml version="1.0"?>\n';
        excel += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
        excel += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
        excel += ' <Worksheet ss:Name="Report">\n';
        excel += '  <Table>\n';
        excel += '   <Row>\n';
        selectedCols.forEach((col) => {
          excel += `    <Cell><Data ss:Type="String">${col.label}</Data></Cell>\n`;
        });
        excel += '   </Row>\n';
        config.data.forEach((item) => {
          excel += '   <Row>\n';
          selectedCols.forEach((col) => {
            const value = item[col.key as keyof T];
            const type = typeof value === 'number' ? 'Number' : 'String';
            excel += `    <Cell><Data ss:Type="${type}">${value}</Data></Cell>\n`;
          });
          excel += '   </Row>\n';
        });
        excel += '  </Table>\n';
        excel += ' </Worksheet>\n';
        excel += '</Workbook>';
        const blob = new Blob([excel], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${config.title.replace(/\s+/g, '_')}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        break;
      }
      case 'csv': {
        const selectedCols = config.columns.filter((c) => selectedColumns.includes(String(c.key)));
        const headers = selectedCols.map((c) => c.label).join(',');
        const rows = config.data.map((item) =>
          selectedCols.map((col) => {
            const value = item[col.key as keyof T];
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
          }).join(',')
        );
        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${config.title.replace(/\s+/g, '_')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        break;
      }
    }

    toast({
      title: 'Отчёт сформирован',
      description: `Отчёт "${config.title}" создан в формате ${format.toUpperCase()}`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>
          <Icon name="FileText" size={16} />
          Сформировать отчёт
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Формат отчёта</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as ReportFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF (печать)</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="excel">Excel (XLS)</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Тип диаграммы</Label>
              <Select value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Без диаграммы</SelectItem>
                  <SelectItem value="bar">Столбчатая</SelectItem>
                  <SelectItem value="line">Линейная</SelectItem>
                  <SelectItem value="pie">Круговая</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Дата с</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Дата по</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Выберите данные для отчёта</Label>
            <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-3">
              {config.columns.map((col) => (
                <div key={String(col.key)} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={String(col.key)}
                      checked={selectedColumns.includes(String(col.key))}
                      onCheckedChange={() => toggleColumn(String(col.key))}
                    />
                    <Label htmlFor={String(col.key)} className="cursor-pointer">
                      {col.label}
                    </Label>
                  </div>
                  {col.aggregation && (
                    <span className="text-xs text-muted-foreground">{col.aggregation}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="includeStats" checked={includeStats} onCheckedChange={(checked) => setIncludeStats(!!checked)} />
            <Label htmlFor="includeStats" className="cursor-pointer">
              Включить сводную статистику
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Комментарии (опционально)</Label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Дополнительная информация об отчёте..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Отмена
            </Button>
            <Button onClick={generateReport} className="flex-1">
              <Icon name="FileText" size={16} />
              Сгенерировать отчёт
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
