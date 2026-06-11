import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/orders';
import OrderCard from '../components/OrderCard';
import './OrdersList.css';

const Completed = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompletedOrders();
  }, []);

  const loadCompletedOrders = async () => {
    setIsLoading(true);
    try {
      const response = await ordersApi.getCompletedOrders();
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить завершенные заявки');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <header className="page-header">
          <h1>Завершенные заявки</h1>
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
          <p>{error}</p>
          <button onClick={loadCompletedOrders} className="retry-button">
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Завершенные заявки</h1>
        {orders.length > 0 && (
          <span className="order-count">{orders.length}</span>
        )}
      </header>

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <p>Нет завершенных заявок</p>
          </div>
        ) : (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={() => navigate(`/orders/${order.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Completed;