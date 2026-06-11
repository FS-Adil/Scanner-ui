import { create } from 'zustand';
import { ordersApi } from '../api/orders';

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  // Загрузить список активных заявок
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.getActiveOrders();
      set({ orders: response.data, isLoading: false });
    } catch (error) {
      if (error.message === 'OFFLINE') {
        // При офлайне используем кешированные данные
        const cached = localStorage.getItem('cached_orders');
        if (cached) {
          set({ orders: JSON.parse(cached), isLoading: false });
        }
      } else {
        set({ error: error.message, isLoading: false });
      }
    }
  },

  // Установить текущую заявку
  setCurrentOrder: async (id) => {
    set({ isLoading: true });
    try {
      const response = await ordersApi.getOrderById(id);
      set({ currentOrder: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Обновить прогресс сканирования
  updateScanProgress: (orderId, scannedCount) => {
    set(state => ({
      orders: state.orders.map(order => 
        order.id === orderId 
          ? { ...order, scanned_count: scannedCount }
          : order
      ),
      currentOrder: state.currentOrder?.id === orderId
        ? { ...state.currentOrder, scanned_count: scannedCount }
        : state.currentOrder
    }));
    
    // Кешируем список для офлайн-доступа
    localStorage.setItem('cached_orders', JSON.stringify(get().orders));
  }
}));