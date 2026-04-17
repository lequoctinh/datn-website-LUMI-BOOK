import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import categoryService from '../../services/categoryService';

const CategoryManager = () => {
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(false);
const [showModal, setShowModal] = useState(false);
const [editId, setEditId] = useState(null);
const [formData, setFormData] = useState({
    ten_danh_muc: '',
    mo_ta: ''
});
useEffect(() => {
    fetchCategories();
}, []);
const fetchCategories = async () => {
    setLoading(true);
    try {
        const res = await categoryService.getAll();
        if (res.success) {
            setCategories(res.data);
        }
    } catch (error) {
        toast.error('Lỗi khi tải danh sách danh mục');
    } finally {
        setLoading(false);
    }
};
const openModal = (category = null) => {
    if (category) {
        setEditId(category.id);
        setFormData({
            ten_danh_muc: category.ten_danh_muc,
            mo_ta: category.mo_ta || ''
        });
    } else {
        setEditId(null);
        setFormData({
            ten_danh_muc: '',
            mo_ta: ''
        });
    }
    setShowModal(true);
};
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (editId) {
            const res = await categoryService.update(editId, formData);
            if (res.success) toast.success('Cập nhật thành công');
        } else {
            const res = await categoryService.create(formData);
            if (res.success) toast.success('Thêm danh mục thành công');
        }
        setShowModal(false);
        fetchCategories();
    } catch (error) {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
};
const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
        try {
            const res = await categoryService.delete(id);
            if (res.success) {
                toast.success('Xóa danh mục thành công');
                fetchCategories();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể xóa vì danh mục đang chứa sách');
        }
    }
};
return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[calc(100vh-100px)] animate-fade-in-down">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-bold text-gray-800">Quản Lý Danh Mục</h2>
            <button 
                onClick={() => openModal()}
                className="bg-brand-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/30"
            >
                <FontAwesomeIcon icon={faPlus} /> Thêm Mới
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                        <th className="p-4 font-bold rounded-tl-lg w-20">ID</th>
                        <th className="p-4 font-bold w-1/3">Tên danh mục</th>
                        <th className="p-4 font-bold">Mô tả</th>
                        <th className="p-4 font-bold text-right rounded-tr-lg w-32">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                    {loading ? (
                        <tr><td colSpan="4" className="text-center py-10">Đang tải dữ liệu...</td></tr>
                    ) : categories.length === 0 ? (
                        <tr><td colSpan="4" className="text-center py-10">Chưa có danh mục nào</td></tr>
                    ) : (
                        categories.map((cat) => (
                            <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 font-medium text-gray-500">#{cat.id}</td>
                                <td className="p-4 font-bold text-gray-800">{cat.ten_danh_muc}</td>
                                <td className="p-4 text-gray-500">{cat.mo_ta || <span className="italic text-gray-300">Không có mô tả</span>}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => openModal(cat)}
                                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(cat.id)}
                                            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        {showModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl animate-slide-down">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                        <h3 className="text-lg font-bold text-gray-800">{editId ? 'Cập Nhật Danh Mục' : 'Thêm Danh Mục Mới'}</h3>
                        <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    
                    <div className="p-6">
                        <form id="categoryForm" onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tên danh mục <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.ten_danh_muc} 
                                    onChange={e => setFormData({...formData, ten_danh_muc: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                    placeholder="VD: Sách Văn Học"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả</label>
                                <textarea 
                                    rows="4"
                                    value={formData.mo_ta} 
                                    onChange={e => setFormData({...formData, mo_ta: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none"
                                    placeholder="Nhập mô tả ngắn về danh mục..."
                                ></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
                        <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
                            Hủy
                        </button>
                        <button type="submit" form="categoryForm" className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-colors flex items-center gap-2 shadow-lg shadow-brand-primary/30">
                            <FontAwesomeIcon icon={faSave} /> {editId ? 'Lưu Thay Đổi' : 'Thêm Mới'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};
export default CategoryManager;