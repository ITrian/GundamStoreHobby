import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]); // ĐÃ THÊM: Quản lý danh sách Account
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    password: '',
    isAdmin: false
  });

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, message: '' });

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    fetchUsersAndAccounts();
  }, []);

  // ĐÃ SỬA: Tải đồng thời cả Users và Accounts để đối chiếu
  const fetchUsersAndAccounts = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const [resUsers, resAccounts] = await Promise.all([
        fetch(`${API_URL}/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/accounts`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (resUsers.ok) {
        const dataUsers = await resUsers.json();
        setUsers(dataUsers);
      } else {
        throw new Error("Lỗi tải danh sách người dùng");
      }

      if (resAccounts.ok) {
        const dataAccounts = await resAccounts.json();
        setAccounts(dataAccounts);
      }
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

      // Tìm account tương ứng với user
      const matchedAccount = accounts.find(a => String(a.userid) === String(user.id));

      setFormData({
        id: user.id,
        name: user.name || '',
        dateOfBirth: formattedDate,
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        username: matchedAccount ? matchedAccount.username : '',
        password: '', // Mật khẩu luôn để trống khi sửa, chỉ gửi khi có nhập mới
        isAdmin: user.isadmin || false
      });
    } else {
      setFormData({ id: null, name: '', dateOfBirth: '', email: '', phone: '', address: '', username: '', password: '', isAdmin: false });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEditMode = !!formData.id;
    const url = isEditMode ? `${API_URL}/users/${formData.id}` : `${API_URL}/users`;
    const method = isEditMode ? 'PUT' : 'POST';
    const token = localStorage.getItem('accessToken');

    // 1. Tạo Payload cho Bảng User
    const userPayload = isEditMode
      ? {
        id: formData.id,
        name: formData.name,
        dateofbirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        isadmin: formData.isAdmin
      }
      : {
        name: formData.name,
        dateofbirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        isadmin: formData.isAdmin
      };

    try {
      // 1. GỬI REQUEST LƯU BẢNG USER
      const resUser = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userPayload)
      });

      const userData = await resUser.json();

      if (!resUser.ok) {
        if (resUser.status === 401 || resUser.status === 403) {
          showAlert("Phiên đăng nhập hết hạn hoặc không đủ quyền!");
        } else {
          showAlert(userData.error || "Lỗi khi lưu thông tin Hồ sơ! (Lưu ý SĐT 10 số)");
        }
        setIsSubmitting(false);
        return;
      }

      // Xác định ID user (Vừa tạo hoặc đang sửa)
      const currentUserId = isEditMode ? formData.id : userData.id;

      // 2. GỬI REQUEST LƯU BẢNG ACCOUNT
      if (!isEditMode) {
        // NẾU LÀ THÊM MỚI: Bắt buộc gọi POST /accounts
        const resAcc = await fetch(`${API_URL}/accounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            userid: currentUserId,
            username: formData.username,
            password: formData.password,
            isactived: true
          })
        });

        if (!resAcc.ok) {
          const accErr = await resAcc.json();
          showAlert(`Tạo User thành công nhưng lỗi tạo Tài khoản: ${accErr.error || 'Username đã tồn tại'}`);
          fetchUsersAndAccounts();
          setIsSubmitting(false);
          return;
        }

      } else {
        // NẾU LÀ SỬA: Chỉ gọi cập nhật Account nếu Admin có nhập Mật khẩu vào Form
        if (formData.password.trim() !== '') {
          const existingAcc = accounts.find(a => String(a.userid) === String(currentUserId));

          if (existingAcc) {
            // Cập nhật tài khoản cũ
            const resAcc = await fetch(`${API_URL}/accounts/${currentUserId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                username: formData.username,
                password: formData.password,
                isactived: true
              })
            });
            if (!resAcc.ok) {
              const accErr = await resAcc.json();
              showAlert(`Cập nhật User thành công nhưng lỗi Account: ${accErr.error}`);
              fetchUsersAndAccounts();
              setIsSubmitting(false);
              return;
            }
          } else {
            // Nếu User chưa có Account thì tạo mới cho họ
            await fetch(`${API_URL}/accounts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                userid: currentUserId,
                username: formData.username,
                password: formData.password,
                isactived: true
              })
            });
          }
        }
      }

      showAlert(isEditMode ? "Cập nhật thành công!" : "Tạo tài khoản thành công!");
      setIsModalOpen(false);
      fetchUsersAndAccounts();
    } catch (error) {
      console.error(error);
      showAlert("Lỗi kết nối mạng!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (id) => {
    showConfirm('Bạn có chắc chắn muốn xóa người dùng này? Tài khoản đăng nhập của người này cũng sẽ bị xóa vĩnh viễn.', async () => {
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
          showAlert("Đã xóa người dùng và tài khoản thành công!");
          fetchUsersAndAccounts();
          return;
        }

        showAlert("Đã xóa người dùng và tài khoản thành công!");
        fetchUsersAndAccounts();
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
            <th>Username</th>
            <th>SĐT</th>
            <th>Email</th>
            <th>Ngày sinh</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => {
            const acc = accounts.find(a => String(a.userid) === String(u.id));
            return (
              <tr key={u.id}>
                <td
                  className="clickable-id"
                  onClick={() => handleGoToInvoices(u.name)}
                  title="Xem đơn hàng của user này"
                >
                  #{u.id}
                </td>
                <td className="text-bold">{u.name}</td>
                <td>{acc ? <span style={{ color: '#28a745', fontWeight: 'bold' }}>{acc.username}</span> : <span style={{ color: 'gray' }}>Chưa có</span>}</td>
                <td style={{ color: '#1a73e8', fontWeight: 'bold' }}>{u.phone || 'Chưa có'}</td>
                <td>{u.email || 'Chưa cập nhật'}</td>
                <td>{u.dateofbirth ? new Date(u.dateofbirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</td>
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
            );
          })}
          {users.length === 0 && (
            <tr><td colSpan="8" className="text-center p-2vw">Chưa có người dùng nào</td></tr>
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
                <input type="text" placeholder="Nhập họ tên" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required disabled={isSubmitting} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Email:</label>
                  <input type="email" placeholder="Nhập email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required disabled={isSubmitting} />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label>Số điện thoại:</label>
                  <input
                    type="tel"
                    placeholder="Nhập 10 chữ số..."
                    pattern="[0-9]{10}"
                    maxLength="10"
                    title="Số điện thoại phải bao gồm đúng 10 chữ số"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Ngày sinh:</label>
                  <input type="date" value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} disabled={isSubmitting} />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label>Vai trò:</label>
                  <select
                    value={formData.isAdmin ? 'true' : 'false'}
                    onChange={e => setFormData({ ...formData, isAdmin: e.target.value === 'true' })}
                    disabled={isSubmitting}
                  >
                    <option value="false">Khách hàng</option>
                    <option value="true">Admin</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ:</label>
                <input type="text" placeholder="Nhập địa chỉ" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} disabled={isSubmitting} />
              </div>

              <hr className="modal-divider" />
              <h4 style={{ margin: '0 0 10px 0', color: '#1a73e8' }}>Thông tin Đăng nhập (Bảng Account)</h4>
              {formData.id && <p style={{ fontSize: '13px', color: '#dc3545', marginBottom: '10px' }}>* Lưu ý: Để đổi Username hoặc Reset Mật khẩu, bạn bắt buộc phải nhập Mật khẩu mới.</p>}

              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Tên đăng nhập (Username):</label>
                  <input
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    required={!formData.id || !!formData.password}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Mật khẩu {formData.id ? '(Tùy chọn)' : '*'}:</label>
                  <input
                    type="password"
                    placeholder={formData.id ? "Nhập mật khẩu mới..." : "Nhập mật khẩu"}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    required={!formData.id}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

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