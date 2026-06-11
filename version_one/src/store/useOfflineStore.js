import { create } from 'zustand';
import { scanningApi } from '../api/scanning';

export const useOfflineStore = create((set, get) => ({
  offlineQueue: [],
  isSyncing: false,

  // Добавить скан в офлайн-очередь
  addToQueue: (scanData) => {
    set(state => ({
      offlineQueue: [...state.offlineQueue, { ...scanData, id: Date.now() }]
    }));
    // Сохраняем в IndexedDB
    import('../utils/offlineQueue').then(module => {
      module.saveToQueue(scanData);
    });
  },

  // Обработать очередь при появлении сети
  processQueue: async () => {
    const queue = get().offlineQueue;
    if (queue.length === 0) return;
    
    set({ isSyncing: true });
    try {
      await scanningApi.syncOfflineScans(queue);
      set({ offlineQueue: [], isSyncing: false });
      
      // Очищаем IndexedDB
      import('../utils/offlineQueue').then(module => {
        module.clearQueue();
      });
      
      return queue.length;
    } catch (error) {
      set({ isSyncing: false });
      throw error;
    }
  },

  clearQueue: () => set({ offlineQueue: [] })
}));