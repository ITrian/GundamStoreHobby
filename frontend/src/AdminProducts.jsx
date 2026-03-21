import React, { useState, useEffect } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // STATE MỚI: Chứa toàn bộ ảnh trong hệ thống để đếm số lượng
  const [allImages, setAllImages] = useState([]); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', quantity: 0, detail: '', categoryid: '', price: 0 });
  const [imageLinks, setImageLinks] = useState(['']); 
  const [existingImages, setExistingImages] = useState([]); 

  const API_URL = 'https://gundamstorehobby.onrender.com';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchAllImages(); // Gọi thêm API lấy toàn bộ ảnh
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

  // Hàm mới lấy toàn bộ ảnh
  const fetchAllImages = async () => {
    try {
      const res = await fetch(`${API_URL}/image/getAllImages`);
      const data = await res.json();
      setAllImages(data);
    } catch (e) { console.error(e); }
  };

  const handleOpenModal = async (product = null) => {
    setImageLinks(['']); 
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

  const handleAddLinkInput = () => {
    setImageLinks([...imageLinks, '']);
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...imageLinks];
    newLinks[index] = value;
    setImageLinks(newLinks);
  };

  const handleDeleteAllOldImages = async () => {
    if (window.confirm("Bạn có chắc muốn xóa TOÀN BỘ ảnh cũ của sản phẩm này không?")) {
      try {
        await fetch(`${API_URL}/image/deleteImage/${formData.id}`, { method: 'DELETE' });
        setExistingImages([]); 
        fetchAllImages(); // Cập nhật lại số lượng ở bảng ngoài
        alert("Đã xóa toàn bộ ảnh cũ!");
      } catch (e) { console.error(e); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productUrl = formData.id ? `${API_URL}/product/updateProduct` : `${API_URL}/product/insertProduct`;
    const productMethod = formData.id ? 'PATCH' : 'POST';

    try {
      const res = await fetch(productUrl, {
        method: productMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const savedProduct = await res.json();
      
      const productId = formData.id || savedProduct.id; 
      const validLinks = imageLinks.filter(link => link.trim() !== '');
      
      for (let link of validLinks) {
        await fetch(`${API_URL}/image/insertImage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productid: productId,
            detail: formData.name, 
            link: link
          })
        });
      }

      setIsModalOpen(false);
      fetchProducts(); 
      fetchAllImages(); // Tải lại bảng ảnh để đếm lại số lượng
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      alert("Đã xảy ra lỗi khi lưu sản phẩm!");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này? (Các ảnh liên quan cũng sẽ bị xóa)')) {
      await fetch(`${API_URL}/image/deleteImage/${id}`, { method: 'DELETE' });
      await fetch(`${API_URL}/product/deleteProduct/${id}`, { method: 'DELETE' });
      fetchProducts();
      fetchAllImages(); // Cập nhật lại số lượng
    }
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
            <th>Danh mục</th>  {/* CỘT MỚI */}
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Hình ảnh</th> {/* CỘT MỚI */}
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => {
            // Lọc tên danh mục từ mảng categories
            const categoryName = categories.find(c => String(c.id) === String(p.categoryid))?.name || 'Không xác định';
            
            // Đếm số lượng ảnh của sản phẩm này từ mảng allImages
            const imageCount = allImages.filter(img => String(img.productid) === String(p.id)).length;

            return (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td><span style={{ fontWeight: 'bold', color: '#1a73e8' }}>{categoryName}</span></td>
                <td>{p.price.toLocaleString()} đ</td>
                <td>{p.quantity}</td>
                <td>{imageCount} ảnh</td>
                <td>
                  <button className="btn-edit" onClick={() => handleOpenModal(p)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDeleteProduct(p.id)}>Xóa</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* MODAL THÊM / SỬA (Giữ nguyên như bản cũ) */}
      {isModalOpen && (
        <div className="admin-modal">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>{formData.id ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}</h3>
            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label>Tên sản phẩm:</label>
                <input type="text" placeholder="VD: PGU 1/60 RX-78-2 Gundam" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>

              <div className="form-group">
                <label>Giá (VNĐ):</label>
                <input type="number" placeholder="Nhập giá tiền" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
              </div>

              <div className="form-group">
                <label>Số lượng:</label>
                <input type="number" placeholder="Nhập số lượng trong kho" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
              </div>

              <div className="form-group">
                <label>Danh mục:</label>
                <select value={formData.categoryid} onChange={e => setFormData({...formData, categoryid: e.target.value})} required>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Chi tiết sản phẩm:</label>
                <textarea rows="3" placeholder="Nhập mô tả chi tiết sản phẩm..." value={formData.detail} onChange={e => setFormData({...formData, detail: e.target.value})} />
              </div>

              <hr style={{ margin: '15px 0' }}/>

              {/* KHU VỰC QUẢN LÝ ẢNH CŨ */}
              {existingImages.length > 0 && (
                <div className="form-group">
                  <label>Ảnh hiện tại ({existingImages.length} ảnh):</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {existingImages.map(img => (
                      <img key={img.id} src={img.link} alt="product" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
                    ))}
                  </div>
                  <button type="button" onClick={handleDeleteAllOldImages} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    🗑 Xóa toàn bộ ảnh cũ
                  </button>
                </div>
              )}

              {/* KHU VỰC THÊM LINK ẢNH MỚI */}
              <div className="form-group">
                <label>Thêm ảnh mới (Dán link URL):</label>
                {imageLinks.map((link, index) => (
                  <input 
                    key={index}
                    type="text" 
                    placeholder="Dán link ảnh vào đây (Imgur, Facebook, Drive...)" 
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    style={{ marginBottom: '8px' }}
                  />
                ))}
                <button type="button" onClick={handleAddLinkInput} style={{ background: '#17a2b8', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                  + Thêm ô nhập link
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn-save">Lưu Sản Phẩm</button>
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;