import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';
import './CategoryPage.css';
import { useCart } from '../../contexts/CartContext';

const API_URL = 'https://gundamstorehobby.onrender.com';

const CategoryProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const defaultPlaceholder = `https://via.placeholder.com/400x400/f0f0f0/333333?text=${product.name.replace(/ /g, '+')}`;
  
  const [thumbImg, setThumbImg] = useState(defaultPlaceholder);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`${API_URL}/images/product/${product.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const thumbData = data.find(img => img.detail && img.detail.toLowerCase().includes('thumb'));
            setThumbImg(thumbData ? thumbData.link : data[0].link);
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

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="cat-product-card">
      <div className="cat-product-image-container">
        <img src={thumbImg} alt={product.name} />
        <button className="cat-buy-btn" onClick={handleBuyNow}>THÊM VÀO GIỎ</button>
      </div>
      <div className="cat-product-info">
        <h3>{product.name}</h3>
        <p className="price">{formattedPrice}</p>
      </div>
    </Link>
  );
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/categories`)
        ]);

        if (prodRes.ok && catRes.ok) {
          const prods = await prodRes.json();
          const cats = await catRes.json();
          setCategories(cats);

          if (categoryId && categoryId !== 'all') {
            const filtered = prods.filter(p => p.categoryid.toString() === categoryId);
            setProducts(filtered);
          } else {
            setProducts(prods);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const currentCategory = categoryId === 'all' 
    ? { name: 'Tất cả sản phẩm' } 
    : categories.find(c => c.id.toString() === categoryId);

  return (
    <ClientLayout>
      <div className="category-page-container">
        <div className="category-banner">
          <img src="https://placehold.co/1200x300/1a2b4c/FFF?text=THẾ+GIỚI+MÔ+HÌNH+GUNDAM" alt="Banner" />
        </div>
        
        <div className="category-content-wrapper">
          <div className="category-main">
            <div className="category-header">
              <h2>{currentCategory ? currentCategory.name : 'Sản phẩm'}</h2>
              <div className="category-filters">
                <span className="filter-btn">Tên A &rarr; Z</span>
                <span className="filter-btn">Tên Z &rarr; A</span>
                <span className="filter-btn">Giá tăng dần</span>
                <span className="filter-btn">Giá giảm dần</span>
                <span className="filter-btn">Mới nhất</span>
              </div>
            </div>

            {loading ? (
              <p>Đang tải...</p>
            ) : (
              <div className="cat-product-grid">
                {products.length > 0 ? (
                  products.map(p => <CategoryProductCard key={p.id} product={p} />)
                ) : (
                  <p>Không có sản phẩm nào trong danh mục này.</p>
                )}
              </div>
            )}
          </div>

          <aside className="category-sidebar">
            <div className="sidebar-box">
              <h3>Hãng sản xuất</h3>
              <ul className="brand-list">
                {['emperor', 'Nuke Matrix', 'WOLF MODEL', 'LUNAVOR', 'Form Owner'].map(brand => (
                  <li key={brand}>
                    <label>
                      <input type="checkbox" /> {brand}
                    </label>
                  </li>
                ))}
              </ul>
              <div className="sidebar-more">Xem thêm &or;</div>
            </div>
            <div className="sidebar-box">
              <h3>Danh Mục</h3>
              <ul className="brand-list">
                <li>
                  <Link to="/collections/all">Tất cả sản phẩm</Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link to={`/collections/${cat.id}`}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </ClientLayout>
  );
};

export default CategoryPage;
