// Работа с IndexedDB для офлайн-очереди
const DB_NAME = 'warehouse-scanner-offline';
const STORE_NAME = 'scan-queue';
const DB_VERSION = 1;

// Открыть базу данных
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
      }
    };
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// Сохранить скан в очередь
export const saveToQueue = async (scanData) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await store.add({
      ...scanData,
      timestamp: Date.now()
    });
    
    db.close();
  } catch (error) {
    console.error('Error saving to offline queue:', error);
  }
};

// Получить все элементы очереди
export const getQueue = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).finally(() => db.close());
  } catch (error) {
    console.error('Error getting offline queue:', error);
    return [];
  }
};

// Очистить очередь
export const clearQueue = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await store.clear();
    db.close();
  } catch (error) {
    console.error('Error clearing offline queue:', error);
  }
};

// Получить размер очереди
export const getQueueSize = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.count();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).finally(() => db.close());
  } catch (error) {
    console.error('Error getting queue size:', error);
    return 0;
  }
};