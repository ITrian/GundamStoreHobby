import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductSection from './ProductSection';
import './HomePage.css'; // File CSS giữ nguyên như bản Mobile-First trước đó

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const API_URL = 'https://gundamstorehobby.onrender.com';

  // Gọi API lấy danh mục sản phẩm từ server Render
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
            <img src="./src/assets/Theliems.jpg" alt="Logo" className="logo" />
          </div>
          
          <div className="header-actions">
            <div className="action-item hide-on-mobile">
              <span className="icon">👤</span>
              <div className="action-text">
                <p>Tài khoản</p>
                <strong>Đăng nhập</strong>
              </div>
            </div>
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
          <div className="sidebar-account">
            👤 <strong>Đăng nhập</strong>
          </div>
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

      {/* 4. KHU VỰC BANNERS */}
      <main className="main-content">
        <div className="banner-section">
          <div className="main-banner">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              loop={true}
            >
              <SwiperSlide><img src="https://placehold.co/1200x600/1a2b4c/FFF?text=BANNER+CHINH+1+-+GUNDAM" alt="Banner 1" className="banner-img" /></SwiperSlide>
              <SwiperSlide><img src="https://placehold.co/1200x600/8b0000/FFF?text=BANNER+CHINH+2+-+SALE" alt="Banner 2" className="banner-img" /></SwiperSlide>
            </Swiper>
          </div>
          <div className="sub-banners">
            <img src="https://placehold.co/600x190/000/FFF?text=BLACK+FRIDAY" alt="Sub Banner 1" className="banner-img" />
            <img src="https://placehold.co/600x190/8b0000/FFF?text=VOUCHER+30K" alt="Sub Banner 2" className="banner-img" />
            <img src="https://placehold.co/600x190/333/FFF?text=PRE-ORDER" alt="Sub Banner 3" className="banner-img" />
          </div>
        </div>

        {/* 5. KHU VỰC SẢN PHẨM */}
        <ProductSection />
      </main>

      {/* 6. FOOTER */}
      <footer className="main-footer">
        <div className="footer-columns">
          <div className="footer-col">
            <img src="./src/assets/Theliems.jpg" alt="Logo Footer" className="footer-logo" />
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

export default HomePage;