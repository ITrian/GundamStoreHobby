import React, { useState, useEffect } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allImages, setAllImages] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false); 
  
  const [formData, setFormData] = useState({ id: null, name: '', quantity: 0, detail: '', categoryid: '', price: 0 });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]); 
  const [existingImages, setExistingImages] = useState([]); 

  // --- STATE TÌM KIẾM, LỌC VÀ SẮP XẾP ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // State mới cho Bộ lọc Danh mục
  const [sortOption, setSortOption] = useState('');

  // --- STATE CHO POPUP XEM/XÓA ẢNH ---
  const [isImageViewModalOpen, setIsImageViewModalOpen] = useState(false);
  const [viewingImages, setViewingImages] = useState([]);
  const [viewingProductName, setViewingProductName] = useState('');
  const [isDeletingImage, setIsDeletingImage] = useState(false); 

  // --- STATE CHO CUSTOM CONFIRM & ALERT POPUP ---
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, message: '' });

  const API_URL = 'https://gundamstorehobby.onrender.com';
  const IMGBB_API_KEY = '9b2d9a3abb95e78e1188e5066c9102d5'; 

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchAllImages(); 
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/product/getAllProducts`);
      const data = await res.json();
      setProducts(data);
    } catch (e) { console.error(e); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/category/all`);
      const data = await res.json();
      setCategories(data);
    } catch (e) { console.error(e); }
  };

  const fetchAllImages = async () => {
    try {
      const res = await fetch(`${API_URL}/image/getAllImages`);
      const data = await res.json();
      setAllImages(data);
    } catch (e) { console.error(e); }
  };

  const getCategoryName = (id) => categories.find(c => String(c.id) === String(id))?.name || 'Không xác định';

  // --- XỬ LÝ LỌC & SẮP XẾP SẢN PHẨM KẾT HỢP ---
  const filteredAndSortedProducts = [...products]
    .filter(p => {
      const query = searchQuery.toLowerCase();
      // Điều kiện 1: Khớp Tên hoặc ID
      const matchSearch = p.id.toString().includes(query) || p.name.toLowerCase().includes(query);
      // Điều kiện 2: Khớp Danh mục (Nếu selectedCategory rỗng thì bỏ qua lọc danh mục)
      const matchCategory = selectedCategory === '' || String(p.categoryid) === String(selectedCategory);
      
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      // Chỉ còn sắp xếp theo giá
      if (sortOption === 'price_asc') return parseFloat(a.price) - parseFloat(b.price);
      if (sortOption === 'price_desc') return parseFloat(b.price) - parseFloat(a.price);
      return 0; // Mặc định giữ nguyên theo DB (ID)
    });

  // --- HÀM TIỆN ÍCH GỌI POPUP ---
  const showAlert = (message) => setAlertDialog({ isOpen: true, message });
  const showConfirm = (message, onConfirmCallback) => setConfirmDialog({ isOpen: true, message, onConfirm: onConfirmCallback });
  const closeConfirm = () => setConfirmDialog({ isOpen: false, message: '', onConfirm: null });

  // --- MỞ POPUP ẢNH ---
  const handleViewImages = (product) => {
    const productImages = allImages.filter(img => String(img.productid) === String(product.id));
    setViewingImages(productImages);
    setViewingProductName(product.name);
    setIsImageViewModalOpen(true);
  };

  // --- HÀM XÓA 1 ẢNH ---
  const handleDeleteSingleImage = (imageToDelete) => {
    showConfirm("Bạn có chắc muốn xóa ảnh này khỏi sản phẩm?", async () => {
      setIsDeletingImage(true);
      try {
        const res = await fetch(`${API_URL}/image/deleteSingleImage/${imageToDelete.productid}/${imageToDelete.detail}`, { method: 'DELETE' });
        if (!res.ok) {
          showAlert("Lỗi từ server: Không thể xóa ảnh này!");
          setIsDeletingImage(false);
          return; 
        }
        setViewingImages(prev => prev.filter(img => img.id !== imageToDelete.id));
        setExistingImages(prev => prev.filter(img => img.id !== imageToDelete.id));
        fetchAllImages();
        showAlert("Xóa ảnh thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa ảnh:", error);
        showAlert("Đã xảy ra lỗi kết nối khi xóa ảnh!");
      } finally {
        setIsDeletingImage(false);
      }
    });
  };

  // --- MỞ MODAL THÊM / SỬA SP ---
  const handleOpenModal = async (product = null) => {
    setSelectedFiles([]); 
    setPreviewUrls([]);
    setExistingImages([]); 

    if (product) {
      setFormData(product);
      try {
        const res = await fetch(`${API_URL}/image/product/${product.id}`);
        const data = await res.json();
        setExistingImages(data);
      } catch(e) { console.error(e); }
    } else {
      setFormData({ id: null, name: '', quantity: 0, detail: '', categoryid: categories[0]?.id || '', price: 0 });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleDeleteAllOldImages = () => {
    showConfirm("Bạn có chắc muốn xóa TOÀN BỘ ảnh cũ của sản phẩm này không?", async () => {
      try {
        const res = await fetch(`${API_URL}/image/deleteImage/${formData.id}`, { method: 'DELETE' });
        if (!res.ok) {
           showAlert("Lỗi từ server: Không thể xóa toàn bộ ảnh!");
           return;
        }
        setExistingImages([]); 
        fetchAllImages(); 
        showAlert("Đã xóa toàn bộ ảnh cũ thành công!");
      } catch (e) { 
        console.error(e);
        showAlert("Lỗi kết nối khi xóa ảnh!");
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true); 
    
    const productUrl = formData.id ? `${API_URL}/product/updateProduct` : `${API_URL}/product/insertProduct`;
    const productMethod = formData.id ? 'PATCH' : 'POST';

    try {
      const res = await fetch(productUrl, {
        method: productMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        showAlert("Lỗi khi lưu thông tin sản phẩm!");
        setIsUploading(false);
        return;
      }

      const savedProduct = await res.json();
      const productId = formData.id || savedProduct.id; 

      if (selectedFiles.length > 0) {
        for (let file of selectedFiles) {
          const imgbbFormData = new FormData();
          imgbbFormData.append('key', IMGBB_API_KEY);
          imgbbFormData.append('image', file);
          imgbbFormData.append('name', file.name.split('.')[0]); 

          const imgbbRes = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: imgbbFormData
          });
          const imgbbData = await imgbbRes.json();

          if (imgbbData.success) {
            const imageUrl = imgbbData.data.url; 
            await fetch(`${API_URL}/image/insertImage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productid: productId,
                detail: file.name, 
                link: imageUrl
              })
            });
          } else {
            console.error("Lỗi từ ImgBB:", imgbbData);
            showAlert(`Lỗi khi up ảnh ${file.name} lên ImgBB!`);
          }
        }
      }

      setIsModalOpen(false);
      fetchProducts(); 
      fetchAllImages(); 
      showAlert("Lưu sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      showAlert("Đã xảy ra lỗi kết nối khi lưu sản phẩm!");
    } finally {
      setIsUploading(false); 
    }
  };

  const handleDeleteProduct = (id) => {
    showConfirm('Bạn có chắc chắn muốn xóa sản phẩm này?', async () => {
      try {
        await fetch(`${API_URL}/image/deleteImage/${id}`, { method: 'DELETE' });
        const res = await fetch(`${API_URL}/product/deleteProduct/${id}`, { method: 'DELETE' });
        
        if (!res.ok) {
          showAlert("Lỗi từ server: Không thể xóa sản phẩm!");
          return;
        }

        showAlert("Xóa sản phẩm thành công!");
        fetchProducts();
        fetchAllImages(); 
      } catch (error) {
        showAlert("Lỗi kết nối khi xóa sản phẩm!");
      }
    });
  };

  return (
    <div>
      <h2>Quản lý Sản phẩm</h2>
      
      {/* THANH CÔNG CỤ (Thêm SP, Search, Lọc Danh Mục, Sort Giá) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5vw', flexWrap: 'wrap', gap: '1vw' }}>
        <button className="btn-add" style={{ margin: 0 }} onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-circle" style={{ marginRight: '0.5vw' }}></i>Thêm Sản phẩm
        </button>
        
        <div style={{ display: 'flex', gap: '1vw', flexWrap: 'wrap' }}>
          
          {/* Ô Tìm Kiếm */}
          <div style={{ position: 'relative' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: '0.8vw', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '1vw' }}></i>
            <input 
              type="text" 
              placeholder="Tìm ID hoặc Tên SP..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.6vw 1vw 0.6vw 2.5vw', fontSize: '0.9vw', border: '0.1vw solid #ccc', borderRadius: '0.3vw', width: '18vw', outline: 'none' }}
            />
          </div>
          
          {/* Select Bộ lọc Danh Mục */}
          <div style={{ position: 'relative' }}>
            <i className="bi bi-funnel" style={{ position: 'absolute', left: '0.8vw', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '1vw' }}></i>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '0.6vw 1vw 0.6vw 2.5vw', fontSize: '0.9vw', border: '0.1vw solid #ccc', borderRadius: '0.3vw', outline: 'none', cursor: 'pointer' }}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Select Sắp xếp Giá */}
          <div style={{ position: 'relative' }}>
            <i className="bi bi-sort-down" style={{ position: 'absolute', left: '0.8vw', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '1vw' }}></i>
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ padding: '0.6vw 1vw 0.6vw 2.5vw', fontSize: '0.9vw', border: '0.1vw solid #ccc', borderRadius: '0.3vw', outline: 'none', cursor: 'pointer' }}
            >
              <option value="">Sắp xếp mặc định</option>
              <option value="price_asc">Giá: Thấp → Cao</option>
              <option value="price_desc">Giá: Cao → Thấp</option>
            </select>
          </div>
        </div>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Hình ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedProducts.map(p => {
            const categoryName = getCategoryName(p.categoryid);
            const imageCount = allImages.filter(img => String(img.productid) === String(p.id)).length;

            return (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td><span style={{ fontWeight: 'bold', color: '#1a73e8' }}>{categoryName}</span></td>
                <td>{Number(p.price).toLocaleString('vi-VN')} đ</td>
                <td>{p.quantity}</td>
                <td>
                  <span 
                    onClick={() => handleViewImages(p)}
                    style={{ color: '#17a2b8', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
                    title="Click để xem & xóa hình ảnh"
                  >
                    <i className="bi bi-images" style={{ marginRight: '0.3vw' }}></i> {imageCount} ảnh
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleOpenModal(p)}>
                    <i className="bi bi-pencil-square" style={{ marginRight: '0.3vw' }}></i> Sửa
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteProduct(p.id)}>
                    <i className="bi bi-trash" style={{ marginRight: '0.3vw' }}></i> Xóa
                  </button>
                </td>
              </tr>
            );
          })}
          {filteredAndSortedProducts.length === 0 && (
             <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2vw', color: '#666', fontSize: '1.1vw' }}>Không tìm thấy sản phẩm nào!</td></tr>
          )}
        </tbody>
      </table>

      {/* POPUP XEM & XÓA HÌNH ẢNH (Đã quy đổi ra vw) */}
      {isImageViewModalOpen && (
        <div className="admin-modal">
          <div className="modal-content" style={{ maxWidth: '50vw', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1vw' }}>
              <h3 style={{ margin: 0 }}>Hình ảnh: {viewingProductName}</h3>
              <button 
                onClick={() => setIsImageViewModalOpen(false)} 
                style={{ background: 'none', border: 'none', fontSize: '1.5vw', cursor: 'pointer', color: '#888' }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            {viewingImages.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2vw', color: '#666', fontSize: '1vw' }}>Sản phẩm này chưa có hình ảnh nào.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(10vw, 1fr))', gap: '1vw' }}>
                {viewingImages.map(img => (
                  <div key={img.id} style={{ position: 'relative', border: '0.1vw solid #ddd', padding: '0.8vw', borderRadius: '0.5vw', textAlign: 'center', background: '#fdfdfd' }}>
                    <button
                      onClick={() => handleDeleteSingleImage(img)}
                      disabled={isDeletingImage}
                      title="Xóa ảnh này"
                      style={{
                        position: 'absolute', top: '-0.5vw', right: '-0.5vw',
                        background: '#dc3545', color: 'white', border: 'none',
                        borderRadius: '50%', width: '2vw', height: '2vw',
                        cursor: isDeletingImage ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1vw', fontWeight: 'bold', boxShadow: '0 0.2vw 0.4vw rgba(0,0,0,0.2)',
                        opacity: isDeletingImage ? 0.5 : 1
                      }}
                    ><i className="bi bi-x"></i></button>
                    <img src={img.link} alt={img.detail} style={{ width: '100%', height: '10vw', objectFit: 'contain', borderRadius: '0.3vw', marginBottom: '0.5vw' }} />
                    <p style={{ margin: 0, fontSize: '0.8vw', color: '#333', wordWrap: 'break-word', fontWeight: 'bold' }}>
                      {img.detail || 'Không có tên'}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ textAlign: 'right', marginTop: '1.5vw', borderTop: '0.1vw solid #eee', paddingTop: '1vw' }}>
              <button className="btn-cancel" onClick={() => setIsImageViewModalOpen(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM / SỬA SẢN PHẨM CHÍNH */}
      {isModalOpen && (
        <div className="admin-modal">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>{formData.id ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}</h3>
            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label>Tên sản phẩm:</label>
                <input type="text" placeholder="VD: PGU 1/60 RX-78-2 Gundam" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required disabled={isUploading} />
              </div>

              <div className="form-group">
                <label>Giá (VNĐ):</label>
                <input type="number" placeholder="Nhập giá tiền" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required disabled={isUploading} />
              </div>

              <div className="form-group">
                <label>Số lượng:</label>
                <input type="number" placeholder="Nhập số lượng trong kho" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required disabled={isUploading} />
              </div>

              <div className="form-group">
                <label>Danh mục:</label>
                <select value={formData.categoryid} onChange={e => setFormData({...formData, categoryid: e.target.value})} required disabled={isUploading}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Chi tiết sản phẩm:</label>
                <textarea rows="3" placeholder="Nhập mô tả chi tiết sản phẩm..." value={formData.detail} onChange={e => setFormData({...formData, detail: e.target.value})} disabled={isUploading} />
              </div>

              <hr style={{ margin: '1vw 0' }}/>

              {existingImages.length > 0 && (
                <div className="form-group">
                  <label>Ảnh hiện tại ({existingImages.length} ảnh):</label>
                  <div style={{ display: 'flex', gap: '0.8vw', flexWrap: 'wrap', marginBottom: '0.8vw' }}>
                    {existingImages.map(img => (
                      <div key={img.id} style={{ position: 'relative' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteSingleImage(img)}
                          disabled={isDeletingImage}
                          title="Xóa ảnh này"
                          style={{
                            position: 'absolute', top: '-0.3vw', right: '-0.3vw',
                            background: '#dc3545', color: 'white', border: 'none',
                            borderRadius: '50%', width: '1.5vw', height: '1.5vw',
                            cursor: isDeletingImage ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8vw', fontWeight: 'bold'
                          }}
                        ><i className="bi bi-x"></i></button>
                        <img src={img.link} alt="product" style={{ width: '4vw', height: '4vw', objectFit: 'cover', borderRadius: '0.3vw', border: '0.1vw solid #ccc' }} />
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={handleDeleteAllOldImages} disabled={isUploading} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.5vw 1vw', borderRadius: '0.3vw', fontSize: '0.9vw', cursor: 'pointer', alignSelf: 'flex-start' }}>
                    <i className="bi bi-trash" style={{ marginRight: '0.5vw' }}></i> Xóa toàn bộ ảnh cũ
                  </button>
                </div>
              )}

              <div className="form-group">
                <label>Thêm ảnh mới (Chọn file từ máy tính):</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                
                {previewUrls.length > 0 && (
                  <div style={{ marginTop: '0.8vw' }}>
                    <span style={{ fontSize: '0.9vw', color: '#555' }}>Ảnh sẽ được tải lên ({previewUrls.length}):</span>
                    <div style={{ display: 'flex', gap: '0.5vw', flexWrap: 'wrap', marginTop: '0.5vw' }}>
                      {previewUrls.map((url, index) => (
                        <img key={index} src={url} alt="preview" style={{ width: '3.5vw', height: '3.5vw', objectFit: 'cover', borderRadius: '0.3vw', border: '0.2vw dashed #17a2b8' }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1vw', marginTop: '1.5vw' }}>
                <button type="submit" className="btn-save" disabled={isUploading}>
                  {isUploading ? 'Đang tải ảnh lên...' : 'Lưu Sản Phẩm'}
                </button>
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)} disabled={isUploading}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN (CUSTOM CONFIRM) */}
      {confirmDialog.isOpen && (
        <div className="admin-modal" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '30vw', textAlign: 'center' }}>
            <h3 style={{ color: '#dc3545', marginBottom: '1vw' }}>Xác nhận</h3>
            <p style={{ marginBottom: '1.5vw', fontSize: '1.1vw', color: '#333' }}>{confirmDialog.message}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1vw' }}>
              <button
                className="btn-delete"
                style={{ padding: '0.6vw 1.5vw' }}
                onClick={() => {
                  if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                  closeConfirm();
                }}
              >
                Đồng ý
              </button>
              <button
                className="btn-cancel"
                style={{ padding: '0.6vw 1.5vw', backgroundColor: '#6c757d' }}
                onClick={closeConfirm}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÔNG BÁO (CUSTOM ALERT) */}
      {alertDialog.isOpen && (
        <div className="admin-modal" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '30vw', textAlign: 'center' }}>
            <h3 style={{ color: '#17a2b8', marginBottom: '1vw' }}>Thông báo</h3>
            <p style={{ marginBottom: '1.5vw', fontSize: '1.1vw', color: '#333' }}>{alertDialog.message}</p>
            <button
              className="btn-save"
              style={{ padding: '0.6vw 2vw' }}
              onClick={() => setAlertDialog({ isOpen: false, message: '' })}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;