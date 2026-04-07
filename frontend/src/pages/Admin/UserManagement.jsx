import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserManagement.css'; 

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    dateOfBirth: '',
    email: '',
    address: '',
    username: '', 
    password: '',
    isAdmin: false 
  });

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, message: '' });

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Lỗi tải danh sách người dùng");
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const showAlert = (message) => setAlertDialog({ isOpen: true, message });
  const showConfirm = (message, onConfirmCallback) => {
    setConfirmDialog({ isOpen: true, message, onConfirm: onConfirmCallback });
  };
  const closeConfirm = () => setConfirmDialog({ isOpen: false, message: '', onConfirm: null });

  const handleOpenModal = (user = null) => {
    if (user) {
      const formattedDate = user.dateofbirth ? new Date(user.dateofbirth).toISOString().split('T')[0] : '';
      setFormData({
        id: user.id,
        name: user.name || '',
        dateOfBirth: formattedDate,
        email: user.email || '',
        address: user.address || '',
        username: '', 
        password: '',
        isAdmin: user.isadmin || false 
      });
    } else {
      setFormData({ id: null, name: '', dateOfBirth: '', email: '', address: '', username: '', password: '', isAdmin: false });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEditMode = !!formData.id;
    const url = isEditMode 
      ? `${API_URL}/users/${formData.id}` 
      : `${API_URL}/users`;
    
    const method = isEditMode ? 'PUT' : 'POST';
    const token = localStorage.getItem('accessToken');

    const payload = isEditMode 
      ? { 
          id: formData.id, 
          name: formData.name, 
          dateofbirth: formData.dateOfBirth, 
          email: formData.email, 
          address: formData.address, 
          isadmin: formData.isAdmin 
        }
      : { 
          name: formData.name, 
          dateofbirth: formData.dateOfBirth, 
          email: formData.email, 
          address: formData.address, 
          username: formData.username, 
          password: formData.password, 
          isadmin: formData.isAdmin 
        };

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          showAlert("Phiên đăng nhập hết hạn hoặc không đủ quyền!");
          setIsSubmitting(false);
          return;
        }
        showAlert(data.error || "Có lỗi xảy ra khi lưu!");
        setIsSubmitting(false);
        return;
      }

      showAlert(isEditMode ? "Cập nhật thành công!" : "Tạo tài khoản thành công!");
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      showAlert("Lỗi kết nối mạng!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ĐÃ SỬA: Cập nhật hàm Xóa thực tế gọi API
  const handleDeleteUser = (id) => {
    showConfirm('Bạn có chắc chắn muốn xóa người dùng này? Mọi dữ liệu liên quan có thể bị ảnh hưởng.', async () => {
      const token = localStorage.getItem('accessToken');
      
      try {
        const res = await fetch(`${API_URL}/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            showAlert("Phiên đăng nhập hết hạn hoặc bạn không đủ quyền!");
            return;
          }
          // Backend có thể chặn xóa nếu dính khóa ngoại (Foreign Key) ở bảng Account hoặc Invoice
          showAlert("Lỗi từ server: Không thể xóa người dùng! (Có thể do người này đang có hóa đơn hoặc tài khoản liên kết)");
          return;
        }

        showAlert("Đã xóa người dùng thành công!");
        fetchUsers();
      } catch (error) {
        console.error("Lỗi khi xóa user:", error);
        showAlert("Lỗi kết nối khi xóa người dùng!");
      }
    });
  };

  const handleGoToInvoices = (userName) => {
    navigate('/admin/invoices', { state: { searchStr: userName } });
  };

  return (
    <div className="UserManagement">
      <h2>Quản lý Tài khoản (Users)</h2>
      <button className="btn-add" onClick={() => handleOpenModal()}><i className="bi bi-plus-circle" style={{ marginRight: '0.5vw' }}></i>Thêm Tài Khoản</button>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ Tên</th>
            <th>Email</th>
            <th>Ngày sinh</th>
            <th>Địa chỉ</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td 
                className="clickable-id" 
                onClick={() => handleGoToInvoices(u.name)}
                title="Xem đơn hàng của user này"
              >
                #{u.id}
              </td>
              <td className="text-bold">{u.name}</td>
              <td>{u.email || 'Chưa cập nhật'}</td>
              <td>{u.dateofbirth ? new Date(u.dateofbirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</td>
              <td>{u.address || 'Chưa cập nhật'}</td>
              <td>
                <span className={`role-badge ${u.isadmin ? 'role-admin' : 'role-client'}`}>
                  {u.isadmin ? 'Admin' : 'Khách hàng'}
                </span>
              </td>
              <td>
                <button className="btn-edit" onClick={() => handleOpenModal(u)}>Sửa</button>
                <button className="btn-delete" onClick={() => handleDeleteUser(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan="7" className="text-center p-2vw">Chưa có người dùng nào</td></tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="admin-modal">
          <div className="modal-content modal-md">
            <h3>{formData.id ? 'Sửa thông tin User' : 'Thêm Tài khoản mới'}</h3>
            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label>Họ và Tên:</label>
                <input type="text" placeholder="Nhập họ tên" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required disabled={isSubmitting} />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input type="email" placeholder="Nhập email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required disabled={isSubmitting} />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Ngày sinh:</label>
                  <input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} disabled={isSubmitting} />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label>Vai trò:</label>
                  <select 
                    value={formData.isAdmin ? 'true' : 'false'} 
                    onChange={e => setFormData({...formData, isAdmin: e.target.value === 'true'})} 
                    disabled={isSubmitting}
                  >
                    <option value="false">Khách hàng</option>
                    <option value="true">Admin</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ:</label>
                <input type="text" placeholder="Nhập địa chỉ" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} disabled={isSubmitting} />
              </div>

              {/* Chỉ hiện trường Nhập Username / Password nếu là Thêm Mới */}
              {!formData.id && (
                <>
                  <hr className="modal-divider"/>
                  <div className="form-group">
                    <label>Tên đăng nhập (Username):</label>
                    <input type="text" placeholder="Nhập tên đăng nhập" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required disabled={isSubmitting} />
                  </div>
                  <div className="form-group">
                    <label>Mật khẩu:</label>
                    <input type="password" placeholder="Nhập mật khẩu" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required disabled={isSubmitting} />
                  </div>
                </>
              )}

              <div className="modal-footer">
                <button type="submit" className="btn-save" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang xử lý...' : 'Lưu lại'}
                </button>
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDialog.isOpen && (
        <div className="admin-modal top-layer">
          <div className="modal-content modal-sm">
            <h3 className="modal-title-danger">Xác nhận</h3>
            <p className="modal-message">{confirmDialog.message}</p>
            <div className="modal-footer" style={{ marginTop: '0' }}>
              <button className="btn-delete btn-px" onClick={() => { if (confirmDialog.onConfirm) confirmDialog.onConfirm(); closeConfirm(); }}>Đồng ý</button>
              <button className="btn-cancel btn-px" onClick={closeConfirm}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {alertDialog.isOpen && (
        <div className="admin-modal top-layer">
          <div className="modal-content modal-sm">
            <h3 className="modal-title-info">Thông báo</h3>
            <p className="modal-message">{alertDialog.message}</p>
            <button className="btn-save btn-px" onClick={() => setAlertDialog({ isOpen: false, message: '' })}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;