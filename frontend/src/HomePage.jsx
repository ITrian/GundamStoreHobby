import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import './HomePage.css';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  
  // State quản lý mở/đóng menu danh mục (Burger menu)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/category/all`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/product/all`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="home-container">
      {/* HEADER TOP */}
      <header className="home-header">
        <div className="header-top">
          <div className="logo">
            <Link to="/">
              <h1>The Liems's <br/>STOREHOBBY</h1>
            </Link>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Tìm kiếm sản phẩm bạn mong muốn..." />
            <button>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
          <div className="header-actions">
            <Link to="/users" className="action-item">
              <span>Tài khoản</span>
            </Link>
            <div className="action-item cart-btn">
              <span>Giỏ hàng (0)</span>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION BAR (Có Burger Menu) */}
      <nav className="main-nav">
        <div className="nav-container">
          {/* Cột Danh mục sản phẩm */}
          <div 
            className="category-wrapper"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <div className="category-btn">
              <span className="burger-icon">☰</span>
              <span>DANH MỤC SẢN PHẨM</span>
            </div>
            
            {/* Dropdown Menu - Luôn hiện khi hover */}
            <ul className={`category-dropdown ${isCategoryOpen ? 'show' : ''}`}>
              {
                categories.map(cat => (
                  <li key={cat.id}><Link to={`/category/${cat.id}`}>{cat.name}</Link></li>
                ))
              }
            </ul>
          </div>

          {/* Cột Menu chính */}
          <ul className="main-menu">
            <li><Link to="/">Trang chủ</Link></li>
            {
                categories.map(cat => (
                  <li key={cat.id}><Link to={`/category/${cat.id}`}>{cat.name}</Link></li>
                ))
              }
          </ul>
        </div>
      </nav>

      {/* HERO BANNER */}
      <section className="hero-banner">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="mySwiper"
        >
          {/* Bạn có thể thay background bằng URL ảnh thật sau này: style={{ backgroundImage: 'url(...)' }} */}
          <SwiperSlide>
            <div className="slide-content bg-1">
              <div className="banner-text">
                <h2>PGU 1/60 Nu Gundam</h2>
                <p>Khám phá bộ sưu tập mô hình cơ giáp đỉnh cao</p>
                <button className="banner-btn">XEM NGAY</button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content bg-2">
              <div className="banner-text">
                <h2>DỤNG CỤ CHUYÊN NGHIỆP</h2>
                <p>Trang bị tốt nhất cho mọi Builder</p>
                <button className="banner-btn">MUA SẮM NGAY</button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* SẢN PHẨM NỔI BẬT */}
      <main className="main-content">
        <section className="product-section">
          <div className="section-header">
            <h2 className="section-title">SẢN PHẨM NỔI BẬT</h2>
          </div>
          
          {products.length === 0 ? (
            <p style={{ textAlign: 'center', margin: '40px 0' }}>Đang tải sản phẩm...</p>
          ) : (
            <>
              <div className="product-grid">
                {currentProducts.map(product => (
                  <div className="product-card" key={product.id}>
                    <div className="product-img">
                      <img src={`https://via.placeholder.com/300x300?text=${product.name.replace(/ /g, '+')}`} alt={product.name} />
                      <div className="overlay-actions">
                        <button className="quick-view-btn">Xem Nhanh</button>
                      </div>
                    </div>
                    <div className="product-info">
                      <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
                      <p className="price">{formatPrice(product.price)}</p>
                      <button className="add-to-cart">Thêm vào giỏ</button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>&laquo;</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ''}>
                      {number}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>&raquo;</button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-top">
          <div className="footer-col about-col">
            <h2 className="footer-logo">The Liems's STOREHOBBY</h2>
            <p>Cửa hàng chuyên cung cấp các loại mô hình lắp ráp (Gunpla, Mecha...), dụng cụ, sơn và phụ kiện chính hãng chất lượng cao.</p>
            <div className="contact-info">
              <p>180 Đường Cao Lỗ Quận 8 73018 </p>
              <p>📞 Hotline: 0123.456.789</p>
              <p>✉️ Email: contact@anhobbystore.com</p>
            </div>
          </div>
          <div className="footer-col links-col">
            <h3>HỖ TRỢ KHÁCH HÀNG</h3>
            <ul>
              <li><Link to="#">Hướng dẫn mua hàng</Link></li>
              <li><Link to="#">Hướng dẫn thanh toán</Link></li>
              <li><Link to="#">Tra cứu đơn hàng</Link></li>
              <li><Link to="#">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>
          <div className="footer-col links-col">
            <h3>CHÍNH SÁCH</h3>
            <ul>
              <li><Link to="#">Chính sách bảo mật</Link></li>
              <li><Link to="#">Chính sách vận chuyển</Link></li>
              <li><Link to="#">Chính sách đổi trả</Link></li>
              <li><Link to="#">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>
          <div className="footer-col social-col">
            <h3>KẾT NỐI VỚI CHÚNG TÔI</h3>
            <div className="social-links">
              <span className="social-icon">FB</span>
              <span className="social-icon">IG</span>
              <span className="social-icon">YT</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Bản quyền thuộc về The Liems's STOREHOBBY. Code by Lộc.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;