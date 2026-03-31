import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
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
    }
  }, []);

  const fetchUserOrders = async (userId) => {
    try {
      // Gọi API lấy TẤT CẢ hóa đơn, sau đó Frontend tự lọc theo userId của người đang đăng nhập
      const res = await fetch(`${API_URL}/invoice/all`);
      if (res.ok) {
        const data = await res.json();
        // Lưu ý: Đảm bảo trường chứa id user từ API là userid hoặc userId
        const myOrders = data.filter(order => order.userid === userId || order.userId === userId);
        setOrders(myOrders);
      }
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    }
  };

  const handleViewOrderDetails = async (order) => {
    setSelectedOrder(order);
    setIsLoadingDetails(true);
    try {
      // Gọi API lấy chi tiết của hóa đơn này
      const res = await fetch(`${API_URL}/invoiceDetail/getById/${order.id}`);
      if (res.ok) {
        const data = await res.json();
        // Nếu API trả về 1 object (1 món) thì biến thành mảng, nếu trả về mảng thì giữ nguyên
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

  // Logic Search: Lọc danh sách Order theo ID
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
                      <td>{order.createat ? new Date(order.createat).toLocaleDateString('vi-VN') : 'N/A'}</td>
                      <td className="order-price">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total || 0)}
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
                      <th>Mã SP</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((item, index) => (
                      <tr key={index}>
                        {/* Lưu ý: Nếu DB của bạn có join lấy Tên SP thì đổi item.productid thành item.name */}
                        <td><strong>#{item.productid}</strong></td>
                        <td>x{item.quantity}</td>
                        <td style={{ color: '#e50000', fontWeight: 'bold' }}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', padding: '2vw', color: 'red' }}>Đơn hàng này bị lỗi rỗng sản phẩm hoặc chưa có dữ liệu chi tiết.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
};

export default UserProfile;