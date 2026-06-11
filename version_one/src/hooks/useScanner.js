import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useScanStore } from '../store/useScanStore';
import { useOfflineStore } from '../store/useOfflineStore';
import { scanningApi } from '../api/scanning';
import { playSuccess, playError, playWarning } from '../utils/sound';
import { vibrateSuccess, vibrateError, vibrateWarning } from '../utils/vibrate';

export const useScanner = (orderId, onScanCallback) => {
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);
  const debounceRef = useRef(false);
  const orderIdRef = useRef(orderId);
  const onScanCallbackRef = useRef(onScanCallback);
  
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  
  const isOnline = navigator.onLine;
  
  const addScannedItem = useScanStore(state => state.addScannedItem);
  const addToQueue = useOfflineStore(state => state.addToQueue);

  // Обновляем ref при изменении пропсов
  useEffect(() => {
    orderIdRef.current = orderId;
  }, [orderId]);

  useEffect(() => {
    onScanCallbackRef.current = onScanCallback;
  }, [onScanCallback]);

  // Обновляем ref при изменении состояния сканирования
  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  // Функция обработки сканирования
  const handleScan = useCallback(async (decodedText) => {
    // Защита от двойного сканирования (debounce)
    if (debounceRef.current) {
      console.log('Сканирование заблокировано (debounce)');
      return;
    }
    
    debounceRef.current = true;
    const currentOrderId = orderIdRef.current;
    const currentCallback = onScanCallbackRef.current;

    // Останавливаем сканирование на время обработки
    if (scannerRef.current) {
      try {
        await scannerRef.current.pause();
      } catch (err) {
        console.warn('Ошибка при паузе сканера:', err);
      }
    }

    try {
      let scanResult;

      if (navigator.onLine) {
        // Онлайн - отправляем на сервер
        try {
          const response = await scanningApi.validateScan(currentOrderId, decodedText);
          scanResult = {
            status: response.data.status,
            product: response.data.product_name || decodedText,
            message: response.data.message || 'QR-код обработан'
          };
        } catch (apiError) {
          // Если сервер вернул ошибку валидации (не сетевую)
          if (apiError.response?.data) {
            scanResult = {
              status: 'ERROR',
              product: decodedText,
              message: apiError.response.data.message || 'Ошибка валидации',
              errorDetails: apiError.response.data
            };
          } else {
            // Сетевая ошибка - сохраняем в офлайн
            throw new Error('OFFLINE');
          }
        }
      } else {
        // Офлайн - сохраняем локально
        const scanData = {
          order_id: currentOrderId,
          label_code: decodedText,
          timestamp: new Date().toISOString()
        };
        
        await addToQueue(scanData);
        scanResult = {
          status: 'PENDING',
          product: decodedText,
          message: 'Сохранено локально. Будет синхронизировано при подключении к сети'
        };
      }

      // Сохраняем результат в store
      addScannedItem(decodedText, {
        status: scanResult.status,
        product: scanResult.product,
        message: scanResult.message
      });

      // Звук и вибрация в зависимости от результата
      switch (scanResult.status) {
        case 'SUCCESS':
          playSuccess();
          vibrateSuccess();
          break;
        case 'ERROR':
          playError();
          vibrateError();
          break;
        case 'WARNING':
          playWarning();
          vibrateWarning();
          break;
        case 'PENDING':
          playWarning();
          vibrateWarning();
          break;
        default:
          playWarning();
          vibrateWarning();
      }

      // Вызываем внешний callback если есть
      if (currentCallback) {
        currentCallback(scanResult);
      }

    } catch (error) {
      console.error('Критическая ошибка при сканировании:', error);
      
      // Если офлайн - сохраняем в очередь
      if (error.message === 'OFFLINE' || !navigator.onLine) {
        const scanData = {
          order_id: currentOrderId,
          label_code: decodedText,
          timestamp: new Date().toISOString()
        };
        
        try {
          await addToQueue(scanData);
          
          addScannedItem(decodedText, {
            status: 'PENDING',
            product: decodedText,
            message: 'Сохранено в офлайн-очередь'
          });
          
          playWarning();
          vibrateWarning();
          
          if (currentCallback) {
            currentCallback({
              status: 'PENDING',
              product: decodedText,
              message: 'Сохранено в офлайн-очередь'
            });
          }
        } catch (queueError) {
          console.error('Ошибка сохранения в очередь:', queueError);
          setError('Не удалось сохранить скан. Проверьте память устройства.');
        }
      } else {
        // Другие ошибки
        setError(`Ошибка: ${error.message}`);
        
        addScannedItem(decodedText, {
          status: 'ERROR',
          product: decodedText,
          message: error.message
        });
        
        playError();
        vibrateError();
      }
    } finally {
      // Снимаем блокировку и возобновляем сканирование
      setTimeout(() => {
        debounceRef.current = false;
        
        if (scannerRef.current && isScanningRef.current) {
          try {
            scannerRef.current.resume();
          } catch (err) {
            console.warn('Ошибка при возобновлении сканера:', err);
            // Если не удалось возобновить - перезапускаем
            if (isScanningRef.current) {
              initScanner();
            }
          }
        }
      }, 1000);
    }
  }, [addScannedItem, addToQueue]); // Зависимости, которые не меняются

  // Инициализация сканера
  const initScanner = useCallback(async () => {
    try {
      // Если уже есть экземпляр - останавливаем
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          scannerRef.current.clear();
        } catch (err) {
          console.log('Очистка предыдущего сканера:', err);
        }
      }

      // Создаем новый экземпляр сканера
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;
      
      // Настройки камеры
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        disableFlip: false,
        aspectRatio: 1.0
      };

      // Запускаем сканирование
      await html5QrCode.start(
        { facingMode: "environment" }, // Задняя камера
        config,
        handleScan, // Колбэк успешного сканирования
        (errorMessage) => {
          // Игнорируем некритичные ошибки сканирования
          if (
            !errorMessage.includes('No QR code found') &&
            !errorMessage.includes('No MultiFormat Readers')
          ) {
            console.log('Ошибка сканирования:', errorMessage);
          }
        }
      );

      setIsScanning(true);
      setError(null);
      
      console.log('Сканер успешно запущен');
    } catch (err) {
      console.error('Ошибка инициализации сканера:', err);
      
      let errorMessage = 'Не удалось запустить камеру';
      
      if (err.message?.includes('NotAllowedError') || err.message?.includes('Permission')) {
        errorMessage = 'Нет доступа к камере. Разрешите использование камеры в настройках браузера.';
      } else if (err.message?.includes('NotFoundError')) {
        errorMessage = 'Камера не найдена. Проверьте подключение камеры.';
      } else if (err.message?.includes('NotReadableError')) {
        errorMessage = 'Камера занята другим приложением. Закройте другие приложения, использующие камеру.';
      } else {
        errorMessage = `Ошибка камеры: ${err.message}`;
      }
      
      setError(errorMessage);
      setIsScanning(false);
    }
  }, [handleScan]);

  // Остановка сканера
  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        // Сначала снимаем флаг сканирования
        setIsScanning(false);
        
        // Останавливаем сканер
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        
        // Очищаем ресурсы
        scannerRef.current.clear();
        scannerRef.current = null;
        
        console.log('Сканер остановлен');
      } catch (err) {
        console.error('Ошибка при остановке сканера:', err);
        scannerRef.current = null;
      }
    }
  }, []);

  // Переключение фонарика
  const toggleTorch = useCallback(async () => {
    if (scannerRef.current) {
      try {
        // html5-qrcode имеет встроенный метод для фонарика
        const capabilities = await scannerRef.current.getRunningTrackCapabilities();
        if (capabilities.torch) {
          await scannerRef.current.applyVideoConstraints({
            advanced: [{ torch: !capabilities.torch }]
          });
          return !capabilities.torch;
        }
      } catch (err) {
        console.warn('Фонарик не поддерживается:', err);
      }
    }
    return false;
  }, []);

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopScanner();
      }
    };
  }, [stopScanner]);

  return {
    initScanner,
    stopScanner,
    toggleTorch,
    isScanning,
    error,
    clearError: () => setError(null)
  };
};