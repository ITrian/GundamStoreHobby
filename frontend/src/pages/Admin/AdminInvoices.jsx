import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import './AdminInvoices.css';

const AdminInvoices = () => {
  const location = useLocation(); 
  const [invoices, setInvoices] = useState([]);
  const [users, setUsers] = useState([]); 
  const [products, setProducts] = useState([]); 
  
  const [searchQuery, setSearchQuery] = useState(location.state?.searchStr || '');

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [alertDialog, setAlertDialog] = useState({ isOpen: false, message: '', type: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    fetchInvoices();
    fetchUsers();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.state?.searchStr) {
      setSearchQuery(location.state.searchStr);
    }
  }, [location.state]);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_URL}/invoice/all`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.reverse());
      }
    } catch (error) {
      console.error('Lỗi tải hóa đơn:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/user/getallUser`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Lỗi tải người dùng:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/product/getAllProducts`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
    }
  };

  const showAlert = (message, type = 'info') => setAlertDialog({ isOpen: true, message, type });
  const showConfirm = (message, onConfirm) => setConfirmDialog({ isOpen: true, message, onConfirm });
  const closeAlert = () => setAlertDialog({ isOpen: false, message: '', type: 'info' });
  const closeConfirm = () => setConfirmDialog({ isOpen: false, message: '', onConfirm: null });

  const getUserName = (customerId) => {
    const user = users.find(u => String(u.id) === String(customerId));
    return user ? user.name : 'Khách vãng lai';
  };

  const getProductName = (productId) => {
    const product = products.find(p => String(p.id) === String(productId));
    return product ? product.name : `Sản phẩm #${productId}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  // --- HÀM XỬ LÝ NGÀY THÁNG CHUẨN (KHÔNG BỊ LỆCH TIMEZONE) ---
  const formatOrderDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Cắt bỏ phần giờ (T00:00:00.000Z), chỉ lấy phần ngày (YYYY-MM-DD)
      const datePart = dateString.split('T')[0]; 
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      // Fallback nếu format không như dự kiến
      return new Date(dateString).toLocaleDateString('vi-VN');
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const query = searchQuery.toLowerCase();
    const userName = getUserName(inv.customerid).toLowerCase();
    return inv.id.toString().includes(query) || userName.includes(query);
  });

  const handleViewDetails = async (invoice) => {
    setSelectedInvoice(invoice);
    setIsLoadingDetails(true);
    try {
      const res = await fetch(`${API_URL}/invoiceDetail/getById/${invoice.id}`);
      if (res.ok) {
        const data = await res.json();
        setInvoiceDetails(Array.isArray(data) ? data : [data]);
      } else {
        setInvoiceDetails([]);
      }
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
      showAlert("Lỗi khi lấy chi tiết đơn hàng!", "error");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeDetailsModal = () => {
    setSelectedInvoice(null);
    setInvoiceDetails([]);
  };

  const handleStatusChange = async (invoice, newStatus) => {
    try {
      const payload = {
        id: invoice.id,
        date: invoice.date,
        customerId: invoice.customerid,
        status: newStatus,
        isPaid: invoice.ispaid,
        paymentMethod: invoice.paymentmethod,
        totalPrice: invoice.totalprice
      };

      const res = await fetch(`${API_URL}/invoice/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showAlert(`Đã cập nhật trạng thái đơn #${invoice.id} thành "${newStatus}"!`, "success");
        fetchInvoices(); 
      } else {
        showAlert("Lỗi cập nhật trạng thái từ Server!", "error");
      }
    } catch (error) {
      showAlert("Lỗi kết nối đến máy chủ!", "error");
    }
  };

  const handleDeleteInvoice = (id) => {
    showConfirm(`Bạn có chắc chắn muốn xóa Đơn hàng #${id}?`, async () => {
      try {
        const res = await fetch(`${API_URL}/invoice/delete/${id}`, { method: 'DELETE' });
        if (res.ok) {
          showAlert("Đã xóa đơn hàng thành công!", "success");
          fetchInvoices();
        } else {
          showAlert("Không thể xóa đơn hàng! Vui lòng xóa chi tiết đơn hàng trước.", "error");
        }
      } catch (error) {
        showAlert("Lỗi kết nối khi xóa!", "error");
      }
    });
  };

  return (
    <div className="admin-invoices-container">
      <h2>Quản lý Đơn hàng</h2>

      <div className="invoice-toolbar">
        <div className="search-box">
          <i className="bi bi-search search-icon"></i>
          <input 
            type="text" 
            placeholder="Tìm theo Mã đơn (ID) hoặc Tên người mua..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="total-orders">
          <i className="bi bi-receipt"></i> Tổng cộng: <strong>{filteredInvoices.length}</strong> đơn hàng
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Mã Đơn</th>
            <th>Khách Hàng</th>
            <th>Ngày Đặt</th>
            <th>Tổng Tiền</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map(inv => (
            <tr key={inv.id}>
              <td 
                className="clickable-id" 
                onClick={() => handleViewDetails(inv)}
                title="Bấm để xem chi tiết"
              >
                #{inv.id}
              </td>
              <td style={{ fontWeight: 'bold' }}>{getUserName(inv.customerid)}</td>
              {/* ĐÃ CẬP NHẬT: Dùng hàm formatOrderDate */}
              <td>{formatOrderDate(inv.date)}</td>
              <td style={{ color: '#e50000', fontWeight: 'bold' }}>{formatPrice(inv.totalprice)}</td>
              
              <td>
                <select 
                  className={`status-select ${inv.status === 'Đã hủy' ? 'canceled' : inv.status === 'Hoàn tất' ? 'success' : 'pending'}`}
                  value={inv.status || 'Chờ xác nhận'}
                  onChange={(e) => handleStatusChange(inv, e.target.value)}
                >
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đang giao hàng">Đang giao hàng</option>
                  <option value="Hoàn tất">Hoàn tất</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </td>

              <td>
                <button className="btn-view" onClick={() => handleViewDetails(inv)}>
                  <i className="bi bi-eye"></i> Xem
                </button>
                <button className="btn-delete" onClick={() => handleDeleteInvoice(inv.id)}>
                  <i className="bi bi-trash"></i> Xóa
                </button>
              </td>
            </tr>
          ))}
          {filteredInvoices.length === 0 && (
            <tr>
              <td colSpan="6" className="empty-msg">Không tìm thấy đơn hàng nào!</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedInvoice && (
        <div className="admin-modal overlay-blur">
          <div className="modal-content invoice-modal">
            <div className="modal-header">
              <h3><i className="bi bi-card-list"></i> Chi tiết Đơn hàng #{selectedInvoice.id}</h3>
              <button className="close-btn" onClick={closeDetailsModal}><i className="bi bi-x-lg"></i></button>
            </div>
            
            <div className="modal-body">
              <div className="invoice-meta">
                <p><strong>Khách hàng:</strong> {getUserName(selectedInvoice.customerid)}</p>
                {/* ĐÃ CẬP NHẬT: Dùng hàm formatOrderDate */}
                <p><strong>Ngày đặt:</strong> {formatOrderDate(selectedInvoice.date)}</p>
                <p><strong>Thanh toán:</strong> {selectedInvoice.ispaid ? <span style={{color: '#28a745'}}><i className="bi bi-check-circle-fill"></i> Đã thanh toán</span> : <span style={{color: '#dc3545'}}><i className="bi bi-x-circle-fill"></i> Chưa thanh toán</span>} ({selectedInvoice.paymentmethod})</p>
                <p><strong>Tổng tiền:</strong> <span style={{ color: 'red', fontWeight: 'bold' }}>{formatPrice(selectedInvoice.totalprice)}</span></p>
              </div>

              <h4 className="detail-title">Danh sách sản phẩm:</h4>
              {isLoadingDetails ? (
                <div className="loading-msg"><i className="bi bi-hourglass-split"></i> Đang tải dữ liệu...</div>
              ) : invoiceDetails.length > 0 ? (
                <table className="admin-table details-table">
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
                    {invoiceDetails.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 'bold', color: '#1a73e8' }}>
                          {getProductName(item.productid)}
                        </td>
                        <td>{formatPrice(item.unitprice)}</td>
                        <td>x{item.quantity}</td>
                        <td>{item.discount}%</td>
                        <td style={{ fontWeight: 'bold', color: '#e50000' }}>
                          {formatPrice(item.quantity * item.unitprice * (1 - (item.discount || 0)/100))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-msg text-danger"><i className="bi bi-exclamation-circle"></i> Đơn hàng này hiện chưa có sản phẩm nào!</div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeDetailsModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {confirmDialog.isOpen && (
        <div className="admin-modal top-layer">
          <div className="modal-content alert-modal">
            <h3 className="alert-title danger"><i className="bi bi-exclamation-triangle-fill"></i> Xác nhận</h3>
            <p className="alert-msg">{confirmDialog.message}</p>
            <div className="modal-footer center-footer">
              <button className="btn-delete px-btn" onClick={() => { confirmDialog.onConfirm(); closeConfirm(); }}>Đồng ý</button>
              <button className="btn-cancel px-btn" onClick={closeConfirm}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {alertDialog.isOpen && (
        <div className="admin-modal top-layer">
          <div className="modal-content alert-modal">
            <h3 className={`alert-title ${alertDialog.type}`}>
              {alertDialog.type === 'error' ? <i className="bi bi-x-circle-fill"></i> : 
               alertDialog.type === 'success' ? <i className="bi bi-check-circle-fill"></i> : 
               <i className="bi bi-info-circle-fill"></i>} Thông báo
            </h3>
            <p className="alert-msg">{alertDialog.message}</p>
            <button className="btn-save px-btn center-block" onClick={closeAlert}>OK</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminInvoices;