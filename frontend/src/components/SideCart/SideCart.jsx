import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './SideCart.css';

const CartItemRow = ({ item, updateQuantity, removeFromCart }) => {
  const itemName = item?.name || 'Sản phẩm';
  const defaultPlaceholder = `https://via.placeholder.com/80/f0f0f0/333333?text=${encodeURIComponent(itemName)}`;
  const [thumbImg, setThumbImg] = useState(defaultPlaceholder);

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`${API_URL}/images/product/${item.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const thumbData = data.find(img => img.detail && img.detail.toLowerCase().includes('thumb'));
            const finalThumb = thumbData ? thumbData.link : data[0].link;
            setThumbImg(finalThumb);
          }
        }
      } catch (error) {
        console.error(`Lỗi tải ảnh giỏ hàng cho SP ${item.id}:`, error);
      }
    };

    fetchImage();
  }, [item.id]);

  return (
    <div className="cart-item-row">
      <div className="col-product item-info">
        <img 
          src={thumbImg} 
          alt={item.name} 
          onError={(e) => { e.target.onerror = null; e.target.src = defaultPlaceholder; }}
        />
        <span>{item.name}</span>
      </div>
      <div className="col-price" style={{ color: '#e50000', fontWeight: 'bold' }}>
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
      </div>
      <div className="col-qty qty-controls">
        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
        <span>{item.quantity}</span>
        
        <button onClick={() => {
          if (item.stock !== undefined && item.quantity >= item.stock) {
            return;
          }
          updateQuantity(item.id, 1);
        }}>+</button>

      </div>
      <div className="col-sub" style={{ color: '#e50000', fontWeight: 'bold' }}>
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
        <span className="remove-item" onClick={() => removeFromCart(item.id)}>&times;</span>
      </div>
    </div>
  );
};

const SideCart = () => {
  const { cartItems, isSideCartOpen, setIsSideCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const formattedTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(cartTotal);

  if (!isSideCartOpen) return null;

  return (
    <>
      <div className="sidecart-overlay" onClick={() => setIsSideCartOpen(false)}></div>
      <div className={`sidecart-container ${isSideCartOpen ? 'open' : ''}`}>
        <div className="sidecart-header">
          <h2>Giỏ hàng</h2>
          <button className="close-btn" onClick={() => setIsSideCartOpen(false)}>&times;</button>
        </div>
        
        <div className="sidecart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart-msg">Giỏ hàng của bạn đang trống.</p>
          ) : (
            <div className="cart-item-list">
              <div className="table-header">
                <span className="col-product">Sản phẩm</span>
                <span className="col-price">Đơn giá</span>
                <span className="col-qty">Số lượng</span>
                <span className="col-sub">Tạm tính</span>
              </div>
              
              {cartItems.map((item, index) => (
                <CartItemRow 
                  key={index} 
                  item={item} 
                  updateQuantity={updateQuantity} 
                  removeFromCart={removeFromCart} 
                />
              ))}
              
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="sidecart-footer">
            <div className="total-row">
              <h3>TỔNG CỘNG</h3>
              <h3 style={{ color: '#e50000' }}>{formattedTotal}</h3>
            </div>
            <p className="note">Nhập mã giảm giá ở trang thanh toán</p>
            <button 
              className="checkout-btn" 
              onClick={() => {
                setIsSideCartOpen(false);
                navigate('/cart');
              }}
            >
              THANH TOÁN &rarr;
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SideCart;