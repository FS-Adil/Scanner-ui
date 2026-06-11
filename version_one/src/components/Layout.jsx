import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const isOnline = useNetworkStatus();
  
  // Не показываем BottomNav на экране сканера
  const hideNav = location.pathname.startsWith('/scan/');

  return (
    <div className="app-layout">
      {/* Баннер офлайн-режима */}
      {!isOnline && (
        <div className="offline-banner">
          ⚠️ Вы офлайн. Данные синхронизируются при подключении к сети
        </div>
      )}
      
      {/* Основной контент */}
      <main className={`main-content ${hideNav ? 'full-height' : ''}`}>
        <Outlet />
      </main>
      
      {/* Нижняя навигация (скрыта на сканере) */}
      {!hideNav && <BottomNav />}
    </div>
  );
};

export default Layout;