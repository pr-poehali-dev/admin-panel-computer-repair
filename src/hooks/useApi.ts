import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, CRUDService } from '@/services/api';

export interface UseApiOptions<T> {
  autoLoad?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  service: CRUDService<any>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall();

        if (response.success && response.data) {
          setData(response.data);
          options.onSuccess?.(response.data);
        } else {
          const errorMessage = response.error || 'Unknown error';
          setError(errorMessage);
          options.onError?.(errorMessage);
        }

        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        options.onError?.(errorMessage);
        return { success: false, error: errorMessage } as ApiResponse<T>;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return { data, loading, error, execute, setData };
}

export function useApiList<T extends { _id?: string }>(
  service: CRUDService<T>,
  options: UseApiOptions<{ items: T[]; total: number; page: number; totalPages: number }> = {}
) {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(
    async (pagination?: any, filters?: any) => {
      setLoading(true);
      setError(null);

      try {
        const response = await service.getAll(pagination, filters);

        if (response.success && response.data) {
          setItems(response.data.items);
          setTotal(response.data.total);
          setPage(response.data.page);
          setTotalPages(response.data.totalPages);
          options.onSuccess?.(response.data);
        } else {
          const errorMessage = response.error || 'Failed to load items';
          setError(errorMessage);
          options.onError?.(errorMessage);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        options.onError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [service, options]
  );

  const createItem = useCallback(
    async (data: Omit<T, '_id'>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await service.create(data);

        if (response.success && response.data) {
          setItems((prev) => [response.data!, ...prev]);
          setTotal((prev) => prev + 1);
          return response;
        } else {
          setError(response.error || 'Failed to create item');
          return response;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return { success: false, error: errorMessage } as ApiResponse<T>;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const updateItem = useCallback(
    async (id: string, data: Partial<T>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await service.update(id, data);

        if (response.success && response.data) {
          setItems((prev) =>
            prev.map((item) => (item._id === id ? response.data! : item))
          );
          return response;
        } else {
          setError(response.error || 'Failed to update item');
          return response;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return { success: false, error: errorMessage } as ApiResponse<T>;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await service.delete(id);

        if (response.success) {
          setItems((prev) => prev.filter((item) => item._id !== id));
          setTotal((prev) => prev - 1);
          return response;
        } else {
          setError(response.error || 'Failed to delete item');
          return response;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return { success: false, error: errorMessage } as ApiResponse<void>;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  useEffect(() => {
    if (options.autoLoad) {
      loadItems();
    }
  }, [options.autoLoad, loadItems]);

  return {
    items,
    total,
    page,
    totalPages,
    loading,
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
    setItems,
  };
}
