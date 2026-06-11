import { isMockMode } from '../api/client';
import './MockIndicator.css';

const MockIndicator = () => {
  if (!isMockMode) return null;
  
  return (
    <div className="mock-indicator">
      🔸 Тестовый режим
    </div>
  );
};

export default MockIndicator;