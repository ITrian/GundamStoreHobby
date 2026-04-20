import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './CheckoutPage.css';

const CheckoutItem = ({ item, formatPrice }) => {
  const API_URL = 'https://gundamstorehobby.onrender.com';
  const itemName = item?.name || 'Sản phẩm';
  const defaultPlaceholder = `https://via.placeholder.com/80/f0f0f0/333333?text=${encodeURIComponent(itemName)}`;
  const [thumbImg, setThumbImg] = useState(defaultPlaceholder);

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
        console.error(`Lỗi tải ảnh checkout cho SP ${item.id}:`, error);
      }
    };
    if (item.id) fetchImage();
  }, [item.id]);

  return (
    <div className="ck-item">
      <div className="ck-item-img-wrapper">
        <img 
          src={thumbImg} 
          alt={item.name} 
          onError={(e) => { e.target.onerror = null; e.target.src = defaultPlaceholder; }}
        />
        <span className="ck-item-qty">{item.quantity}</span>
      </div>
      <div className="ck-item-info">
        <div className="ck-item-name">{item.name}</div>
      </div>
      <div className="ck-item-price">
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    note: ''
  });
  
  const [isAgreed, setIsAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      navigate('/cart');
      return;
    }
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        setFormData(prev => ({
          ...prev,
          email: parsedUser.email || prev.email,
          fullName: parsedUser.name || parsedUser.username || prev.fullName,
          address: parsedUser.address || prev.address,
          phone: parsedUser.phone || prev.phone
        }));
      } catch (e) {
        console.error("Lỗi parse user:", e);
      }
    } else {
      alert("Vui lòng đăng nhập để thanh toán đơn hàng.");
      navigate('/login');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrder = async () => {
    if (!isAgreed) {
      alert("Vui lòng đồng ý với điều khoản giao dịch chung.");
      return;
    }

    if (!user || (!user.id && !user.ID)) {
      alert("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('accessToken');
    const customerId = user.id || user.ID;

    try {
      const invoicePayload = {
        date: new Date().toISOString(),
        customerId: customerId,
        status: "chờ xử lý",
        isPaid: false,
        paymentMethod: "Techcombank VietQR",
        totalPrice: cartTotal
      };

      const resInvoice = await fetch(`${API_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(invoicePayload)
      });

      if (!resInvoice.ok) {
        if (resInvoice.status === 401 || resInvoice.status === 403) {
          throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        }
        throw new Error('Không thể tạo đơn hàng. Vui lòng thử lại sau.');
      }

      const invoiceData = await resInvoice.json();
      const newInvoiceId = invoiceData.id || invoiceData.ID;

      if (!newInvoiceId) {
        throw new Error('Lưu đơn hàng thất bại (không lấy được ID).');
      }

      const detailPromises = cartItems.map(item => {
        const detailPayload = {
          invoiceId: newInvoiceId,
          productId: item.id,
          unitPrice: item.price,
          quantity: item.quantity
        };

        return fetch(`${API_URL}/invoiceDetails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(detailPayload)
        });
      });

      const detailResults = await Promise.all(detailPromises);
      
      const failedDetail = detailResults.find(r => !r.ok);
      if (failedDetail) {
        console.log("Cảnh báo: Có lỗi khi lưu một số chi tiết hóa đơn.");
      }

      alert("Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.");
      clearCart();
      navigate('/');
      
    } catch (error) {
      console.error(error);
      alert(error.message || "Đã xảy ra lỗi hệ thống, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-left">
        <div className="ck-header-logo">
          <h1>THE LIEMS HOBBY STORE</h1>
        </div>

        <div className="ck-columns">
          <div className="ck-shipping-info">
            <h3 className="ck-title">
              Thông tin nhận hàng
              {!user && (
                <Link to="/login" className="ck-login-link">
                  <i className="bi bi-person-circle"></i> Đăng nhập
                </Link>
              )}
            </h3>

            <div className="ck-form-group">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="ck-form-group">
              <input type="text" name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleInputChange} />
            </div>
            <div className="ck-form-group ck-phone-group">
              <input type="text" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleInputChange} />
              <div className="phone-flag">🇻🇳</div>
            </div>
            <div className="ck-form-group">
              <input type="text" name="address" placeholder="Địa chỉ (Số nhà, đường...)" value={formData.address} onChange={handleInputChange} />
            </div>
          </div>

          <div className="ck-payment-info">
            <h3 className="ck-title">Thanh toán</h3>
            <div className="ck-payment-box">
              <input type="radio" checked readOnly />
              <span>COD</span>
              <img src="https://firebasestorage.googleapis.com/v0/b/qn21-229.appspot.com/o/vietqr.png?alt=media" alt="VietQR" onError={(e) => e.target.style.display='none'} />
            </div>

            <div className="ck-terms">
              <input type="checkbox" id="agree" checked={isAgreed} onChange={() => setIsAgreed(!isAgreed)} />
              <label htmlFor="agree">Tôi đã đọc và đồng ý với điều khoản giao dịch chung của website</label>
            </div>
          </div>
        </div>
      </div>

      <div className="checkout-right">
        <h2>Đơn hàng ({cartItems.length} sản phẩm)</h2>
        
        <div className="ck-item-list">
          {cartItems.map((item, idx) => (
            <CheckoutItem key={idx} item={item} formatPrice={formatPrice} />
          ))}
        </div>

        <div className="ck-summary-total">
          <span>Tổng cộng</span>
          <span className="total-price">{formatPrice(cartTotal)}</span>
        </div>

        <div className="ck-actions">
          <Link to="/cart" className="ck-back-link">
            &lsaquo; Quay về giỏ hàng
          </Link>
          <button 
            className="ck-btn-order" 
            onClick={handleOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;