import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';

import HomePage from './pages/Home/HomePage';
import UserManagement from './pages/Admin/UserManagement'; 
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

import AdminLayout from './layouts/AdminLayout/AdminLayout';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminInvoices from './pages/Admin/AdminInvoices';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProductDetail from './pages/Product/ProductDetail';
import UserProfile from './pages/User/UserProfile';
import CategoryPage from './pages/Category/CategoryPage';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';

import './App.css';

const SessionManager = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    if (refreshToken) {
      try {
        const payload = JSON.parse(atob(refreshToken.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          alert('Phiên làm việc đã kết thúc. Hệ thống sẽ tự động đăng xuất để bảo mật!');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } catch (error) {
        console.error("Lỗi giải mã refresh token:", error);
      }
    } else if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          alert('Phiên đăng nhập của bạn đã hết hạn. Hệ thống sẽ tự động đăng xuất để bảo mật!');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } catch (error) {
        console.error("Lỗi giải mã access token:", error);
      }
    }
  }, [location, navigate]);

  return children;
};

const AdminRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) return <Navigate to="/login" replace />;

  try {
    const user = JSON.parse(userStr);
    if (user.isAdmin === true || user.isadmin === true) {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken'); 
    localStorage.removeItem('refreshToken'); 
    window.location.href = '/';
  }, []);
  return null;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <SessionManager>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/collections/:categoryId" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminLayout><AdminCategories /></AdminLayout></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminLayout><UserManagement /></AdminLayout></AdminRoute>} />
            <Route path="/admin/invoices" element={<AdminRoute><AdminLayout><AdminInvoices /></AdminLayout></AdminRoute>} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </SessionManager>
      </Router>
    </CartProvider>
  );
}

export default App;