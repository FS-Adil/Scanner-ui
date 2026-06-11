import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScanner } from '../hooks/useScanner';
import { useOrderStore } from '../store/useOrderStore';
import { useScanStore } from '../store/useScanStore';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import ScanResult from '../components/ScanResult';
import ProgressBar from '../components/ProgressBar';
import './Scanner.css';

const Scanner = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();
  const { currentOrder, updateScanProgress, setCurrentOrder } = useOrderStore();
  const { lastResult, lastScannedCode, scannedItems, clearLastResult } = useScanStore();
  const { initScanner, stopScanner, isScanning, error } = useScanner(orderId);
  
  const [torchOn, setTorchOn] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [scanOverlay, setScanOverlay] = useState(null);

  useEffect(() => {
    setCurrentOrder(orderId);
    initScanner();
    
    return () => {
      stopScanner();
    };
  }, [orderId]);

  // Обработчик успешного сканирования
  const handleScanResult = useCallback((data) => {
    // Показываем оверлей
    setScanOverlay(data.status);
    
    // Обновляем прогресс
    if (currentOrder) {
      const newCount = (currentOrder.scanned_count || 0) + 1;
      updateScanProgress(orderId, newCount);
    }
    
    // Скрываем оверлей
    setTimeout(() => setScanOverlay(null), 
      data.status === 'SUCCESS' ? 500 : 800);
  }, [orderId, currentOrder, updateScanProgress]);

  const handleStop = async () => {
    await stopScanner();
    navigate(`/orders/${orderId}`);
  };

  const handleTorchToggle = async () => {
    // Логика включения/выключения фонарика
    setTorchOn(!torchOn);
    // Здесь должен быть код для управления фонариком через MediaTrack
  };

  if (error) {
    return (
      <div className="scanner-error">
        <p>{error}</p>
        <button onClick={() => navigate(`/orders/${orderId}`)}>
          Вернуться к заявке
        </button>
      </div>
    );
  }

  const progress = currentOrder?.total_items > 0
    ? Math.round(((currentOrder.scanned_count || 0) / currentOrder.total_items) * 100)
    : 0;

  return (
    <div className="scanner-screen">
      {/* Оверлей при сканировании */}
      {scanOverlay && (
        <div className={`scan-overlay ${scanOverlay.toLowerCase()}`} />
      )}
      
      {/* Верхняя панель */}
      <div className="scanner-header">
        <button onClick={handleStop} className="stop-button">
          ✕
        </button>
        <div className="header-info">
          <span className="order-badge">
            Заявка №{currentOrder?.order_number}
          </span>
          <span className="progress-text">
            {currentOrder?.scanned_count || 0}/{currentOrder?.total_items || 0}
          </span>
        </div>
        <div className="header-indicators">
          <span className={`online-indicator ${isOnline ? 'online' : 'offline'}`} />
          <button 
            onClick={handleTorchToggle}
            className="torch-button"
            disabled={!isScanning}
          >
            {torchOn ? '🔦' : '💡'}
          </button>
        </div>
      </div>
      
      {/* Прогресс-бар */}
      <div className="scanner-progress">
        <ProgressBar 
          progress={progress} 
          color={progress === 100 ? '#4caf50' : '#2196f3'} 
        />
      </div>
      
      {/* Область сканера */}
      <div className="scanner-viewport">
        <div id="qr-reader" className="qr-reader" />
        <div className="scanner-frame">
          <div className="frame-corner top-left" />
          <div className="frame-corner top-right" />
          <div className="frame-corner bottom-left" />
          <div className="frame-corner bottom-right" />
        </div>
      </div>
      
      {/* История сканирования */}
      <div className={`scan-history ${showHistory ? 'visible' : ''}`}>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="history-toggle"
        >
          {showHistory ? 'Скрыть историю ▲' : 'История ▼'}
        </button>
        
        {showHistory && (
          <div className="history-list">
            {scannedItems.slice(0, 5).map((item, index) => (
              <div 
                key={index}
                className={`history-item ${item.result?.status?.toLowerCase()}`}
              >
                <span>{item.result?.status === 'SUCCESS' ? '✅' : '❌'}</span>
                <span className="history-code">{item.labelCode}</span>
                <span className="history-time">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Результат сканирования */}
      {lastResult && lastScannedCode && (
        <ScanResult
          result={{
            status: lastResult,
            product: lastScannedCode,
            message: 'QR-код отсканирован'
          }}
          onClose={clearLastResult}
        />
      )}
    </div>
  );
};

export default Scanner;