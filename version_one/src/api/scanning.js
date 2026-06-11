import client, { isMockMode } from './client';
import { getRandomScanResponse, simulateNetworkDelay } from './mockData';

export const scanningApi = {
  // Валидировать отсканированный код
  validateScan: async (orderId, labelCode) => {
    if (isMockMode) {
      await simulateNetworkDelay(200);
      const response = getRandomScanResponse(labelCode);
      return { data: response };
    }
    return client.post('/scanning/validate', {
      order_id: orderId,
      label_code: labelCode
    });
  },
  
  // Синхронизировать офлайн-сканы
  syncOfflineScans: async (scans) => {
    if (isMockMode) {
      await simulateNetworkDelay(1000);
      console.log('Синхронизировано сканов:', scans.length);
      return { data: { synced: scans.length } };
    }
    return client.post('/scanning/sync', { scans });
  }
};