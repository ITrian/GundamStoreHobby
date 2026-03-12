import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ ID: '', Name: '' });
  const [searchId, setSearchId] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = 'https://gundamstorehobby.onrender.com';

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

  const handleSearch = async () => {
    if (!searchId) return fetchUsers();
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users__getById/${searchId}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      Swal.fire('Lỗi', 'Không tìm thấy user!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing ? `${API_URL}/api/users/${formData.ID}` : `${API_URL}/users__create`;

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ID: formData.ID,
          Name: formData.Name
        }),
      });

      if (response.ok) {
        Swal.fire({
          title: isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });

        setFormData({ ID: '', Name: '' });
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
      text: `Muốn xóa User có ID: ${id} không? Hành động này không thể hoàn tác!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa ngay!",
      cancelButtonText: "Hủy"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

          const response = await fetch(`${API_URL}/users__delete/${id}`, { // Đổi URL ở đây
            method: 'DELETE',
          });

          if (response.ok) {
            Swal.fire(
              "Đã xóa!",
              `User có ID ${id} đã được xóa khỏi hệ thống.`,
              "success"
            );
            fetchUsers(); // Làm mới lại bảng data sau khi xóa
          } else {
            const errorData = await response.json();
            Swal.fire('Thất bại', `Lỗi: ${errorData.error || 'Không thể xóa user do lỗi server'}`, 'error');
          }
        } catch (error) {
          Swal.fire('Lỗi kết nối', 'Không thể kết nối tới server để xóa!', 'error');
        }
      }
    });
  };

  const handleEditClick = (row) => {
    setFormData({ ID: row.ID, Name: row.Name });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => { fetchUsers(); }, []);

  const columns = [
    { name: 'ID', selector: row => row.ID, sortable: true, width: '25%' },
    { name: 'Tên người dùng', selector: row => row.Name, sortable: true, width: '50%' },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div className='action-buttons'>
          <button onClick={() => handleEditClick(row)}>
            Sửa
          </button>
          <button onClick={() => handleDelete(row.ID)}>
            Xóa
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '25%'
    }
  ];

  return (

    <div className="table-container">
      <div className="search-box">
        <input
          placeholder="Nhập ID cần tìm..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
        <button onClick={fetchUsers} style={{ backgroundColor: '#6c757d' }}>Làm mới</button>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <h3>{isEditing ? "Chỉnh sửa User" : "Thêm User mới"}</h3>
        <div>
          <input
            placeholder="ID (Nhập đúng 10 ký tự, ví dụ: DH00000001)"
            value={formData.ID}
            disabled={isEditing}
            onChange={(e) => setFormData({ ...formData, ID: e.target.value })}
            required
          />
          <input
            placeholder="Tên người dùng"
            value={formData.Name}
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            required
            style={{ flex: 2 }}
          />
        </div>
        <div>
          <button type="submit" style={{ backgroundColor: isEditing ? '#ffc107' : '#28a745', color: isEditing ? '#000' : '#fff' }}>
            {isEditing ? "Cập nhật" : "Thêm"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => { setIsEditing(false); setFormData({ ID: '', Name: '' }) }}
              style={{ backgroundColor: '#6c757d', marginLeft: '10px' }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>
      <div className="note-container">
        <p>Nếu danh sách users tải quá lâu, <br />
          truy cập trang web backend và đợi để khởi động server:<br />
          <a href="https://gundamstorehobby.onrender.com" target="_blank" rel="noopener noreferrer">
            https://gundamstorehobby.onrender.com
          </a>
        </p>
      </div>
      <div className="card">
        <DataTable
          columns={columns}
          data={users}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
        />
      </div>

    </div>
  );
}

export default App;