import React, { useState, useEffect } from 'react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', quantity: 0, detail: '', categoryid: '', price: 0 });
    const API_URL = 'https://gundamstorehobby.onrender.com';

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        const res = await fetch(`${API_URL}/product/getAllProducts`);
        const data = await res.json();
        setProducts(data);
    };

    const fetchCategories = async () => {
        const res = await fetch(`${API_URL}/category/all`);
        const data = await res.json();
        setCategories(data);
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({ id: null, name: '', quantity: 0, detail: '', categoryid: categories[0]?.id || '', price: 0 });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = formData.id ? `${API_URL}/product/updateProduct` : `${API_URL}/product/insertProduct`;
        const method = formData.id ? 'PATCH' : 'POST';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        setIsModalOpen(false);
        fetchProducts();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            await fetch(`${API_URL}/product/deleteProduct/${id}`, { method: 'DELETE' });
            fetchProducts();
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
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.price.toLocaleString()} đ</td>
                            <td>{p.quantity}</td>
                            <td>
                                <button className="btn-edit" onClick={() => handleOpenModal(p)}>Sửa</button>
                                <button className="btn-delete" onClick={() => handleDelete(p.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="admin-modal">
                    <div className="modal-content">
                        <h3>{formData.id ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Tên sản phẩm:</label>
                                <input
                                    type="text"
                                    placeholder="VD: PGU 1/60 RX-78-2 Gundam"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Giá (VNĐ):</label>
                                <input
                                    type="number"
                                    placeholder="Nhập giá tiền"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Số lượng:</label>
                                <input
                                    type="number"
                                    placeholder="Nhập số lượng trong kho"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Danh mục:</label>
                                <select
                                    value={formData.categoryid}
                                    onChange={e => setFormData({ ...formData, categoryid: e.target.value })}
                                    required
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Chi tiết sản phẩm:</label>
                                <textarea
                                    rows="4"
                                    placeholder="Nhập mô tả chi tiết sản phẩm..."
                                    value={formData.detail}
                                    onChange={e => setFormData({ ...formData, detail: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="btn-save">Lưu</button>
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