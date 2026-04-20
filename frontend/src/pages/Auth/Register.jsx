import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); 
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [existingEmails, setExistingEmails] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    address: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        if (res.ok) {
          const users = await res.json();
          const emails = users.map(u => u.email).filter(e => e);
          setExistingEmails(emails);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách để check email:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (fieldErrors[e.target.name]) {
      setFieldErrors({
        ...fieldErrors,
        [e.target.name]: ''
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setFieldErrors({});

    let errors = {}; 

    // 1. VALIDATE
    if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự!';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu nhập lại không khớp!';
    }

    if (existingEmails.includes(formData.email)) {
      errors.email = 'Email này đã được sử dụng cho một tài khoản khác!';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      // BƯỚC 1: TẠO HỒ SƠ NGƯỜI DÙNG (BẢNG USER)
      const userPayload = {
        name: formData.name,
        dateofbirth: formData.dateOfBirth || null,
        email: formData.email,
        phone: formData.phone || null,
        address: formData.address,
        isadmin: false
      };

      const resUser = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      });

      const dataUser = await resUser.json();

      if (!resUser.ok) {
        setErrorMsg(dataUser.error || 'Lỗi khi tạo hồ sơ người dùng!');
        setIsLoading(false);
        return;
      }

      // BƯỚC 2: TẠO TÀI KHOẢN ĐĂNG NHẬP (BẢNG ACCOUNT)
      const accPayload = {
        userid: dataUser.id, 
        username: formData.username,
        password: formData.password,
        isactived: true
      };

      const resAcc = await fetch(`${API_URL}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accPayload)
      });

      const dataAcc = await resAcc.json();

      if (!resAcc.ok) {
        if (dataAcc.error && dataAcc.error.includes('Username')) {
          setFieldErrors({ username: 'Tên đăng nhập này đã có người sử dụng!' });
        } else {
          setErrorMsg(dataAcc.error || 'Lỗi khi tạo tài khoản đăng nhập!');
        }
        setIsLoading(false);
        return;
      }

      // BƯỚC 3: TỰ ĐỘNG ĐĂNG NHẬP
      const loginRes = await fetch(`${API_URL}/accounts/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: formData.username, 
          password: formData.password 
        })
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        const token = loginData.accessToken || loginData.token || loginData.Authorization;
        if (token) {
          localStorage.setItem('accessToken', token);
        }

        // Lưu thông tin user để dùng trên Header / Giỏ hàng
        const userInfoToSave = {
          ...dataUser,
          userId: dataUser.id,
          username: formData.username,
          isAdmin: false
        };
        localStorage.setItem('user', JSON.stringify(userInfoToSave));

        // Âm thầm chuyển hướng về trang chủ
        navigate('/');
      } else {
        // Dự phòng nếu API login lỗi, đẩy ra trang đăng nhập
        navigate('/login');
      }

    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      setErrorMsg('Lỗi kết nối đến máy chủ!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClientLayout>
      <div className="register-container">
        <div className="register-content">
          <div className="register-box">
            <h1 className="register-title">Đăng ký tài khoản</h1>
            <p className="register-subtitle">
              Bạn đã có tài khoản ? <br/><Link to="/login" className="login-link">Đăng nhập tại đây</Link>
            </p>
            
            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <form onSubmit={handleRegister} className="register-form">
              <h3 className="section-title">Thông tin cá nhân</h3>
              
              <div className="form-group">
                <label>Họ và Tên *</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Nhập họ và tên" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group-row">
                <div className="form-group half">
                  <label>Ngày sinh</label>
                  <input 
                    type="date" 
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group half">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Nhập 10 chữ số..."
                    pattern="[0-9]{10}"
                    maxLength="10"
                    title="Số điện thoại phải bao gồm đúng 10 chữ số"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group half">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Nhập email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className={fieldErrors.email ? 'input-error' : ''}
                  />
                  {fieldErrors.email && <span className="input-error-msg">{fieldErrors.email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input 
                  type="text" 
                  name="address"
                  placeholder="Nhập địa chỉ nhận hàng" 
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <hr className="divider" />
              <h3 className="section-title">Thông tin bảo mật</h3>

              <div className="form-group">
                <label>Tên đăng nhập (Username) *</label>
                <input 
                  type="text" 
                  name="username"
                  placeholder="Tên dùng để đăng nhập (Viết liền không dấu)" 
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={fieldErrors.username ? 'input-error' : ''}
                />
                {fieldErrors.username && <span className="input-error-msg">{fieldErrors.username}</span>}
              </div>

              <div className="form-group-row">
                <div className="form-group half">
                  <label>Mật khẩu *</label>
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Nhập mật khẩu" 
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className={fieldErrors.password ? 'input-error' : ''}
                  />
                  {fieldErrors.password && <span className="input-error-msg">{fieldErrors.password}</span>}
                </div>
                
                <div className="form-group half">
                  <label>Nhập lại mật khẩu *</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="Xác nhận lại mật khẩu" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className={fieldErrors.confirmPassword ? 'input-error' : ''}
                  />
                  {fieldErrors.confirmPassword && <span className="input-error-msg">{fieldErrors.confirmPassword}</span>}
                </div>
              </div>

              <button type="submit" className="register-btn" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Register;