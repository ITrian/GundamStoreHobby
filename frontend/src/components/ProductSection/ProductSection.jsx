import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductSection.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate(); 
  const defaultPlaceholder = `https://via.placeholder.com/400x400/f0f0f0/333333?text=${product.name.replace(/ /g, '+')}`;
  
  const [thumbImg, setThumbImg] = useState(defaultPlaceholder);
  const [hoverImg, setHoverImg] = useState(defaultPlaceholder);

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`${API_URL}/images/product/${product.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const thumbData = data.find(img => img.detail && img.detail.toLowerCase().includes('thumb'));
            const hoverData = data.find(img => img.detail && img.detail.toLowerCase().includes('-1'));

            const finalThumb = thumbData ? thumbData.link : data[0].link;
            const finalHover = hoverData ? hoverData.link : (data.length > 1 ? data[1].link : finalThumb);

            setThumbImg(finalThumb);
            setHoverImg(finalHover);
          }
        }
      } catch (error) {
        console.error(`Lỗi tải ảnh cho SP ${product.id}:`, error);
      }
    };

    fetchImage();
  }, [product.id]);

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.price || 0);

  // --- HÀM XỬ LÝ CHUYỂN TRANG ---
  const handleCardClick = () => {
    navigate(`/product/${product.id}`); 
  };

  // --- HÀM XỬ LÝ NÚT MUA NGAY ---
  const handleBuyNow = (e) => {
    e.stopPropagation(); // QUAN TRỌNG: Ngăn không cho sự kiện click lan ra thẻ cha, tránh bị chuyển trang
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    // Sau này sẽ viết logic gọi API giỏ hàng ở đây
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        
        <img
          src={thumbImg}
          alt={`${product.name} thumb`}
          className="product-image img-thumb"
          onError={(e) => { e.target.onerror = null; e.target.src = defaultPlaceholder; }}
        />

        {/* ẢNH HOVER (Mặc định ẩn, sẽ Fade in khi rẽ chuột) */}
        <img
          src={hoverImg}
          alt={`${product.name} hover`}
          className="product-image img-hover"
          onError={(e) => { e.target.onerror = null; e.target.src = thumbImg; }}
        />

        <button className="buy-now-btn" onClick={handleBuyNow}>MUA NGAY</button>
      </div>
      <div className="product-info">
        <h3 className="product-name" title={product.name}>{product.name}</h3>
        <p className="product-price">{formattedPrice}</p>
      </div>
    </div>
  );
};

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading-text">Đang tải sản phẩm...</div>;

  return (
    <section className="product-section">
      <div className="section-header">
        <h2 className="section-title">SẢN PHẨM NỔI BẬT</h2>
        <a href="#xem-them" className="view-more">Xem thêm &gt;</a>
      </div>
      
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;