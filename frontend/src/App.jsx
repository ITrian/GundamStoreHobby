// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Các Component của khách hàng
import HomePage from './HomePage';
import UserManagement from './UserManagement'; // Chứa code cũ của bạn

// Các Component của Admin (ĐẢM BẢO BẠN ĐÃ TẠO 2 FILE NÀY TRONG CÙNG THƯ MỤC)
import AdminLayout from './AdminLayout';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* =========================================
            TRANG DÀNH CHO KHÁCH HÀNG 
            ========================================= */}
        <Route path="/" element={<HomePage />} />
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