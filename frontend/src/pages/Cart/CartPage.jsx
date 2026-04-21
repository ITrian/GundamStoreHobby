import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';
import { useCart } from '../../contexts/CartContext';
import './CartPage.css';

const CartItemRow = ({ item, updateQuantity, removeFromCart, formatPrice }) => {
  const [thumbImg, setThumbImg] = React.useState(`https://via.placeholder.com/80/f0f0f0/333333?text=${encodeURIComponent(item.name || 'Sản phẩm')}`);
  const API_URL = 'https://gundamstorehobby.onrender.com';

  React.useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`${API_URL}/images/product/${item.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const thumbData = data.find(img => img.detail && img.detail.toLowerCase().includes('thumb'));
            setThumbImg(thumbData ? thumbData.link : data[0].link);
          }
        }
      } catch (err) {
        console.error(`Lỗi tải ảnh giỏ hàng cho SP ${item.id}:`, err);
      }
    };
    if (item.id) fetchImage();
  }, [item.id]);

  return (
    <div className="cart-item-row">
      <div className="col-product item-details-col">
        <img 
          src={thumbImg} 
          alt={item.name || 'Sản phẩm'} 
          onError={(e) => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/80/f0f0f0/333333?text=${encodeURIComponent(item.name || 'Sản phẩm')}`; }}
        />
        <span className="item-name">{item.name || 'Sản phẩm'}</span>
      </div>
      <div className="col-price item-price">
        {formatPrice(item.price)}
      </div>
      <div className="col-qty item-qty-controls">
        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
        <input type="text" value={item.quantity} readOnly />
        <button onClick={() => {
          if (item.stock !== undefined && item.quantity >= item.stock) {
            return;
          }
          updateQuantity(item.id, 1);
        }}>+</button>

      </div>
      <div className="col-sub item-subtotal">
        {formatPrice(item.price * item.quantity)}
        <button className="item-remove-btn" onClick={() => removeFromCart(item.id)}>
          &times;
        </button>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <ClientLayout>
      <div className="cart-page-container">
        <div className="cart-header">
          <h2>Giỏ hàng</h2>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart-message">
            <p>Giỏ hàng của bạn đang trống.</p>
            <button className="continue-shopping" onClick={() => navigate('/collections/all')}>
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="cart-content-wrapper">
            <div className="cart-main">
              <div className="cart-table-header">
                <div className="col-product">Sản phẩm</div>
                <div className="col-price">Đơn giá</div>
                <div className="col-qty">Số lượng</div>
                <div className="col-sub">Tạm tính</div>
              </div>

              <div className="cart-item-list">
                {cartItems.map(item => (
                  <CartItemRow 
                    key={item.id} 
                    item={item} 
                    updateQuantity={updateQuantity} 
                    removeFromCart={removeFromCart} 
                    formatPrice={formatPrice} 
                  />
                ))}
              </div>
            </div>

            <div className="cart-sidebar">
              <div className="checkout-summary-box">
                <div className="summary-total">
                  <span>TỔNG CỘNG</span>
                  <span className="total-amount">{formatPrice(cartTotal)}</span>
                </div>
                <button className="btn-checkout-full" onClick={handleCheckout}>
                  THANH TOÁN &rarr;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default CartPage;