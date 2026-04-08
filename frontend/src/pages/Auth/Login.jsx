import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Xóa bỏ hoàn toàn bcryptjs khỏi Frontend nhé!
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
    setErrorMsg(''); 

    try {
      const loginRes = await fetch(`${API_URL}/accounts/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const loginData = await loginRes.json();

      if (!loginRes.ok || loginData.error) {
        setErrorMsg(loginData.error || loginData.message || 'Sai tên đăng nhập hoặc mật khẩu!');
        setIsLoading(false);
        return;
      }

      const token = loginData.accessToken || loginData.Authorization || loginData.token;
      
      if (!token) {
        setErrorMsg('Lỗi Server: Đăng nhập thành công nhưng không nhận được Token!');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('accessToken', token);

      let userIdFromToken = loginData.userid; 
      try {
         const payload = JSON.parse(atob(token.split('.')[1]));
         userIdFromToken = payload.userid || userIdFromToken;
      } catch (err) {
         console.warn("Lưu ý: Không thể giải mã Token bằng Base64 trên Frontend.");
      }
      const userRes = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!userRes.ok) throw new Error('Không thể tải danh sách hồ sơ người dùng');
      
      const usersData = await userRes.json();
      
      let matchedUser = usersData.find(u => String(u.id) === String(userIdFromToken));
      
      if (!matchedUser) {
        matchedUser = usersData.find(u => u.username === username || u.email === username);
      }

      if (!matchedUser) {
        setErrorMsg('Tài khoản này chưa được liên kết với hồ sơ cá nhân!');
        setIsLoading(false);
        return;
      }

      const userInfoToSave = {
        ...matchedUser,
        userId: matchedUser.id, 
        username: username 
      };

      localStorage.setItem('user', JSON.stringify(userInfoToSave));
      navigate('/'); 

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