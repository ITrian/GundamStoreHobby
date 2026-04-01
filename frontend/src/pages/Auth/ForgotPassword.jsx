import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Logic gọi API gửi email khôi phục mật khẩu sẽ được làm sau
    }
  };

  return (
    <ClientLayout>
      <div className="forgot-pw-wrapper">
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link> / <span>Đăng nhập tài khoản</span>
        </div>

        <div className="forgot-pw-container">
          <div className="forgot-pw-content">
            <div className="forgot-pw-box">
              <h1 className="forgot-title">Đăng nhập tài khoản</h1>
              <p className="forgot-subtitle">
                Bạn chưa có tài khoản ? <Link to="/register" className="register-link">Đăng ký tại đây</Link>
              </p>

              <div className="reset-section">
                <h2 className="reset-title">Đặt lại mật khẩu</h2>
                <p className="reset-desc">
                  Chúng tôi sẽ gửi cho bạn một email để kích hoạt việc đặt lại mật khẩu.
                </p>

                {isSubmitted ? (
                  <div className="success-message">
                    Email khôi phục đã được gửi! Vui lòng kiểm tra hộp thư của bạn.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="forgot-form">
                    <div className="form-group">
                      <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="email-input"
                      />
                    </div>

                    <button type="submit" className="forgot-btn">
                      Lấy lại mật khẩu
                    </button>
                  </form>
                )}

                <div className="back-link">
                  <Link to="/login">Quay lại</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ForgotPassword;
