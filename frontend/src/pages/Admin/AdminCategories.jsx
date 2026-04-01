import React, { useState, useEffect } from 'react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '' });
  
  // States cho Custom Alert & Confirm (Popup)
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, message: '', type: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) throw new Error('Lỗi tải danh mục');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi fetch categories:", error);
    }
  };

  // --- HÀM TIỆN ÍCH CHO POPUP ---
  const showAlert = (message, type = 'info') => setAlertDialog({ isOpen: true, message, type });
  const showConfirm = (message, onConfirm) => setConfirmDialog({ isOpen: true, message, onConfirm });
  const closeAlert = () => setAlertDialog({ isOpen: false, message: '', type: 'info' });
  const closeConfirm = () => setConfirmDialog({ isOpen: false, message: '', onConfirm: null });

  // --- MỞ MODAL THÊM/SỬA ---
  const handleOpenModal = (category = null) => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({ id: null, name: '' });
    }
    setIsModalOpen(true);
  };

  // --- LƯU (THÊM HOẶC SỬA) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!formData.id;
    const url = isEdit ? `${API_URL}/categories/${formData.id}` : `${API_URL}/categories`;
    
    // ĐÃ SỬA: Backend của bạn dùng PUT cho sửa, POST cho thêm mới
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        showAlert(isEdit ? "Lỗi cập nhật danh mục từ Server!" : "Lỗi thêm danh mục từ Server!", "error");
        return;
      }

      showAlert(isEdit ? "Cập nhật danh mục thành công!" : "Thêm danh mục mới thành công!", "success");
      setIsModalOpen(false);
      fetchCategories(); 
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
      showAlert("Lỗi kết nối đến máy chủ!", "error");
    }
  };

  // --- XÓA DANH MỤC ---
  const handleDelete = (id) => {
    showConfirm('Bạn có chắc chắn muốn xóa danh mục này? LƯU Ý: Nếu danh mục này đang chứa sản phẩm, hệ thống sẽ chặn không cho xóa để bảo vệ dữ liệu.', async () => {
      try {
        const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
        
        if (!res.ok) {
          showAlert("Không thể xóa danh mục! Có thể danh mục này đang chứa sản phẩm.", "error");
          return;
        }

        showAlert("Đã xóa danh mục thành công!", "success");
        fetchCategories(); 
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        showAlert("Lỗi kết nối khi xóa!", "error");
      }
    });
  };

  return (
    <div className="admin-categories-container">
      <h2>Quản lý Danh mục</h2>
      <button className="btn-add" onClick={() => handleOpenModal()} style={{ marginBottom: '1.5vw' }}>
        <i className="bi bi-plus-circle" style={{ marginRight: '0.5vw' }}></i>Thêm Danh mục
      </button>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>ID</th>
            <th style={{ width: '60%' }}>Tên danh mục</th>
            <th style={{ width: '30%' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2vw', color: '#666' }}>Chưa có danh mục nào</td></tr>
          ) : (
            categories.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 'bold' }}>#{c.id}</td>
                <td style={{ fontWeight: 'bold', color: '#1a73e8' }}>{c.name}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleOpenModal(c)}>
                    <i className="bi bi-pencil-square" style={{ marginRight: '0.3vw' }}></i> Sửa
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(c.id)}>
                    <i className="bi bi-trash" style={{ marginRight: '0.3vw' }}></i> Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* POPUP: FORM THÊM / SỬA */}
      {isModalOpen && (
        <div className="admin-modal">
          <div className="modal-content" style={{ maxWidth: '40vw' }}>
            <h3 style={{ borderBottom: '0.1vw solid #eee', paddingBottom: '1vw', marginBottom: '1.5vw', color: '#1a73e8' }}>
              {formData.id ? 'Sửa Danh mục' : 'Thêm Danh mục'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1.5vw' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5vw' }}>Tên danh mục:</label>
                <input 
                  type="text" 
                  placeholder="Nhập tên danh mục (vd: MODEL KIT TRUNG)" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '0.8vw', borderRadius: '0.3vw', border: '0.1vw solid #ccc', fontSize: '1vw', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1vw' }}>
                <button type="submit" className="btn-save" style={{ padding: '0.6vw 2vw' }}>Lưu lại</button>
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6vw 2vw' }}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP: XÁC NHẬN XÓA (CONFIRM) */}
      {confirmDialog.isOpen && (
        <div className="admin-modal top-layer" style={{ zIndex: 9999 }}>
          <div className="modal-content alert-modal" style={{ maxWidth: '30vw', textAlign: 'center' }}>
            <h3 style={{ color: '#dc3545', marginBottom: '1vw' }}><i className="bi bi-exclamation-triangle-fill"></i> Xác nhận</h3>
            <p style={{ marginBottom: '1.5vw', fontSize: '1.1vw', color: '#333' }}>{confirmDialog.message}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1vw' }}>
              <button
                className="btn-delete"
                style={{ padding: '0.6vw 1.5vw' }}
                onClick={() => {
                  if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                  closeConfirm();
                }}
              >
                Đồng ý
              </button>
              <button
                className="btn-cancel"
                style={{ padding: '0.6vw 1.5vw', backgroundColor: '#6c757d' }}
                onClick={closeConfirm}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: THÔNG BÁO THÀNH CÔNG / LỖI (ALERT) */}
      {alertDialog.isOpen && (
        <div className="admin-modal top-layer" style={{ zIndex: 9999 }}>
          <div className="modal-content alert-modal" style={{ maxWidth: '30vw', textAlign: 'center' }}>
            <h3 style={{ color: alertDialog.type === 'error' ? '#dc3545' : '#28a745', marginBottom: '1vw' }}>
              {alertDialog.type === 'error' ? <i className="bi bi-x-circle-fill"></i> : <i className="bi bi-check-circle-fill"></i>} Thông báo
            </h3>
            <p style={{ marginBottom: '1.5vw', fontSize: '1.1vw', color: '#333' }}>{alertDialog.message}</p>
            <button
              className="btn-save"
              style={{ padding: '0.6vw 2vw' }}
              onClick={closeAlert}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;