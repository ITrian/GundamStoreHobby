// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Các Component của khách hàng
import HomePage from './pages/Home/HomePage';
import UserManagement from './pages/Admin/UserManagement'; // Chứa code cũ của bạn
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Các Component của Admin (ĐẢM BẢO BẠN ĐÃ TẠO 2 FILE NÀY TRONG CÙNG THƯ MỤC)
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminCategories from './pages/Admin/AdminCategories';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* =========================================
            TRANG DÀNH CHO KHÁCH HÀNG 
            ========================================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<UserManagement />} />

        {/* =========================================
            TRANG DÀNH CHO ADMIN
            ========================================= */}
        {/* Trang Quản lý sản phẩm (Được bọc bên trong Layout của Admin) */}
        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminLayout>
              <AdminCategories />
            </AdminLayout>
          }
        />

        {/* Khi gõ /admin trên thanh địa chỉ, tự động chuyển hướng sang /admin/products */}
        <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
      </Routes>
    </Router>
  );
}

export default App;