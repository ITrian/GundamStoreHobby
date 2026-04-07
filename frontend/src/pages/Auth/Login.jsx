import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'; // ĐÃ THÊM: Thư viện so sánh mật khẩu mã hóa
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
      // 1. Gọi API kiểm tra Tên đăng nhập
      const accountRes = await fetch(`${API_URL}/accounts/${username}`);
      
      if (accountRes.status === 404) {
        setErrorMsg('Tên đăng nhập không tồn tại!');
        setIsLoading(false);
        return;
      }
      
      if (!accountRes.ok) throw new Error('Lỗi máy chủ khi xác thực');
      
      const rawData = await accountRes.json();
      const accountInfo = Array.isArray(rawData) ? rawData[0] : rawData;

      if (!accountInfo) {
        setErrorMsg('Tên đăng nhập không tồn tại!');
        setIsLoading(false);
        return;
      }

      // ĐÃ SỬA CHÍNH TẠI ĐÂY: Dùng bcrypt để so sánh mật khẩu thường và mật khẩu mã hóa (hash)
      const isPasswordMatch = bcrypt.compareSync(password, accountInfo.password);

      if (!isPasswordMatch) {
        setErrorMsg('Sai mật khẩu! Vui lòng thử lại.');
        setIsLoading(false);
        return;
      }

      // 3. Mật khẩu ĐÚNG -> Lấy thông tin chi tiết User
      const userRes = await fetch(`${API_URL}/users`);
      if (!userRes.ok) throw new Error('Không thể lấy danh sách hồ sơ người dùng');
      
      const usersData = await userRes.json();
      const matchedUser = usersData.find(u => String(u.id) === String(accountInfo.userid));

      if (!matchedUser) {
        setErrorMsg('Lỗi dữ liệu: Tài khoản chưa được liên kết với hồ sơ người dùng!');
        setIsLoading(false);
        return;
      }

      // 4. Lưu vào localStorage và đá về trang chủ
      const userInfoToSave = {
        ...matchedUser,
        userId: matchedUser.id, 
        username: accountInfo.username 
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