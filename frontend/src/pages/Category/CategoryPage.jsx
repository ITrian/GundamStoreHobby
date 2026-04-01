import React, { useEffect, useState, useMemo } from 'react';
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

  // States for filter and sort
  const [sortOption, setSortOption] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Common brands to display in sidebar
  const brandList = ['Bandai', 'emperor', 'Nuke Matrix', 'WOLF MODEL', 'LUNAVOR', 'Form Owner'];

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

  // Xử lý logic sắp xếp và lọc ngay tại Frontend
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Lọc theo Hãng sản xuất bằng cách match chuỗi tên (do DB có thể chưa tách riêng trường brand)
    if (selectedBrands.length > 0) {
      result = result.filter(p => {
        const pName = (p.name || '').toLowerCase();
        return selectedBrands.some(brand => pName.includes(brand.toLowerCase()));
      });
    }

    // Sắp xếp
    switch (sortOption) {
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Giả sử id lớn hơn là mới hơn
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }
    return result;
  }, [products, sortOption, selectedBrands]);

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
                <span className={`filter-btn ${sortOption === 'name_asc' ? 'active' : ''}`} onClick={() => setSortOption('name_asc')}>Tên A &rarr; Z</span>
                <span className={`filter-btn ${sortOption === 'name_desc' ? 'active' : ''}`} onClick={() => setSortOption('name_desc')}>Tên Z &rarr; A</span>
                <span className={`filter-btn ${sortOption === 'price_asc' ? 'active' : ''}`} onClick={() => setSortOption('price_asc')}>Giá tăng dần</span>
                <span className={`filter-btn ${sortOption === 'price_desc' ? 'active' : ''}`} onClick={() => setSortOption('price_desc')}>Giá giảm dần</span>
                <span className={`filter-btn ${sortOption === 'newest' ? 'active' : ''}`} onClick={() => setSortOption('newest')}>Mới nhất</span>
              </div>
            </div>

            {loading ? (
              <p>Đang tải...</p>
            ) : (
              <div className="cat-product-grid">
                {processedProducts.length > 0 ? (
                  processedProducts.map(p => <CategoryProductCard key={p.id} product={p} />)
                ) : (
                  <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>Không tìm thấy sản phẩm phù hợp với bộ lọc.</p>
                )}
              </div>
            )}
          </div>

          <aside className="category-sidebar">
            <div className="sidebar-box">
              <h3>Hãng sản xuất</h3>
              <ul className="brand-list">
                {brandList.map(brand => (
                  <li key={brand}>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand)}
                        onChange={() => {
                          setSelectedBrands(prev => 
                            prev.includes(brand)
                              ? prev.filter(b => b !== brand)
                              : [...prev, brand]
                          );
                        }}
                      /> {brand}
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
