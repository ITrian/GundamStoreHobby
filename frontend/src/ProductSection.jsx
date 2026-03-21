import React, { useState, useEffect } from 'react';
import './ProductSection.css'; // File CSS giữ nguyên

const ProductCard = ({ product }) => {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.price || 0);

  return (
    <div className="product-card">
      <div className="product-image-container">
        {/* Placeholder xử lý khoảng trắng trong tên để link ảnh không bị lỗi */}
        <img
          src={`https://via.placeholder.com/400x400/f0f0f0/333333?text=${product.name.replace(/ /g, '+')}`}
          alt={product.name}
          className="product-image"
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