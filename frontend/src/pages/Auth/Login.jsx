import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = 'https://gundamstorehobby.onrender.com';

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(''); // Xóa lỗi cũ nếu có

    try {
      const response = await fetch(`${API_URL}/account/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) // Truyền đúng key backend cần
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || 'Đăng nhập thất bại!');
        setIsLoading(false);
        return;
      }

      alert('Đăng nhập thành công!');
      // Có thể lưu thông tin user vào localStorage ở đây
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/'); // Chuyển về trang chủ
      
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      setErrorMsg('Lỗi kết nối đến máy chủ!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClientLayout>
      <div className="login-container">
        <div className="login-content">
          <div className="login-box">
            <h1 className="login-title">Đăng nhập tài khoản</h1>
            <p className="login-subtitle">
              Bạn chưa có tài khoản ? <br/><Link to="/register" className="register-link">Đăng ký tại đây</Link>
            </p>

            {/* Hiển thị lỗi từ API */}
            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label>Tên đăng nhập *</label>
                <input 
                  type="text" 
                  placeholder="Nhập tên đăng nhập" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu *</label>
                <input 
                  type="password" 
                  placeholder="Nhập mật khẩu" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="forgot-password">
                <span>Quên mật khẩu? <Link to="/forgot-password">Nhấn vào đây</Link></span>
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Login;