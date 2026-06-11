import { useEffect, useState } from 'react';
import './ScanResult.css';

const ScanResult = ({ result, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Автоматическое скрытие для успешного результата
    if (result?.status === 'SUCCESS') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [result, onClose]);

  if (!result || !isVisible) return null;

  const statusIcons = {
    SUCCESS: '✅',
    ERROR: '❌',
    WARNING: '⚠️',
    PENDING: '🕐'
  };

  const statusColors = {
    SUCCESS: '#4caf50',
    ERROR: '#f44336',
    WARNING: '#ff9800',
    PENDING: '#2196f3'
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div 
      className="scan-result"
      style={{ borderLeftColor: statusColors[result.status] }}
      onClick={handleClose}
    >
      <span className="result-icon">{statusIcons[result.status]}</span>
      <div className="result-content">
        <h4 className="result-product">{result.product || 'Неизвестный товар'}</h4>
        <p className="result-message">{result.message}</p>
      </div>
      {result.status !== 'SUCCESS' && (
        <button className="close-button" onClick={handleClose}>
          ✕
        </button>
      )}
    </div>
  );
};

export default ScanResult;