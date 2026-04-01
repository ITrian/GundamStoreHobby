import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import './ProductDetail.css';
import { useCart } from '../../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);
  
  const [activeTab, setActiveTab] = useState('detail');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const prodRes = await fetch(`${API_URL}/products/${id}`);
        if (!prodRes.ok) throw new Error("Không tìm thấy sản phẩm");
        
        const prodData = await prodRes.json();
        setProduct(prodData);

        const imgRes = await fetch(`${API_URL}/images/product/${id}`);
        const imgData = imgRes.ok ? await imgRes.json() : [];

        if (imgData.length > 0) {
          const thumbImgObj = imgData.find(img => img.detail && img.detail.includes(`${id}-thumb`));
          
          let sortedImages = [];
          if (thumbImgObj) {
            const otherImgs = imgData.filter(img => img.link !== thumbImgObj.link).map(img => img.link);
            sortedImages = [thumbImgObj.link, ...otherImgs];
          } else {
            sortedImages = imgData.map(img => img.link);
          }
          
          setImages(sortedImages);
        } else {
          setImages([`https://via.placeholder.com/600x600/f0f0f0/333333?text=${prodData.name.replace(/ /g, '+')}`]);
        }

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    if (swiperInstance) swiperInstance.slideTo(index);
  };

  if (loading) return <div style={{ padding: '5vw', textAlign: 'center', fontSize: '4vw' }}>Đang tải thông tin sản phẩm...</div>;
  
  if (error || !product) return (
    <div style={{ padding: '5vw', textAlign: 'center', fontSize: '4vw', color: 'red' }}>
      Sản phẩm không tồn tại hoặc đã bị xóa!
      <br/><button onClick={() => navigate('/')} style={{ marginTop: '3vw', padding: '2vw 4vw', cursor: 'pointer' }}>Về trang chủ</button>
    </div>
  );

  const isOutOfStock = product.quantity <= 0;

  return (
    <ClientLayout>
      <div className="product-detail-wrapper">
        <div className="breadcrumb">
          Trang chủ / Tất cả sản phẩm / <span>{product.name}</span>
        </div>

        <div className="product-main-layout">
          
          {/* =======================================
              CỘT TRÁI (Bao gồm Ảnh và Tabs/Voucher) 
              ======================================= */}
          <div className="desktop-left-column">
            
            <div className="detail-gallery">
              <div className="main-image-box">
                <Swiper
                  modules={[Autoplay]}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  grabCursor={true}
                  onSwiper={setSwiperInstance}
                  onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                  className="product-swiper"
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img src={img} alt={`${product.name} ${index}`} className="main-img" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="thumbnail-list">
                {images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumb-item ${activeIndex === index ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img src={img} alt={`thumb-${index}`} />
                  </div>
                ))}
              </div>

              <div className="share-section">
                <span>Chia sẻ: </span>
                <span className="share-icon fb-icon"><i className="bi bi-facebook"></i></span>
                <span className="share-icon mess-icon"><i className="bi bi-messenger"></i></span>
              </div>
            </div>

            <div className="detail-bottom-section">
              <div className="voucher-box">
                <span className="voucher-title">Mã giảm giá</span>
                <div className="voucher-list">
                  <span className="voucher-tag"><i className="bi bi-ticket-perforated"></i> GIAM30KSHIP</span>
                  <span className="voucher-tag"><i className="bi bi-ticket-perforated"></i> GIAM10KSHIP</span>
                  <span className="voucher-arrow"><i className="bi bi-chevron-right"></i></span>
                </div>
              </div>

              <div className="tabs-container">
                <div className="tabs-header">
                  <div className={`tab-btn ${activeTab === 'detail' ? 'active' : ''}`} onClick={() => setActiveTab('detail')}>
                    ĐẶC ĐIỂM NỔI BẬT
                  </div>
                  <div className={`tab-btn ${activeTab === 'guide' ? 'active' : ''}`} onClick={() => setActiveTab('guide')}>
                    HƯỚNG DẪN MUA HÀNG
                  </div>
                  <div className={`tab-btn ${activeTab === 'policy' ? 'active' : ''}`} onClick={() => setActiveTab('policy')}>
                    CHÍNH SÁCH BÁN HÀNG
                  </div>
                </div>

                <div className="tab-content">
                  {activeTab === 'detail' && (
                    <div className="description-text">
                      <div style={{ whiteSpace: 'pre-wrap' }}>{product.detail || "Đang cập nhật mô tả cho sản phẩm này..."}</div>
                    </div>
                  )}
                  
                  {activeTab === 'guide' && (
                    <div className="policy-content">
                      <h4>1. Đặt hàng dễ dàng</h4>
                      <p>Quý khách có thể lựa chọn sản phẩm yêu thích và thêm vào giỏ hàng trực tiếp trên website. Nhập thông tin nhận hàng và số điện thoại để hệ thống ghi nhận.</p>
                      <h4>2. Xác nhận và Thanh toán</h4>
                      <p>The Liems Store sẽ gọi điện xác nhận tình trạng hàng hóa và phí vận chuyển (nếu có). Chúng tôi hỗ trợ giao hàng thu tiền tận nơi (COD) hoặc chuyển khoản ngân hàng.</p>
                    </div>
                  )}

                  {activeTab === 'policy' && (
                    <div className="policy-content">
                      <h4>1. Chính sách bảo mật</h4>
                      <p>Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng. Thông tin như tên, địa chỉ, số điện thoại chỉ được sử dụng duy nhất cho việc giao nhận hàng.</p>
                      <h4>2. Đổi trả & Bảo hành</h4>
                      <p>Các sản phẩm mô hình (Gunpla, 30MM...) được hỗ trợ đổi trả miễn phí trong 3 ngày nếu có lỗi từ nhà sản xuất (như thiếu Runner, gãy chốt trước khi xé bọc). <strong style={{color: '#e50000'}}>Lưu ý:</strong> Quý khách bắt buộc phải có video quay lại quá trình khui hộp (unbox) để được hỗ trợ giải quyết.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* =======================================
              CỘT PHẢI (Thông tin sản phẩm) 
              ======================================= */}
          <div className="detail-info sticky-sidebar">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-stats">
              <p><i className="bi bi-tag-fill" style={{ color: '#e67e22', marginRight: '1vw' }}></i> Có <strong>251</strong> lượt mua sản phẩm</p>
              <p><i className="bi bi-eye-fill" style={{ color: '#3498db', marginRight: '1vw' }}></i> Có <strong>4878</strong> lượt xem sản phẩm</p>
            </div>

            <div className="product-meta">
              <p>Thương hiệu: <span className="meta-highlight">BANDAI</span></p>
              <p>Mã sản phẩm: <span className="meta-highlight">{product.id}</span></p> 
            </div>

            <div className="product-price">
              {formatPrice(product.price)}
            </div>

            <button 
              className={`action-btn ${isOutOfStock ? 'out-of-stock' : 'add-to-cart'}`}
              disabled={isOutOfStock}
              onClick={() => addToCart(product, 1)}
            >
              {isOutOfStock ? 'HẾT HÀNG' : 'THÊM VÀO GIỎ HÀNG'}
            </button>

            <ul className="policy-list">
              <li><i className="bi bi-truck" style={{ fontSize: '1.2em', marginRight: '2vw', color: '#666' }}></i> Giao hàng hỏa tốc trong TP.HCM (phụ thuộc ứng dụng thu phí Grab/Ahamove)</li>
              <li><i className="bi bi-arrow-repeat" style={{ fontSize: '1.2em', marginRight: '2vw', color: '#666' }}></i> Chính sách đền bù hư hỏng (quay video khi nhận hàng)</li>
            </ul>
          </div>

        </div>
      </div>
    </ClientLayout>
  );
};

export default ProductDetail;