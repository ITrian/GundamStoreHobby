import React, { useState, useEffect } from 'react';
import './ProductSection.css';

const ProductCard = ({ product }) => {
  const defaultPlaceholder = `https://via.placeholder.com/400x400/f0f0f0/333333?text=${product.name.replace(/ /g, '+')}`;
  
  // State lưu 2 ảnh: Ảnh mặc định (Thumb) và Ảnh khi Hover
  const [thumbImg, setThumbImg] = useState(defaultPlaceholder);
  const [hoverImg, setHoverImg] = useState(defaultPlaceholder);

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`${API_URL}/image/product/${product.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            // Lọc tìm ảnh chứa chữ "thumb" và "-1" trong tên file (cột detail)
            const thumbData = data.find(img => img.detail && img.detail.toLowerCase().includes('thumb'));
            const hoverData = data.find(img => img.detail && img.detail.toLowerCase().includes('-1'));

            // Fallback: Nếu không tìm thấy tên chuẩn, lấy ảnh đầu tiên làm Thumb, ảnh thứ 2 làm Hover
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

  return (
    <div className="product-card">
      <div className="product-image-container">
        
        {/* ẢNH THUMB (Mặc định hiện) */}
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
          // Nếu lỗi, fallback về lại ảnh thumb để tránh bị chớp trắng
          onError={(e) => { e.target.onerror = null; e.target.src = thumbImg; }}
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

// COMPONENT CHA
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