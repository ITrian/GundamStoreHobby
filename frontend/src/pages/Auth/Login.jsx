import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <ClientLayout>
      <div className="login-container">
        {/* Main Form Content */}
        <div className="login-content">
          <div className="login-box">
            <h1 className="login-title">Đăng nhập tài khoản</h1>
            <p className="login-subtitle">
              Bạn chưa có tài khoản ? <Link to="/register" className="register-link">Đăng ký tại đây</Link>
            </p>

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <input 
                  type="password" 
                  placeholder="Mật khẩu" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="forgot-password">
                <span>Quên mật khẩu? <Link to="/forgot-password">Nhấn vào đây</Link></span>
              </div>

              <button type="submit" className="login-btn">Đăng nhập</button>
            </form>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Login;
