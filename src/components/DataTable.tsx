import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Column, FilterConfig, TableAction } from '@/types';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  filters?: FilterConfig[];
  actions?: TableAction<T>[];
  itemsPerPage?: number;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchKeys = [],
  filters = [],
  actions = [],
  itemsPerPage = 10,
}: DataTableProps<T>) {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchTerm && searchKeys.length > 0) {
      result = result.filter((item) =>
        searchKeys.some((key) =>
          String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) => String(item[key as keyof T]) === value);
      }
    });

    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof T];
        const bVal = b[sortConfig.key as keyof T];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchKeys, sortConfig, filterValues]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const visibleActions = actions.filter(action => 
    !action.permission || hasPermission(action.permission)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {searchKeys.length > 0 && (
          <div className="flex-1">
            <Input
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        )}
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={filterValues[filter.key] || ''}
            onValueChange={(value) =>
              setFilterValues((prev) => ({ ...prev, [filter.key]: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все</SelectItem>
              {filter.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort(String(column.key))}
                        className="h-6 w-6 p-0"
                      >
                        <Icon
                          name={
                            sortConfig?.key === column.key
                              ? sortConfig.direction === 'asc'
                                ? 'ArrowUp'
                                : 'ArrowDown'
                              : 'ArrowUpDown'
                          }
                          size={14}
                        />
                      </Button>
                    )}
                  </div>
                </TableHead>
              ))}
              {visibleActions.length > 0 && <TableHead>Действия</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (visibleActions.length > 0 ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                  Данные не найдены
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render
                        ? column.render(item[column.key as keyof T], item)
                        : String(item[column.key as keyof T])}
                    </TableCell>
                  ))}
                  {visibleActions.length > 0 && (
                    <TableCell>
                      <div className="flex gap-2">
                        {visibleActions.map((action, idx) => (
                          <Button
                            key={idx}
                            variant={action.variant || 'outline'}
                            size="sm"
                            onClick={() => action.onClick(item)}
                          >
                            {action.icon && <Icon name={action.icon} size={16} />}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Показано {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} из{' '}
            {filteredAndSortedData.length}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <span className="flex items-center px-4 text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
