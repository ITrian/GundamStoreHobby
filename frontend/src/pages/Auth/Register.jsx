import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';
import './Register.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Register attempt:', { firstName, lastName, phone, email, password });
  };

  return (
    <ClientLayout>
      <div className="register-container">
        {/* Breadcrumb */}
        <div className="register-content">
          <div className="register-box">
            <h1 className="register-title">Đăng ký tài khoản</h1>
            <p className="register-subtitle">
              Bạn đã có tài khoản ? <Link to="/login" className="login-link">Đăng nhập tại đây</Link>
            </p>
            
            <h3 className="section-title">Thông tin cá nhân</h3>

            <form onSubmit={handleRegister} className="register-form">
              <div className="form-group">
                <label>Họ *</label>
                <input 
                  type="text" 
                  placeholder="Họ" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tên *</label>
                <input 
                  type="text" 
                  placeholder="Tên" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại *</label>
                <input 
                  type="tel" 
                  placeholder="Số điện thoại" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu *</label>
                <input 
                  type="password" 
                  placeholder="Mật khẩu" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="register-btn">Đăng ký</button>
            </form>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Register;
