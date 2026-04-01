import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // Lỗi chung (như lỗi server)
  
  // State lưu lỗi của từng ô input
  const [fieldErrors, setFieldErrors] = useState({});
  const [existingEmails, setExistingEmails] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    address: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '' // Thêm trường Nhập lại mật khẩu
  });

  const API_URL = 'https://gundamstorehobby.onrender.com';

  // Lấy danh sách email đã tồn tại từ Backend ngay khi mở trang
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        if (res.ok) {
          const users = await res.json();
          // Trích xuất ra mảng chỉ chứa các email để check
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
    
    // Tự động xóa dòng chữ lỗi màu đỏ khi người dùng bắt đầu gõ lại
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

    let errors = {}; // Object chứa lỗi tạm thời

    // 1. VALIDATE MẬT KHẨU
    if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự!';
    }
    
    // 2. VALIDATE NHẬP LẠI MẬT KHẨU
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu nhập lại không khớp!';
    }

    // 3. VALIDATE EMAIL TỒN TẠI
    if (existingEmails.includes(formData.email)) {
      errors.email = 'Email này đã được sử dụng cho một tài khoản khác!';
    }

    // Nếu có bất kỳ lỗi nào ở trên -> Dừng lại và show lỗi
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    // Tách confirmPassword ra, chỉ gửi những dữ liệu Backend cần
    const { confirmPassword, ...payload } = formData;

    try {
      const registerPayload = {
        name: formData.name,
        dateofbirth: formData.dateOfBirth || null,
        email: formData.email,
        address: formData.address,
        isadmin: false
      };

      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        // 4. BẮT LỖI TÊN ĐĂNG NHẬP TỪ BACKEND TRẢ VỀ
        if (data.error && data.error.includes('Tên đăng nhập đã tồn tại')) {
          setFieldErrors({ username: 'Tên đăng nhập này đã có người sử dụng!' });
        } else {
          setErrorMsg(data.error || 'Đăng ký thất bại!');
        }
        setIsLoading(false);
        return;
      }
      navigate('/login');

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