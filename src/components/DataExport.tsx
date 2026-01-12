import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface DataExportProps<T> {
  data: T[];
  columns: { key: keyof T | string; label: string }[];
  filename: string;
  buttonVariant?: 'default' | 'outline' | 'ghost';
}

type ExportFormat = 'csv' | 'excel' | 'json' | 'xml' | 'pdf';

export function DataExport<T extends Record<string, any>>({ data, columns, filename, buttonVariant = 'outline' }: DataExportProps<T>) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map((c) => String(c.key)));

  const toggleColumn = (key: string) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const exportToCSV = () => {
    const selectedCols = columns.filter((c) => selectedColumns.includes(String(c.key)));
    const headers = selectedCols.map((c) => c.label).join(',');
    const rows = data.map((item) =>
      selectedCols.map((col) => {
        const value = item[col.key as keyof T];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${filename}.csv`);
  };

  const exportToJSON = () => {
    const selectedCols = columns.filter((c) => selectedColumns.includes(String(c.key)));
    const exportData = data.map((item) => {
      const obj: Record<string, any> = {};
      selectedCols.forEach((col) => {
        obj[col.label] = item[col.key as keyof T];
      });
      return obj;
    });
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadFile(blob, `${filename}.json`);
  };

  const exportToExcel = () => {
    const selectedCols = columns.filter((c) => selectedColumns.includes(String(c.key)));
    let excel = '<?xml version="1.0"?>\n';
    excel += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
    excel += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
    excel += ' <Worksheet ss:Name="Sheet1">\n';
    excel += '  <Table>\n';
    excel += '   <Row>\n';
    selectedCols.forEach((col) => {
      excel += `    <Cell><Data ss:Type="String">${col.label}</Data></Cell>\n`;
    });
    excel += '   </Row>\n';
    data.forEach((item) => {
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
    downloadFile(blob, `${filename}.xls`);
  };

  const exportToXML = () => {
    const selectedCols = columns.filter((c) => selectedColumns.includes(String(c.key)));
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<data>\n';
    data.forEach((item) => {
      xml += '  <record>\n';
      selectedCols.forEach((col) => {
        const key = String(col.key).replace(/[^a-zA-Z0-9]/g, '_');
        const value = item[col.key as keyof T];
        xml += `    <${key}>${value}</${key}>\n`;
      });
      xml += '  </record>\n';
    });
    xml += '</data>';
    const blob = new Blob([xml], { type: 'application/xml' });
    downloadFile(blob, `${filename}.xml`);
  };

  const exportToPDF = () => {
    const selectedCols = columns.filter((c) => selectedColumns.includes(String(c.key)));
    let html = '<html><head><style>';
    html += 'body { font-family: Arial, sans-serif; }';
    html += 'table { width: 100%; border-collapse: collapse; margin: 20px 0; }';
    html += 'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }';
    html += 'th { background-color: #3b82f6; color: white; }';
    html += 'tr:nth-child(even) { background-color: #f2f2f2; }';
    html += '</style></head><body>';
    html += `<h1>${filename}</h1>`;
    html += '<table><thead><tr>';
    selectedCols.forEach((col) => {
      html += `<th>${col.label}</th>`;
    });
    html += '</tr></thead><tbody>';
    data.forEach((item) => {
      html += '<tr>';
      selectedCols.forEach((col) => {
        html += `<td>${item[col.key as keyof T]}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table></body></html>';
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (selectedColumns.length === 0) {
      toast({
        title: 'Ошибка экспорта',
        description: 'Выберите хотя бы одну колонку',
        variant: 'destructive',
      });
      return;
    }

    switch (format) {
      case 'csv':
        exportToCSV();
        break;
      case 'excel':
        exportToExcel();
        break;
      case 'json':
        exportToJSON();
        break;
      case 'xml':
        exportToXML();
        break;
      case 'pdf':
        exportToPDF();
        break;
    }

    toast({
      title: 'Экспорт выполнен',
      description: `Данные экспортированы в формате ${format.toUpperCase()}`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>
          <Icon name="Download" size={16} />
          Экспорт
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Экспорт данных</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Формат экспорта</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Excel, Google Sheets)</SelectItem>
                <SelectItem value="excel">Excel (XLS)</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
                <SelectItem value="pdf">PDF (печать)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Выберите колонки</Label>
            <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-3">
              {columns.map((col) => (
                <div key={String(col.key)} className="flex items-center gap-2">
                  <Checkbox
                    id={String(col.key)}
                    checked={selectedColumns.includes(String(col.key))}
                    onCheckedChange={() => toggleColumn(String(col.key))}
                  />
                  <Label htmlFor={String(col.key)} className="cursor-pointer">
                    {col.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Отмена
            </Button>
            <Button onClick={handleExport} className="flex-1">
              <Icon name="Download" size={16} />
              Экспортировать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
