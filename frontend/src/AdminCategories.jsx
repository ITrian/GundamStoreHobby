import React, { useState, useEffect } from 'react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '' });
  
  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/category/all`);
      if (!res.ok) throw new Error('Lỗi tải danh mục');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi fetch categories:", error);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      // Mở modal để Sửa
      setFormData(category);
    } else {
      // Mở modal để Thêm mới
      setFormData({ id: null, name: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = formData.id ? `${API_URL}/category/update` : `${API_URL}/category/add`;
    const method = formData.id ? 'PATCH' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      fetchCategories(); // Load lại data sau khi lưu
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này? LƯU Ý: Nếu danh mục này đang có sản phẩm, thao tác có thể bị lỗi từ database.')) {
      try {
        await fetch(`${API_URL}/category/delete/${id}`, { method: 'DELETE' });
        fetchCategories(); // Load lại data sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
      }
    }
  };

  return (
    <div>
      <h2>Quản lý Danh mục</h2>
      <button className="btn-add" onClick={() => handleOpenModal()}>+ Thêm Danh mục</button>
      
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
            <tr><td colSpan="3" style={{ textAlign: 'center' }}>Chưa có danh mục nào</td></tr>
          ) : (
            categories.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleOpenModal(c)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDelete(c.id)}>Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="admin-modal">
          <div className="modal-content">
            <h3>{formData.id ? 'Sửa Danh mục' : 'Thêm Danh mục'}</h3>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Nhập tên danh mục (vd: MODEL KIT TRUNG)" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-save">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;