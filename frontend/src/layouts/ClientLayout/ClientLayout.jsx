import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../pages/Home/HomePage.css';
import { useCart } from '../../contexts/CartContext';
import SideCart from '../../components/SideCart/SideCart';

import logoImg from '../../assets/Theliems.jpg';

const ClientLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null); 
  const { cartCount, setIsSideCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections/all?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`); 
        if (!response.ok) throw new Error('Lỗi tải danh mục');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Lỗi fetch category:', error);
      }
    };
    fetchCategories();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi parse user:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
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
            
            {user ? (
              <div className="action-item hide-on-mobile no-underline">
                <Link to="/profile" className="icon" style={{ color: '#e50000', textDecoration: 'none' }}>
                  <i className="bi bi-person-check-fill"></i>
                </Link>
                <div className="action-text">
                  <Link to="/profile" style={{ fontWeight: 'bold', color: '#1a73e8', textDecoration: 'none', display: 'block', marginBottom: '0.2vw' }}>
                    {user.name || user.username}
                  </Link>
                  <span onClick={handleLogout} style={{ fontWeight: 'bold', color: '#555', textDecoration: 'none', cursor: 'pointer' }}>
                    Đăng xuất
                  </span>
                </div>
              </div>
            ) : (
              <Link to="/login" className="action-item hide-on-mobile no-underline">
                <span className="icon"><i className="bi bi-person-circle"></i></span>
                <div className="action-text">
                  <p>Tài khoản</p>
                  <strong>Đăng nhập</strong>
                </div>
              </Link>
            )}

            <div className="action-item cart-item" onClick={() => setIsSideCartOpen(true)} style={{ cursor: 'pointer' }}>
              <span className="icon"><i className="bi bi-cart3"></i></span>
              <span className="cart-count">{cartCount}</span>
            </div>
          </div>
        </div>

        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Tìm theo tên sản phẩm..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn"><i className="bi bi-search"></i></button>
        </form>
      </header>

      <nav className="main-nav">
        <div className="nav-content">
          <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
            <i className="bi bi-list"></i> <span className="hide-on-mobile">DANH MỤC SẢN PHẨM</span>
          </button>
          
          <ul className="nav-links hide-on-mobile">
            <li><Link to="/collections/all" >TẤT CẢ SẢN PHẨM</Link></li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link to={`/collections/${cat.id}`} style={{color: 'inherit', textDecoration: 'none'}}>{cat.name.toUpperCase()}</Link>
              </li>
            ))}
            {user && user.isadmin && (
              <li><Link to="/admin" >VÀO TRANG ADMIN</Link></li>
            )}
          </ul>
          
          <div className="hotline">
            <i className="bi bi-telephone-fill icon-mr-sm"></i> 
            <span className="hide-on-mobile">Hotline:</span> <strong>0349999943</strong>
          </div>
        </div>
      </nav>

      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          
          {user ? (
             <div className="action-text">
                <Link to="/profile" style={{ fontWeight: 'bold', color: '#1a73e8', textDecoration: 'none', display: 'block', marginBottom: '1vw' }}>
                  <i className="bi bi-person-circle icon-mr-sm"></i> {user.name || user.username}
                </Link>
                <span onClick={handleLogout} style={{ fontWeight: 'bold', color: '#e50000', textDecoration: 'none', cursor: 'pointer' }}>
                  <i className="bi bi-box-arrow-right icon-mr-sm"></i> Đăng xuất
                </span>
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
          <li><Link to="/collections/all" style={{textDecoration: 'none'}} onClick={() => setIsSidebarOpen(false)}>TẤT CẢ SẢN PHẨM</Link></li>
          {categories.map((cat) => (
            <li key={`side-${cat.id}`}>
              <Link to={`/collections/${cat.id}`} style={{textDecoration: 'none'}} onClick={() => setIsSidebarOpen(false)}>{cat.name.toUpperCase()} <i className="bi bi-chevron-right arrow"></i></Link>
            </li>
          ))}
          {user && user.isadmin && (
            <li><Link to="/admin" style={{ color: '#e50000', textDecoration: 'none' }} onClick={() => setIsSidebarOpen(false)}>→ QUẢN TRỊ ADMIN</Link></li>
          )}
        </ul>
      </aside>

      <main className="main-content layout-bg">
        {children}
      </main>
      
      <SideCart />

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