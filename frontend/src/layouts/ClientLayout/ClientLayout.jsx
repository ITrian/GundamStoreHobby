import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../pages/Home/HomePage.css';

import logoImg from '../../assets/Theliems.jpg';

const ClientLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null); // State lưu thông tin user đăng nhập
  
  const navigate = useNavigate();
  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    // 1. Fetch Categories
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

    // 2. Lấy thông tin user từ localStorage nếu đã đăng nhập
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi parse user:", error);
      }
    }
  }, []);

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa thông tin lưu trữ
    setUser(null); // Xóa state
    alert("Đã đăng xuất thành công!");
    navigate('/'); // Đá về trang chủ
  };

  return (
    <div className="homepage-container">
      
      <header className="main-header">
        <div className="header-top">
          <div className="logo-container">
            <Link to="/">
              <img src={logoImg} alt="Logo" className="logo" />
            </Link>
          </div>
          
          <div className="header-actions">
            
            {/* KIỂM TRA ĐĂNG NHẬP Ở HEADER */}
            {user ? (
              // Nếu đã đăng nhập -> Hiện Tên và nút Đăng xuất
              <div className="action-item hide-on-mobile no-underline" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                <span className="icon" style={{ color: '#e50000' }}><i className="bi bi-person-check-fill"></i></span>
                <div className="action-text">
                  <p style={{ fontWeight: 'bold', color: '#1a73e8' }}>{user.name || user.username}</p>
                  <strong>Đăng xuất</strong>
                </div>
              </div>
            ) : (
              // Nếu CHƯA đăng nhập -> Hiện nút Đăng nhập
              <Link to="/login" className="action-item hide-on-mobile no-underline">
                <span className="icon"><i className="bi bi-person-circle"></i></span>
                <div className="action-text">
                  <p>Tài khoản</p>
                  <strong>Đăng nhập</strong>
                </div>
              </Link>
            )}

            <div className="action-item cart-item">
              <span className="icon"><i className="bi bi-cart3"></i></span>
              <span className="cart-count">0</span>
            </div>
          </div>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Tìm theo tên sản phẩm..." />
          <button className="search-btn"><i className="bi bi-search"></i></button>
        </div>
      </header>

      <nav className="main-nav">
        <div className="nav-content">
          <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
            <i className="bi bi-list"></i> <span className="hide-on-mobile">DANH MỤC SẢN PHẨM</span>
          </button>
          
          <ul className="nav-links hide-on-mobile">
            <li>TẤT CẢ SẢN PHẨM</li>
            {categories.map((cat) => (
              <li key={cat.id}>{cat.name.toUpperCase()}</li>
            ))}
            <li>KIỂM TRA ĐƠN HÀNG</li>
            {/* Nút ẩn: Nếu là Admin mới hiện link vào trang Quản trị */}
            {user && user.isAdmin && (
              <li><Link to="/admin" style={{ color: '#fff', textDecoration: 'none', backgroundColor: '#333', padding: '0.3vw 1vw', borderRadius: '1vw' }}>VÀO TRANG ADMIN</Link></li>
            )}
          </ul>
          
          <div className="hotline">
            <i className="bi bi-telephone-fill icon-mr-sm"></i> 
            <span className="hide-on-mobile">Hotline:</span> <strong>0349999943</strong>
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR CHO MOBILE --- */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          
          {/* KIỂM TRA ĐĂNG NHẬP Ở SIDEBAR */}
          {user ? (
            <div className="sidebar-account no-underline" style={{ cursor: 'pointer', color: '#e50000' }} onClick={() => { handleLogout(); setIsSidebarOpen(false); }}>
              <i className="bi bi-box-arrow-right icon-mr-lg"></i>
              <strong>Đăng xuất ({user.name || user.username})</strong>
            </div>
          ) : (
            <Link to="/login" className="sidebar-account no-underline" onClick={() => setIsSidebarOpen(false)}>
              <i className="bi bi-person-circle icon-mr-lg"></i>
              <strong>Đăng nhập</strong>
            </Link>
          )}

          <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <ul className="sidebar-menu">
          <li>TẤT CẢ SẢN PHẨM</li>
          {categories.map((cat) => (
            <li key={`side-${cat.id}`}>
              {cat.name.toUpperCase()} <i className="bi bi-chevron-right arrow"></i>
            </li>
          ))}
          <li>KIỂM TRA ĐƠN HÀNG</li>
          {user && user.isAdmin && (
            <li><Link to="/admin" style={{ color: '#e50000', textDecoration: 'none' }}>→ QUẢN TRỊ ADMIN</Link></li>
          )}
        </ul>
      </aside>

      <main className="main-content layout-bg">
        {children}
      </main>

      <footer className="main-footer">
        <div className="footer-columns">
          <div className="footer-col">
            <img src={logoImg} alt="Logo Footer" className="footer-logo" />
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
            <p className="footer-hotline">
              <i className="bi bi-telephone-fill icon-mr-md"></i> 0123.456.789
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;