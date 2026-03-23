import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard'},
    { path: '/admin/categories', name: 'Quản lý Danh mục'},
    { path: '/admin/products', name: 'Quản lý Sản phẩm'},
    { path: '/admin/invoices', name: 'Quản lý Hóa đơn'},
    { path: '/admin/users', name: 'Quản lý Tài khoản'},
    { path: '/', name: 'Storefront'},
  ];

  return (
    <div className="admin-container">
      {/* Lớp phủ màn hình tối cho mobile khi mở menu */}
      <div 
        className={`admin-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>ADMIN PANEL</h2>
          <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path} onClick={() => setIsSidebarOpen(false)}>
                <span className="icon">{item.icon}</span> {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
            ☰
          </button>
          <div className="admin-profile">
            <span>Chào, Admin!</span>
          </div>
        </header>
        
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;