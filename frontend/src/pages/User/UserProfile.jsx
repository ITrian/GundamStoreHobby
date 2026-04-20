import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserOrders(parsedUser.userId);
      fetchProducts(); 
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      // ĐÃ THÊM TOKEN: Lấy lịch sử mua hàng cần bảo mật
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/invoices`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        // Lọc ra các đơn hàng của user này
        const myOrders = data.filter(order => String(order.customerid) === String(userId));
        setOrders(myOrders.reverse()); 
      }
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    }
  };

  const handleViewOrderDetails = async (order) => {
    setSelectedOrder(order);
    setIsLoadingDetails(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/invoiceDetails/${order.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setOrderDetails(Array.isArray(data) ? data : [data]);
      } else {
        setOrderDetails([]);
      }
    } catch (error) {
      console.error("Lỗi tải chi tiết hóa đơn:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setOrderDetails([]);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };
  
  const formatOrderDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return new Date(dateString).toLocaleDateString('vi-VN');
    }
  };
  
  const getProductName = (productId) => {
    const product = products.find(p => String(p.id) === String(productId));
    return product ? product.name : `Sản phẩm #${productId}`;
  };

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchQuery)
  );

  if (!localStorage.getItem('user')) {
    return <Navigate to="/login" replace />;
  }
  if (!user) return <div style={{ padding: '5vw', textAlign: 'center' }}>Đang tải dữ liệu...</div>;

  const isUserAdmin = user.isadmin === true;
  // console.log("Thông tin người dùng:", user);

  return (
    <ClientLayout>
      <div className="profile-container">
        
        <div className="profile-card user-info-card">
          <h2 className="profile-title">Thông tin tài khoản</h2>
          
          <div className="info-group">
            <span className="info-label" style={{ minWidth: '150px' }}><i className="bi bi-person-badge"></i> Họ và Tên:</span>
            <span className="info-value text-bold">{user.name || 'Chưa cập nhật'}</span>
          </div>

          <div className="info-group">
            <span className="info-label" style={{ minWidth: '150px' }}><i className="bi bi-person"></i> Tên đăng nhập:</span>
            <span className="info-value">{user.username || 'Chưa cập nhật'}</span>
          </div>

          <div className="info-group">
            <span className="info-label" style={{ minWidth: '150px' }}><i className="bi bi-envelope"></i> Email:</span>
            <span className="info-value">{user.email || 'Chưa cập nhật'}</span>
          </div>

          <div className="info-group">
            <span className="info-label" style={{ minWidth: '150px' }}><i className="bi bi-calendar-event"></i> Ngày sinh:</span>
            <span className="info-value">{user.dateofbirth ? formatOrderDate(user.dateofbirth) : 'Chưa cập nhật'}</span>
          </div>

          <div className="info-group">
            <span className="info-label" style={{ minWidth: '150px' }}><i className="bi bi-geo-alt"></i> Địa chỉ:</span>
            <span className="info-value">{user.address || 'Chưa cập nhật'}</span>
          </div>

          <div className="info-group">
            <span className="info-label" style={{ minWidth: '150px' }}><i className="bi bi-shield-lock"></i> Vai trò:</span>
            <span className="info-value" style={{ color: isUserAdmin ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>
              {isUserAdmin ? 'Quản trị viên (Admin)' : 'Thành viên'}
            </span>
          </div>
        </div>

        <div className="profile-card user-orders-card">
          <h2 className="profile-title">Lịch sử mua hàng</h2>

          <div className="order-search-box">
            <input
              type="text"
              placeholder="Nhập mã Đơn hàng (ID) để tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="bi bi-search search-icon"></i>
          </div>

          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Ngày Đặt</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-id" onClick={() => handleViewOrderDetails(order)}>#{order.id}</td>
                      <td>{formatOrderDate(order.date)}</td>
                      <td className="order-price">
                        {formatPrice(order.totalprice)}
                      </td>
                      <td>
                        <span className={`status-badge ${order.status === 'Cancelled' ? 'canceled' : order.status === 'Completed' ? 'completed' : 'pending'}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button className="view-btn" onClick={() => handleViewOrderDetails(order)}>Xem chi tiết</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-orders">Bạn chưa có đơn hàng nào, hoặc không tìm thấy mã đơn!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {selectedOrder && (
        <div className="order-modal-overlay">
          <div className="order-modal-content">
            <div className="modal-header">
              <h3>Chi tiết Đơn hàng #{selectedOrder.id}</h3>
              <button className="close-modal-btn" onClick={closeOrderModal}><i className="bi bi-x-lg"></i></button>
            </div>

            <div className="modal-body">
              {isLoadingDetails ? (
                <p style={{ textAlign: 'center', padding: '2vw' }}>Đang tải danh sách sản phẩm...</p>
              ) : orderDetails.length > 0 ? (
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((item, index) => (
                      <tr key={index}>
                        <td><strong style={{ color: '#1a73e8' }}>{getProductName(item.productid)}</strong></td>
                        <td>{formatPrice(item.unitprice)}</td>
                        <td>x{item.quantity}</td>
                        <td style={{ color: '#e50000', fontWeight: 'bold' }}>
                          {formatPrice(item.quantity * item.unitprice * (1 - (item.discount || 0) / 100))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', padding: '2vw', color: 'red' }}>Đơn hàng này hiện chưa có sản phẩm nào!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
};

export default UserProfile;