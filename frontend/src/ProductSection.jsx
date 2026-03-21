import React, { useState, useEffect } from 'react';
import './ProductSection.css';

const ProductCard = ({ product }) => {
  // 1. Khởi tạo ảnh mặc định (Placeholder)
  const defaultPlaceholder = `https://via.placeholder.com/400x400/f0f0f0/333333?text=${product.name.replace(/ /g, '+')}`;
  
  // State chứa link ảnh, ban đầu cho hiển thị luôn placeholder cho đỡ trống
  const [imageUrl, setImageUrl] = useState(defaultPlaceholder);

  const API_URL = 'https://gundamstorehobby.onrender.com';

  // 2. GỌI API LẤY ẢNH NGAY BÊN TRONG CARD
  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Gọi API lấy ảnh theo ID của sản phẩm này
        const res = await fetch(`${API_URL}/image/product/${product.id}`);
        if (res.ok) {
          const data = await res.json();
          // Nếu database có trả về mảng ảnh, lấy link của ảnh đầu tiên
          if (data && data.length > 0 && data[0].link) {
            setImageUrl(data[0].link);
          }
        }
      } catch (error) {
        console.error(`Lỗi tải ảnh cho SP ${product.id}:`, error);
        // Lỗi thì vẫn giữ nguyên defaultPlaceholder, không cần làm gì thêm
      }
    };

    fetchImage();
  }, [product.id]); // Chạy lại nếu product.id thay đổi

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.price || 0);

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={imageUrl}
          alt={product.name}
          className="product-image"
          // Dự phòng: Lỡ link tải về từ DB bị lỗi (die link), lại quay về placeholder
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultPlaceholder;
          }}
        />
        <button className="buy-now-btn">MUA NGAY</button>
      </div>
      <div className="product-info">
        <h3 className="product-name" title={product.name}>{product.name}</h3>
        <p className="product-price">{formattedPrice}</p>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT CHA: Giờ chỉ còn nhiệm vụ gọi Product
// ==========================================
const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/product/getAllProducts`);
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