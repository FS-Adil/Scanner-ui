import client, { isMockMode } from './client';
import { mockOrders, mockCompletedOrders, simulateNetworkDelay } from './mockData';

export const ordersApi = {
  // Получить список активных заявок
  getActiveOrders: async () => {
    if (isMockMode) {
      await simulateNetworkDelay(500);
      return { 
        data: mockOrders.filter(order => 
          order.status === 'IN_PROGRESS' || order.status === 'DRAFT'
        )
      };
    }
    return client.get('/orders/active');
  },
  
  // Получить детали заявки
  getOrderById: async (id) => {
    if (isMockMode) {
      await simulateNetworkDelay(300);
      const order = mockOrders.find(o => o.id === parseInt(id));
      if (!order) {
        throw new Error('Заявка не найдена');
      }
      return { data: order };
    }
    return client.get(`/orders/${id}`);
  },
  
  // Получить завершенные заявки
  getCompletedOrders: async () => {
    if (isMockMode) {
      await simulateNetworkDelay(400);
      return { data: mockCompletedOrders };
    }
    return client.get('/orders/completed');
  },
  
  // Завершить заявку
  completeOrder: async (id) => {
    if (isMockMode) {
      await simulateNetworkDelay(200);
      const order = mockOrders.find(o => o.id === parseInt(id));
      if (order) {
        order.status = 'COMPLETED';
      }
      return { data: { success: true } };
    }
    return client.post(`/orders/${id}/complete`);
  },
  
  // Обновить прогресс сканирования
  updateProgress: async (id, data) => {
    if (isMockMode) {
      await simulateNetworkDelay(100);
      const order = mockOrders.find(o => o.id === parseInt(id));
      if (order) {
        order.scanned_count = data.scanned_count;
      }
      return { data: { success: true } };
    }
    return client.patch(`/orders/${id}/progress`, data);
  }
};