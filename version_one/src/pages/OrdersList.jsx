import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';
import OrderCard from '../components/OrderCard';
import './OrdersList.css';

const OrdersList = () => {
  const navigate = useNavigate();
  const { orders, isLoading, error, fetchOrders } = useOrderStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (isLoading && !refreshing) {
    return (
      <div className="page-container">
        <header className="page-header">
          <h1>Активные заявки</h1>
        </header>
        <div className="skeleton-list">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p>Ошибка загрузки заявок</p>
          <button onClick={fetchOrders} className="retry-button">
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Активные заявки</h1>
        {orders.length > 0 && (
          <span className="order-count">{orders.length}</span>
        )}
      </header>
      
      <div 
        className="orders-list"
        onTouchStart={(e) => {
          // Логика pull-to-refresh
          const startY = e.touches[0].clientY;
          const handleTouchMove = (e) => {
            const currentY = e.touches[0].clientY;
            if (currentY - startY > 100 && window.scrollY === 0) {
              handleRefresh();
              document.removeEventListener('touchmove', handleTouchMove);
            }
          };
          document.addEventListener('touchmove', handleTouchMove, { once: true });
        }}
      >
        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <p>Нет активных заявок</p>
          </div>
        ) : (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={handleOrderClick}
            />
          ))
        )}
      </div>
      
      {refreshing && <div className="refresh-indicator">Обновление...</div>}
    </div>
  );
};

export default OrdersList;