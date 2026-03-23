import React, { useState, useEffect } from 'react';

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, date: '', customerid: '', status: '', ispaid: false, paymentmethod: '', totalprice: 0 
  });
  
  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_URL}/invoice/all`);
      if (!res.ok) throw new Error('Lỗi tải hóa đơn');
      const data = await res.json();
      setInvoices(data);
    } catch (error) {
      console.error("Lỗi fetch invoices:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      try {
        await fetch(`${API_URL}/invoice/delete/${id}`, { method: 'DELETE' });
        fetchInvoices(); 
      } catch (error) {
        console.error("Lỗi khi xóa hóa đơn:", error);
      }
    }
  };

  const handleOpenModal = (invoice) => {
    setFormData(invoice);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/invoice/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           ...formData,
           customerId: formData.customerid,
           isPaid: formData.ispaid,
           paymentMethod: formData.paymentmethod,
           totalPrice: formData.totalprice
        }) // Ánh xạ lại các key vì backend sử dụng camelCase trong req.body
      });
      setIsModalOpen(false);
      fetchInvoices();
    } catch (error) {
      console.error("Lỗi khi cập nhật hóa đơn:", error);
    }
  };

  return (
    <div>
      <h2>Quản lý Hóa đơn</h2>
      
      <table className="admin-table" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ngày</th>
            <th>Mã KH</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thanh toán</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr><td colSpan="7" style={{ textAlign: 'center' }}>Chưa có hóa đơn nào</td></tr>
          ) : (
            invoices.map(inv => {
              const dateObj = new Date(inv.date);
              const dateStr = !isNaN(dateObj) ? dateObj.toLocaleDateString('vi-VN') : inv.date;
              return (
                <tr key={inv.id}>
                  <td>{inv.id}</td>
                  <td>{dateStr}</td>
                  <td>{inv.customerid}</td>
                  <td>{typeof inv.totalprice === 'number' ? inv.totalprice.toLocaleString() : inv.totalprice} đ</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '13px', color: '#fff',
                      backgroundColor: inv.status === 'Đã giao' ? '#28a745' : inv.status === 'Đang xử lý' ? '#ffc107' : '#17a2b8' 
                    }}>
                      {inv.status || 'Chờ xác nhận'}
                    </span>
                  </td>
                  <td>{inv.ispaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleOpenModal(inv)}>Sửa</button>
                    <button className="btn-delete" onClick={() => handleDelete(inv.id)}>Xóa</button>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="admin-modal">
          <div className="modal-content">
            <h3>Cập nhật Hóa đơn #{formData.id}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ display: 'block' }}>
                <label>Trạng thái đơn hàng:</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đang giao hàng">Đang giao hàng</option>
                  <option value="Đã giao">Đã giao</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
              <div className="form-group" style={{ display: 'block', marginTop: '15px' }}>
                <label>Tình trạng thanh toán:</label>
                <select value={formData.ispaid} onChange={e => setFormData({...formData, ispaid: e.target.value === 'true'})} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                  <option value="false">Chưa thanh toán</option>
                  <option value="true">Đã thanh toán</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '25px' }}>
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-save">Lưu cập nhật</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;
