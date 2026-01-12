import React from 'react';
import { DataExport } from './DataExport';
import { DataImport } from './DataImport';
import { ReportGenerator } from './ReportGenerator';
import { Button } from './ui/button';
import Icon from './ui/icon';

interface PageActionsProps<T> {
  data: T[];
  columns: { key: keyof T | string; label: string }[];
  filename: string;
  reportTitle: string;
  onImport?: (data: T[]) => void;
  onCreate?: () => void;
  createLabel?: string;
  aggregations?: { key: keyof T | string; label: string; aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max' }[];
}

export function PageActions<T extends Record<string, any>>({
  data,
  columns,
  filename,
  reportTitle,
  onImport,
  onCreate,
  createLabel = 'Создать',
  aggregations = [],
}: PageActionsProps<T>) {
  const reportColumns = aggregations.length > 0 ? [...columns, ...aggregations] : columns;

  return (
    <div className="flex gap-2">
      {onImport && <DataImport columns={columns} onImport={onImport} />}
      <DataExport data={data} columns={columns} filename={filename} />
      <ReportGenerator
        config={{
          title: reportTitle,
          data,
          columns: reportColumns,
        }}
      />
      {onCreate && (
        <Button onClick={onCreate}>
          <Icon name="Plus" size={16} />
          {createLabel}
        </Button>
      )}
    </div>
  );
}
