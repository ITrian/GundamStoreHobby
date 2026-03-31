import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/Home/HomePage';
import UserManagement from './pages/Admin/UserManagement'; 
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import AdminLayout from './layouts/AdminLayout/AdminLayout';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminCategories from './pages/Admin/AdminCategories';
import ProductDetail from './pages/Product/ProductDetail';

import './App.css';

const AdminRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  
  // Nếu chưa đăng nhập -> Đá về trang đăng nhập
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    // Nếu đã đăng nhập nhưng KHÔNG phải Admin -> Báo lỗi & Đá về trang chủ
    if (user.isAdmin === true) {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <Routes>

        {/* CÁC ROUTE PUBLIC (Ai cũng vào được) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* CÁC ROUTE ADMIN (Đã được bọc bởi <AdminRoute>) */}
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminLayout><AdminProducts /></AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminLayout><AdminCategories /></AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout><UserManagement /></AdminLayout>
            </AdminRoute>
          }
        />

        <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
        
      </Routes>
    </Router>
  );
}

export default App;