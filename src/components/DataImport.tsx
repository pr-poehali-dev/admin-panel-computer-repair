import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface DataImportProps<T> {
  columns: { key: keyof T | string; label: string; required?: boolean }[];
  onImport: (data: T[]) => void;
  buttonVariant?: 'default' | 'outline' | 'ghost';
}

type ImportFormat = 'csv' | 'excel' | 'json' | 'xml';

export function DataImport<T extends Record<string, any>>({ columns, onImport, buttonVariant = 'outline' }: DataImportProps<T>) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ImportFormat>('csv');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<T[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = async (file: File) => {
    const text = await file.text();
    let parsed: T[] = [];

    try {
      switch (format) {
        case 'csv':
          parsed = parseCSV(text);
          break;
        case 'json':
          parsed = parseJSON(text);
          break;
        case 'xml':
          parsed = parseXML(text);
          break;
        case 'excel':
          parsed = parseCSV(text);
          break;
      }
      setPreview(parsed.slice(0, 5));
    } catch (error) {
      toast({
        title: 'Ошибка парсинга',
        description: 'Не удалось распознать формат файла',
        variant: 'destructive',
      });
    }
  };

  const parseCSV = (text: string): T[] => {
    const lines = text.split('\n').filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    const data: T[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        const column = columns.find((c) => c.label === header);
        if (column) {
          obj[column.key] = values[index] || '';
        }
      });
      data.push(obj as T);
    }

    return data;
  };

  const parseJSON = (text: string): T[] => {
    const json = JSON.parse(text);
    if (!Array.isArray(json)) {
      throw new Error('JSON должен содержать массив объектов');
    }
    return json as T[];
  };

  const parseXML = (text: string): T[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const records = xmlDoc.getElementsByTagName('record');
    const data: T[] = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const obj: any = {};
      columns.forEach((col) => {
        const key = String(col.key).replace(/[^a-zA-Z0-9]/g, '_');
        const element = record.getElementsByTagName(key)[0];
        if (element) {
          obj[col.key] = element.textContent || '';
        }
      });
      data.push(obj as T);
    }

    return data;
  };

  const handleImport = () => {
    if (!file || preview.length === 0) {
      toast({
        title: 'Ошибка импорта',
        description: 'Выберите файл для импорта',
        variant: 'destructive',
      });
      return;
    }

    onImport(preview);
    toast({
      title: 'Импорт выполнен',
      description: `Импортировано записей: ${preview.length}`,
    });
    setOpen(false);
    setFile(null);
    setPreview([]);
  };

  const getAcceptedFormats = () => {
    switch (format) {
      case 'csv':
        return '.csv';
      case 'excel':
        return '.xls,.xlsx';
      case 'json':
        return '.json';
      case 'xml':
        return '.xml';
      default:
        return '*';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>
          <Icon name="Upload" size={16} />
          Импорт
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Импорт данных</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Формат файла</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as ImportFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel (XLS/XLSX)</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Выберите файл</Label>
            <Input
              ref={fileInputRef}
              type="file"
              accept={getAcceptedFormats()}
              onChange={handleFileChange}
            />
          </div>

          {preview.length > 0 && (
            <div className="space-y-2">
              <Label>Предпросмотр данных (первые 5 записей)</Label>
              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      {columns.map((col) => (
                        <th key={String(col.key)} className="px-3 py-2 text-left font-medium">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, idx) => (
                      <tr key={idx} className="border-t">
                        {columns.map((col) => (
                          <td key={String(col.key)} className="px-3 py-2">
                            {String(row[col.key as keyof T] || '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Отмена
            </Button>
            <Button onClick={handleImport} className="flex-1" disabled={!file || preview.length === 0}>
              <Icon name="Upload" size={16} />
              Импортировать ({preview.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
