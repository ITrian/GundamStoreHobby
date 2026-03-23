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

  // --- HÀM TIỆN ÍCH GỌI POPUP ---
  const showAlert = (message) => setAlertDialog({ isOpen: true, message });
  
  const showConfirm = (message, onConfirmCallback) => {
    setConfirmDialog({ isOpen: true, message, onConfirm: onConfirmCallback });
  };
  
  const closeConfirm = () => setConfirmDialog({ isOpen: false, message: '', onConfirm: null });

  // --- MỞ POPUP ẢNH ---
  const handleViewImages = (product) => {
    const productImages = allImages.filter(img => String(img.productid) === String(product.id));
    setViewingImages(productImages);
    setViewingProductName(product.name);
    setIsImageViewModalOpen(true);
  };

  // --- HÀM XÓA 1 ẢNH (Truyền thẳng detail vào link) ---
  const handleDeleteSingleImage = (imageToDelete) => {
    showConfirm("Bạn có chắc muốn xóa ảnh này khỏi sản phẩm?", async () => {
      setIsDeletingImage(true);

      try {
        // Truyền trực tiếp imageToDelete.detail vào URL vì detail là "4-1.jpg"
        const res = await fetch(`${API_URL}/image/deleteSingleImage/${imageToDelete.productid}/${imageToDelete.detail}`, { 
          method: 'DELETE' 
        });

        if (!res.ok) {
          showAlert("Lỗi từ server: Không thể xóa ảnh này!");
          setIsDeletingImage(false);
          return; 
        }

        // Cập nhật giao diện sau khi xóa thành công
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
      <button className="btn-add" onClick={() => handleOpenModal()}>+ Thêm Sản phẩm</button>
      
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
          {products.map(p => {
            const categoryName = categories.find(c => String(c.id) === String(p.categoryid))?.name || 'Không xác định';
            const imageCount = allImages.filter(img => String(img.productid) === String(p.id)).length;

            return (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td><span style={{ fontWeight: 'bold', color: '#1a73e8' }}>{categoryName}</span></td>
                <td>{p.price.toLocaleString()} đ</td>
                <td>{p.quantity}</td>
                <td>
                  <span 
                    onClick={() => handleViewImages(p)}
                    style={{ color: '#17a2b8', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
                    title="Click để xem & xóa hình ảnh"
                  >
                    {imageCount} ảnh
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleOpenModal(p)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDeleteProduct(p.id)}>Xóa</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* =======================================================
          POPUP XEM & XÓA HÌNH ẢNH 
          ======================================================= */}
      {isImageViewModalOpen && (
        <div className="admin-modal">
          <div className="modal-content" style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Hình ảnh: {viewingProductName}</h3>
              <button 
                onClick={() => setIsImageViewModalOpen(false)} 
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            {viewingImages.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Sản phẩm này chưa có hình ảnh nào.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                {viewingImages.map(img => (
                  <div key={img.id} style={{ position: 'relative', border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center', background: '#fdfdfd' }}>
                    <button
                      onClick={() => handleDeleteSingleImage(img)}
                      disabled={isDeletingImage}
                      title="Xóa ảnh này"
                      style={{
                        position: 'absolute', top: '-8px', right: '-8px',
                        background: '#dc3545', color: 'white', border: 'none',
                        borderRadius: '50%', width: '28px', height: '28px',
                        cursor: isDeletingImage ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        opacity: isDeletingImage ? 0.5 : 1
                      }}
                    >✕</button>
                    <img src={img.link} alt={img.detail} style={{ width: '100%', height: '150px', objectFit: 'contain', borderRadius: '4px', marginBottom: '8px' }} />
                    <p style={{ margin: 0, fontSize: '12px', color: '#333', wordWrap: 'break-word', fontWeight: 'bold' }}>
                      {img.detail || 'Không có tên'}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ textAlign: 'right', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <button className="btn-cancel" onClick={() => setIsImageViewModalOpen(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL THÊM / SỬA SẢN PHẨM CHÍNH
          ======================================================= */}
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

              <hr style={{ margin: '15px 0' }}/>

              {/* KHU VỰC ẢNH CŨ TRONG MODAL EDIT */}
              {existingImages.length > 0 && (
                <div className="form-group">
                  <label>Ảnh hiện tại ({existingImages.length} ảnh):</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {existingImages.map(img => (
                      <div key={img.id} style={{ position: 'relative' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteSingleImage(img)}
                          disabled={isDeletingImage}
                          title="Xóa ảnh này"
                          style={{
                            position: 'absolute', top: '-5px', right: '-5px',
                            background: '#dc3545', color: 'white', border: 'none',
                            borderRadius: '50%', width: '20px', height: '20px',
                            cursor: isDeletingImage ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', fontWeight: 'bold'
                          }}
                        >✕</button>
                        <img src={img.link} alt="product" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={handleDeleteAllOldImages} disabled={isUploading} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    🗑 Xóa toàn bộ ảnh cũ
                  </button>
                </div>
              )}

              {/* KHU VỰC CHỌN FILE TỪ MÁY TÍNH */}
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
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#555' }}>Ảnh sẽ được tải lên ({previewUrls.length}):</span>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
                      {previewUrls.map((url, index) => (
                        <img key={index} src={url} alt="preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '2px dashed #17a2b8' }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn-save" disabled={isUploading}>
                  {isUploading ? 'Đang tải ảnh lên...' : 'Lưu Sản Phẩm'}
                </button>
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)} disabled={isUploading}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL XÁC NHẬN (CUSTOM CONFIRM)
          ======================================================= */}
      {confirmDialog.isOpen && (
        <div className="admin-modal" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h3 style={{ color: '#dc3545', marginBottom: '15px' }}>Xác nhận</h3>
            <p style={{ marginBottom: '25px', fontSize: '16px', color: '#333' }}>{confirmDialog.message}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button
                className="btn-delete"
                style={{ padding: '8px 25px' }}
                onClick={() => {
                  if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                  closeConfirm();
                }}
              >
                Đồng ý
              </button>
              <button
                className="btn-cancel"
                style={{ padding: '8px 25px', backgroundColor: '#6c757d' }}
                onClick={closeConfirm}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL THÔNG BÁO (CUSTOM ALERT)
          ======================================================= */}
      {alertDialog.isOpen && (
        <div className="admin-modal" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h3 style={{ color: '#17a2b8', marginBottom: '15px' }}>Thông báo</h3>
            <p style={{ marginBottom: '25px', fontSize: '16px', color: '#333' }}>{alertDialog.message}</p>
            <button
              className="btn-save"
              style={{ padding: '8px 30px' }}
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