import ProgressBar from './ProgressBar';
import './OrderCard.css';

const OrderCard = ({ order, onClick }) => {
  const statusLabels = {
    DRAFT: 'Черновик',
    IN_PROGRESS: 'В процессе',
    COMPLETED: 'Завершена'
  };

  const statusColors = {
    DRAFT: '#9e9e9e',
    IN_PROGRESS: '#2196f3',
    COMPLETED: '#4caf50'
  };

  const progress = order.total_items > 0 
    ? Math.round((order.scanned_count / order.total_items) * 100) 
    : 0;

  return (
    <div className="order-card" onClick={() => onClick(order.id)}>
      <div className="card-header">
        <h3 className="order-number">Заявка №{order.order_number}</h3>
        <span 
          className="order-status"
          style={{ background: statusColors[order.status] }}
        >
          {statusLabels[order.status]}
        </span>
      </div>
      
      <div className="card-route">
        <span className="warehouse">{order.source_warehouse}</span>
        <span className="arrow">→</span>
        <span className="warehouse">{order.target_warehouse}</span>
      </div>
      
      <div className="card-progress">
        <ProgressBar progress={progress} />
        <span className="progress-text">
          {order.scanned_count} / {order.total_items}
        </span>
      </div>
      
      <div className="card-footer">
        <span className="created-date">
          {new Date(order.created_at).toLocaleDateString('ru-RU')}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;