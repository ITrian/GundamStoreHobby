import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import '../../App.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: '', name: '' }); // id vẫn giữ để dùng khi Edit
  const [searchid, setSearchid] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = 'https://gundamstorehobby.onrender.com';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = async () => {
    if (!searchid) return fetchUsers();
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users/${searchid}`);
      const data = await response.json();
      // Nếu API trả về object đơn lẻ thay vì array, bọc nó lại để DataTable hiển thị được
      setUsers(Array.isArray(data) ? data : [data]);
    } catch (error) {
      Swal.fire('Lỗi', 'Không tìm thấy user!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing ? `${API_URL}/users/update/${formData.id}` : `${API_URL}/users/create`;

    // Khi thêm mới (POST), không gửi id vì server tự tăng
    const bodyData = isEditing
      ? { id: formData.id, name: formData.name }
      : { name: formData.name };

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        Swal.fire({
          title: isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });

        setFormData({ id: '', name: '' });
        setIsEditing(false);
        fetchUsers();
      } else {
        const errorData = await response.json();
        Swal.fire('Thất bại', `Lỗi: ${errorData.error || 'Server không phản hồi'}`, 'error');
      }
    } catch (error) {
      Swal.fire('Lỗi kết nối', 'Không thể kết nối tới server!', 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: `Muốn xóa User có id: ${id} không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa ngay!",
      cancelButtonText: "Hủy"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}/users/delete/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            Swal.fire("Đã xóa!", `User ${id} đã bị xóa.`, "success");
            fetchUsers();
          } else {
            Swal.fire('Thất bại', 'Không thể xóa user.', 'error');
          }
        } catch (error) {
          Swal.fire('Lỗi kết nối', 'Lỗi server!', 'error');
        }
      }
    });
  };

  const handleEditClick = (row) => {
    setFormData({ id: row.id, name: row.name });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cấu hình cột dùng chung cho id và name (viết thường)
  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '20%' },
    { name: 'Tên người dùng', selector: row => row.name, sortable: true, width: '55%' },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div className='action-buttons'>
          <button onClick={() => handleEditClick(row)}>Sửa</button>
          <button onClick={() => handleDelete(row.id)} style={{ backgroundColor: '#dc3545' }}>Xóa</button>
        </div>
      ),
      width: '25%'
    }
  ];
  const UserListSection2 = () => (
    <>
      <div className="note-container">
        <p>Nếu danh sách users tải quá lâu, <br />
          truy cập trang web backend và đợi để khởi động server:<br />
          <a href={API_URL} target="_blank" rel="noopener noreferrer">{API_URL}</a>
        </p>
      </div>
      <div className="card">
        <DataTable
          columns={columns2}
          data={users}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </>
  );
  return (
      <div className="table-container">
        <nav style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Link to="/">Quản lý</Link> | <Link to="/users">Xem danh sách</Link>
        </nav>
            <>
              <div className="search-box">
                <input
                  type="number"
                  placeholder="Nhập ID số..."
                  value={searchid}
                  onChange={(e) => setSearchid(e.target.value)}
                />
                <button onClick={handleSearch}>Tìm kiếm</button>
                <button onClick={() => { fetchUsers(); setSearchid('') }} style={{ backgroundColor: '#6c757d' }}>Làm mới</button>
              </div>

              <form onSubmit={handleSubmit} className="form-container">
                <h3>{isEditing ? `Đang sửa ID: ${formData.id}` : "Thêm User mới"}</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {/* Ô ID chỉ hiện khi đang sửa, và bị disabled */}
                  {isEditing && (
                    <input
                      style={{ flex: 1, backgroundColor: '#e9ecef' }}
                      value={formData.id}
                      disabled
                    />
                  )}
                  <input
                    placeholder="Nhập tên người dùng..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ flex: 3 }}
                  />
                </div>
                <div style={{ marginTop: '10px' }}>
                  <button type="submit" style={{ backgroundColor: isEditing ? '#ffc107' : '#28a745', color: isEditing ? '#000' : '#fff' }}>
                    {isEditing ? "Cập nhật" : "Thêm mới"}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: '', name: '' }) }} style={{ backgroundColor: '#6c757d', marginLeft: '10px' }}>
                      Hủy
                    </button>
                  )}
                </div>
              </form>
              <div className="note-container">
                <p>Nếu danh sách users tải quá lâu, <br />
                  truy cập trang web backend và đợi để khởi động server:<br />
                  <a href={API_URL} target="_blank" rel="noopener noreferrer">{API_URL}</a>
                </p>
              </div>
              <div className="card">
                <DataTable
                  columns={columns}
                  data={users}
                  progressPending={loading}
                  pagination
                  highlightOnHover
                />
              </div>
            </>
      </div>
  );
}

export default UserManagement;