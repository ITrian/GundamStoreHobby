import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); // State để lưu danh sách SP (hiển thị tên)
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dành cho Modal Chi tiết Đơn hàng
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
      fetchProducts(); // Gọi API lấy sản phẩm
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
      const res = await fetch(`${API_URL}/invoices`);
      if (res.ok) {
        const data = await res.json();
        // ĐÃ SỬA: Lọc đúng trường customerid theo Backend
        const myOrders = data.filter(order => String(order.customerid) === String(userId));
        setOrders(myOrders.reverse()); // Đơn mới lên đầu
      }
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    }
  };

  const handleViewOrderDetails = async (order) => {
    setSelectedOrder(order);
    setIsLoadingDetails(true);
    try {
      const res = await fetch(`${API_URL}/invoiceDetails/${order.id}`);
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

  // --- CÁC HÀM TIỆN ÍCH ---
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  // ĐÃ THÊM: Xử lý hiển thị ngày chuẩn xác, không bị lệch giờ
  const formatOrderDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const datePart = dateString.split('T')[0]; 
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      return new Date(dateString).toLocaleDateString('vi-VN');
    }
  };

  // ĐÃ THÊM: Hiển thị tên SP
  const getProductName = (productId) => {
    const product = products.find(p => String(p.id) === String(productId));
    return product ? product.name : `Sản phẩm #${productId}`;
  };

  // Logic Search
  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchQuery)
  );

  if (!localStorage.getItem('user')) {
    return <Navigate to="/login" replace />;
  }

  if (!user) return <div style={{ padding: '5vw', textAlign: 'center' }}>Đang tải dữ liệu...</div>;

  return (
    <ClientLayout>
      <div className="profile-container">
        
        {/* CỘT TRÁI: THÔNG TIN TÀI KHOẢN */}
        <div className="profile-card user-info-card">
          <h2 className="profile-title">Thông tin tài khoản</h2>
          <div className="info-group">
            <span className="info-label"><i className="bi bi-person-badge"></i> Tên hiển thị:</span>
            <span className="info-value">{user.name || user.username}</span>
          </div>
          <div className="info-group">
            <span className="info-label"><i className="bi bi-person"></i> Tên đăng nhập:</span>
            <span className="info-value">{user.username}</span>
          </div>
          <div className="info-group">
            <span className="info-label"><i className="bi bi-shield-lock"></i> Loại tài khoản:</span>
            <span className="info-value" style={{ color: user.isAdmin ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>
              {user.isAdmin ? 'Quản trị viên (Admin)' : 'Thành viên'}
            </span>
          </div>
        </div>

        {/* CỘT PHẢI: LỊCH SỬ MUA HÀNG */}
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
                      {/* ĐÃ SỬA: order.date thay vì order.createat */}
                      <td>{formatOrderDate(order.date)}</td>
                      {/* ĐÃ SỬA: order.totalprice thay vì order.total */}
                      <td className="order-price">
                        {formatPrice(order.totalprice)}
                      </td>
                      <td>
                        <span className={`status-badge ${order.status === 'Đã hủy' ? 'canceled' : 'success'}`}>
                          {order.status || 'Hoàn tất'}
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

      {/* POPUP: CHI TIẾT ĐƠN HÀNG */}
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
                      <th>Giảm giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((item, index) => (
                      <tr key={index}>
                        {/* ĐÃ THÊM: Hiện tên SP thay vì ID */}
                        <td><strong style={{ color: '#1a73e8' }}>{getProductName(item.productid)}</strong></td>
                        {/* ĐÃ SỬA: Dùng unitprice thay vì price */}
                        <td>{formatPrice(item.unitprice)}</td>
                        <td>x{item.quantity}</td>
                        <td>{item.discount}%</td>
                        {/* ĐÃ THÊM: Tính toán thành tiền có kèm discount */}
                        <td style={{ color: '#e50000', fontWeight: 'bold' }}>
                          {formatPrice(item.quantity * item.unitprice * (1 - (item.discount || 0)/100))}
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