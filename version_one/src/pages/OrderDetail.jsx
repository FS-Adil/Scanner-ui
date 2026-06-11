import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';
import ProgressBar from '../components/ProgressBar';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentOrder, isLoading, error, setCurrentOrder } = useOrderStore();

  useEffect(() => {
    setCurrentOrder(id);
  }, [id, setCurrentOrder]);

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="skeleton-detail">
          <div className="skeleton-header" />
          <div className="skeleton-item" />
          <div className="skeleton-item" />
          <div className="skeleton-item" />
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="page-container">
        <div className="error-state">
          <p>Заявка не найдена</p>
          <button onClick={() => navigate('/')} className="back-button">
            Назад к списку
          </button>
        </div>
      </div>
    );
  }

  const progress = currentOrder.total_items > 0
    ? Math.round((currentOrder.scanned_count / currentOrder.total_items) * 100)
    : 0;

  const allScanned = currentOrder.scanned_count === currentOrder.total_items;

  const getItemStatus = (item) => {
    if (item.scanned) return 'scanned';
    if (item.error) return 'error';
    return 'pending';
  };

  return (
    <div className="page-container">
      <header className="detail-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Назад
        </button>
        <h1>Заявка №{currentOrder.order_number}</h1>
      </header>

      <div className="detail-info">
        <div className="route-info">
          <span className="warehouse">{currentOrder.source_warehouse}</span>
          <span className="arrow">→</span>
          <span className="warehouse">{currentOrder.target_warehouse}</span>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span>Прогресс сканирования</span>
            <span className="progress-count">
              {currentOrder.scanned_count} / {currentOrder.total_items}
            </span>
          </div>
          <ProgressBar 
            progress={progress} 
            color={progress === 100 ? '#4caf50' : '#2196f3'} 
          />
        </div>
      </div>

      <div className="items-section">
        <h2>Товары к сканированию</h2>
        <div className="items-list">
          {currentOrder.items?.map(item => (
            <div 
              key={item.id} 
              className={`item-row ${getItemStatus(item)}`}
            >
              <span className="item-status-icon">
                {item.scanned ? '✅' : item.error ? '❌' : '⭕'}
              </span>
              <div className="item-info">
                <span className="item-name">{item.product_name}</span>
                <span className="item-code">{item.label_code}</span>
              </div>
              {item.error && (
                <span className="item-error" title={item.error_message}>
                  ⚠️
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="start-scanning-btn"
          onClick={() => navigate(`/scan/${currentOrder.id}`)}
        >
          {allScanned ? 'Сканировать еще' : 'Начать сканирование'}
        </button>
        {allScanned && (
          <button className="complete-order-btn">
            Завершить заявку
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;