import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import MockIndicator from './components/MockIndicator';
import OrdersList from './pages/OrdersList';
import OrderDetail from './pages/OrderDetail';
import Scanner from './pages/Scanner';
import Completed from './pages/Completed';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <MockIndicator />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
            fontSize: '14px'
          }
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<OrdersList />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/completed" element={<Completed />} />
        </Route>
        <Route path="/scan/:orderId" element={<Scanner />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;