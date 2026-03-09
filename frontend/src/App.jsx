import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Định nghĩa các cột dựa trên dữ liệu từ backend của bạn
  const columns = [
    {
      name: 'ID',
      selector: row => row.ID,
      sortable: true,
      width: '10vw'
    },
    {
      name: 'Name',
      selector: row => row.Name || 'N/A', // Đảm bảo khớp với field trong DB
      sortable: true,
    }
  ];

  // 2. Hàm lấy dữ liệu từ API Render
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://gundamstorehobby.onrender.com/users__getAll');
      const data = await response.json();
      setUsers(data); // Cập nhật state từ kết quả trả về
    } catch (error) {
      console.error("Lỗi fetch dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="table-container">
      <h2>Quản lý người dùng</h2>
      <div className="card">
        <DataTable
          columns={columns}
          data={users}
          progressPending={loading}
          pagination // Tự động phân trang
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent="Không có dữ liệu người dùng"
        />
      </div>
    </div>
  );
}

export default App;