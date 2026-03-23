import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../pages/Home/HomePage.css'; // Load styles từ HomePage

const ClientLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/category/all`); 
        if (!response.ok) throw new Error('Lỗi tải danh mục');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Lỗi fetch category:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="homepage-container">
      {/* 1. HEADER CHÍNH */}
      <header className="main-header">
        <div className="header-top">
          <div className="logo-container">
            <Link to="/">
              <img src="/src/assets/Theliems.jpg" alt="Logo" className="logo" />
            </Link>
          </div>
          
          <div className="header-actions">
            <Link to="/login" className="action-item hide-on-mobile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="icon">👤</span>
              <div className="action-text">
                <p>Tài khoản</p>
                <strong>Đăng nhập</strong>
              </div>
            </Link>
            <div className="action-item cart-item">
              <span className="icon">🛒</span>
              <span className="cart-count">0</span>
            </div>
          </div>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Tìm theo tên sản phẩm..." />
          <button className="search-btn">🔍</button>
        </div>
      </header>

      {/* 2. THANH MENU ĐỎ (NAVBAR) */}
      <nav className="main-nav">
        <div className="nav-content">
          <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
            ☰ <span className="hide-on-mobile">DANH MỤC SẢN PHẨM</span>
          </button>
          
          <ul className="nav-links hide-on-mobile">
            <li>TẤT CẢ SẢN PHẨM</li>
            {categories.map((cat) => (
              <li key={cat.id}>{cat.name.toUpperCase()}</li>
            ))}
            <li>KIỂM TRA ĐƠN HÀNG</li>
          </ul>
          
          <div className="hotline">
            📞 <span className="hide-on-mobile">Hotline:</span> <strong>0349999943</strong>
          </div>
        </div>
      </nav>

      {/* 3. SIDEBAR (MENU BÊN TRÁI) */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/login" className="sidebar-account" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setIsSidebarOpen(false)}>
            👤 <strong>Đăng nhập</strong>
          </Link>
          <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>
        <ul className="sidebar-menu">
          <li>TẤT CẢ SẢN PHẨM</li>
          {categories.map((cat) => (
            <li key={`side-${cat.id}`}>{cat.name.toUpperCase()} <span className="arrow">›</span></li>
          ))}
          <li>KIỂM TRA ĐƠN HÀNG</li>
        </ul>
      </aside>

      {/* 4. MAIN CONTENT */}
      <main className="main-content" style={{ backgroundColor: '#f4f6f8' }}>
        {children}
      </main>

      {/* 5. FOOTER */}
      <footer className="main-footer">
        <div className="footer-columns">
          <div className="footer-col">
            <img src="/src/assets/Theliems.jpg" alt="Logo Footer" className="footer-logo" />
            <p><strong>The Liems's STOREHOBBY</strong></p>
            <p><strong>Địa chỉ:</strong> 180 Đường Cao Lỗ Quận 8</p>
            <p><strong>Email:</strong> contact@anhobbystore.com</p>
          </div>
          <div className="footer-col hide-on-mobile">
            <h4>Chính sách</h4>
            <ul>
              <li>Chính sách bảo mật</li>
              <li>Chính sách vận chuyển</li>
              <li>Chính sách đổi trả</li>
            </ul>
          </div>
          <div className="footer-col hide-on-mobile">
            <h4>Hỗ trợ khách hàng</h4>
            <ul>
              <li>Hướng dẫn mua hàng</li>
              <li>Tra cứu đơn hàng</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Tổng đài hỗ trợ</h4>
            <p className="footer-hotline">📞 0123.456.789</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
