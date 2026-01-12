import React, { useEffect } from 'react';
import { useApiList } from '@/hooks/useApi';
import { ordersService, Order } from '@/services';
import { Button } from '@/components/ui/button';

export function ApiUsageExample() {
  const {
    items: orders,
    loading,
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
  } = useApiList<Order>(ordersService, {
    autoLoad: true,
    onSuccess: (data) => console.log('Orders loaded:', data),
    onError: (error) => console.error('Error:', error),
  });

  const handleCreateOrder = async () => {
    const newOrder = {
      number: `#${Date.now()}`,
      client: 'Test Client',
      device: 'Test Device',
      issue: 'Test issue',
      status: 'new' as const,
      priority: 'medium' as const,
      technician: 'Test Technician',
      createdAt: new Date().toISOString(),
      cost: 1000,
    };

    const response = await createItem(newOrder);
    if (response.success) {
      console.log('Order created:', response.data);
    }
  };

  const handleUpdateOrder = async (id: string) => {
    const response = await updateItem(id, {
      status: 'in_progress',
    });
    if (response.success) {
      console.log('Order updated:', response.data);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    const response = await deleteItem(id);
    if (response.success) {
      console.log('Order deleted');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">API Usage Example</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="mb-4">
        <Button onClick={handleCreateOrder}>Create Order</Button>
        <Button onClick={() => loadItems()} variant="outline" className="ml-2">
          Reload Orders
        </Button>
      </div>

      <div className="space-y-2">
        {orders.map((order) => (
          <div key={order._id} className="border p-4 rounded">
            <p>
              <strong>{order.number}</strong> - {order.client}
            </p>
            <p>Status: {order.status}</p>
            <div className="mt-2 space-x-2">
              <Button
                size="sm"
                onClick={() => handleUpdateOrder(order._id!)}
              >
                Update Status
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteOrder(order._id!)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApiUsageExample;
