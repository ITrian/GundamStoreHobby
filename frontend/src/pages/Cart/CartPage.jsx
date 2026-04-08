import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';
import { useCart } from '../../contexts/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleCheckout = () => {
    // The user requested to redirect to payment page without implementing it
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
                  <div key={item.id} className="cart-item-row">
                    <div className="col-product item-details-col">
                      <img 
                        src={`https://via.placeholder.com/80/f0f0f0/333333?text=${encodeURIComponent(item.name || 'Sản phẩm')}`} 
                        alt={item.name || 'Sản phẩm'} 
                      />
                      <span className="item-name">{item.name || 'Sản phẩm'}</span>
                    </div>
                    <div className="col-price item-price">
                      {formatPrice(item.price)}
                    </div>
                    <div className="col-qty item-qty-controls">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <input type="text" value={item.quantity} readOnly />
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <div className="col-sub item-subtotal">
                      {formatPrice(item.price * item.quantity)}
                      <button className="item-remove-btn" onClick={() => removeFromCart(item.id)}>
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-sidebar">
              <div className="checkout-summary-box">
                <div className="summary-row">
                  <i className="bi bi-receipt"></i> Xuất hóa đơn <span className="editable-text">Thay đổi &gt;</span>
                </div>
                <div className="summary-row">
                  <i className="bi bi-clock"></i> Hẹn giờ nhận hàng <span className="editable-text">Thay đổi &gt;</span>
                </div>
                <div className="summary-row">
                  <i className="bi bi-pencil-square"></i> Ghi chú đơn hàng <span className="editable-text">Thay đổi &gt;</span>
                </div>
                <div className="summary-row">
                  <i className="bi bi-ticket-perforated"></i> Mã giảm giá <span className="editable-text">Chọn &gt;</span>
                </div>
                
                <div className="summary-total">
                  <span>TỔNG CỘNG</span>
                  <span className="total-amount">{formatPrice(cartTotal)}</span>
                </div>
                <div className="summary-note">Nhập mã giảm giá ở trang thanh toán</div>
                
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
