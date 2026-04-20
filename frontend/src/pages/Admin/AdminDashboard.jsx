import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ĐÃ THÊM: Lấy token để gọi API không bị lỗi 401
        const token = localStorage.getItem('accessToken');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [usersRes, productsRes, invoicesRes] = await Promise.all([
          fetch(`${API_URL}/users`, { headers }),
          fetch(`${API_URL}/products`, { headers }),
          fetch(`${API_URL}/invoices`, { headers })
        ]);

        const users = usersRes.ok ? await usersRes.json() : [];
        const products = productsRes.ok ? await productsRes.json() : [];
        const invoices = invoicesRes.ok ? await invoicesRes.json() : [];

        // ĐÃ SỬA: Tính tổng doanh thu bỏ qua các đơn 'Cancelled' chuẩn tiếng Anh
        const totalRevenue = invoices
          .filter(inv => inv.status !== 'Cancelled')
          .reduce((sum, inv) => sum + (Number(inv.totalprice) || 0), 0);

        setMetrics({
          users: users.length,
          products: products.length,
          orders: invoices.length,
          revenue: totalRevenue,
        });

        // Lấy 5 đơn mới nhất
        const sortedInvoices = [...invoices].sort((a, b) => b.id - a.id);
        const top5 = sortedInvoices.slice(0, 5);
        setRecentOrders(top5);

      } catch (error) {
        console.error("Lỗi lấy dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Đang tải dữ liệu tổng quan...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <h2 className="dashboard-title">Bảng điều khiển (Dashboard)</h2>

      <div className="dashboard-metrics">
        <div className="metric-card">
          <div className="metric-icon blue">
            <i className="bi bi-people-fill"></i>
          </div>
          <div className="metric-info">
            <h3>Người dùng</h3>
            <p className="metric-value">{metrics.users}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon green">
            <i className="bi bi-box-seam"></i>
          </div>
          <div className="metric-info">
            <h3>Sản phẩm</h3>
            <p className="metric-value">{metrics.products}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon purple">
            <i className="bi bi-receipt"></i>
          </div>
          <div className="metric-info">
            <h3>Đơn hàng</h3>
            <p className="metric-value">{metrics.orders}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon orange">
            <i className="bi bi-currency-dollar"></i>
          </div>
          <div className="metric-info">
            <h3>Tổng Doanh thu</h3>
            <p className="metric-value">{formatPrice(metrics.revenue)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-recent-orders">
        <h3>5 Đơn hàng giao dịch gần nhất</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="recent-orders-table">
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Khách hàng (ID)</th>
                <th>Ngày Đặt</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customerid || 'Guest'}</td>
                    <td>{formatOrderDate(order.date)}</td>
                    <td style={{ fontWeight: 'bold' }}>{formatPrice(order.totalprice)}</td>
                    <td>
                      <span className={`status-badge ${order.status === 'Cancelled' ? 'canceled' : order.status === 'Completed' ? 'completed' : 'pending'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>Chưa có đơn hàng nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;