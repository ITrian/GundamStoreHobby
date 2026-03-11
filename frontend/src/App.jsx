import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Form
  const [formData, setFormData] = useState({ ID: '', Name: '' });
  const [searchId, setSearchId] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = 'https://gundamstorehobby.onrender.com';

  // 1. Lấy tất cả users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users__getAll`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Tìm kiếm theo ID
  const handleSearch = async () => {
    if (!searchId) return fetchUsers();
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users__getById/${searchId}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      alert("Không tìm thấy user!");
    } finally {
      setLoading(false);
    }
  };

  // 3. Thêm hoặc Cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing ? `${API_URL}/api/users/${formData.ID}` : `${API_URL}/users__create`;

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ID: formData.ID,    // Phải viết hoa ID nếu DB/Backend yêu cầu thế
          Name: formData.Name // Phải viết hoa Name
        }),
      });

      if (response.ok) {
        alert(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setFormData({ ID: '', Name: '' });
        setIsEditing(false);
        fetchUsers();
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  // 4. Khi nhấn nút Sửa trên bảng
  const handleEditClick = (row) => {
    setFormData({ ID: row.ID, Name: row.Name });
    setIsEditing(true);
  };

  useEffect(() => { fetchUsers(); }, []);

  const columns = [
    { name: 'ID', selector: row => row.ID, sortable: true },
    { name: 'Name', selector: row => row.Name, sortable: true },
    {
      name: 'Thao tác',
      cell: (row) => <button onClick={() => handleEditClick(row)}>Sửa</button>,
    }
  ];

  return (
    <div className="table-container">
      <h2>Quản lý người dùng</h2>

      {/* Form Tìm kiếm */}
      <div className="search-box" style={{ marginBottom: '20px' }}>
        <input
          placeholder="Nhập ID cần tìm..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
        <button onClick={fetchUsers}>Reset</button>
      </div>

      {/* Form Thêm/Sửa */}
      <form onSubmit={handleSubmit} className="form-container" style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>{isEditing ? "Chỉnh sửa User" : "Thêm User mới"}</h3>
        <input
          placeholder="ID"
          value={formData.ID}
          disabled={isEditing} // Không cho sửa ID khi đang ở chế độ Edit
          onChange={(e) => setFormData({ ...formData, ID: e.target.value })}
          required
        />
        <input
          placeholder="Tên người dùng"
          value={formData.Name}
          onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
          required
        />
        <button type="submit">{isEditing ? "Cập nhật" : "Lưu"}</button>
        {isEditing && <button type="button" onClick={() => { setIsEditing(false); setFormData({ ID: '', Name: '' }) }}>Hủy</button>}
      </form>

      <div className="card">
        <DataTable
          columns={columns}
          data={users}
          progressPending={loading}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  );
}

export default App;