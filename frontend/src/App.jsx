// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import UserManagement from './UserManagement'; // Chứa code cũ của bạn
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ mới */}
        <Route path="/" element={<HomePage />} />
        
        {/* Dời trang quản lý user của bạn sang đây */}
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;