import { useState, useEffect } from 'react';
import { useOfflineStore } from '../store/useOfflineStore';
import toast from 'react-hot-toast';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const processQueue = useOfflineStore(state => state.processQueue);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      
      // При восстановлении сети синхронизируем офлайн-очередь
      try {
        const syncedCount = await processQueue();
        if (syncedCount > 0) {
          toast.success(`Синхронизировано ${syncedCount} сканирований`);
        }
      } catch (error) {
        toast.error('Ошибка синхронизации');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Вы офлайн. Данные синхронизируются при подключении к сети', {
        duration: 4000
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [processQueue]);

  return isOnline;
};