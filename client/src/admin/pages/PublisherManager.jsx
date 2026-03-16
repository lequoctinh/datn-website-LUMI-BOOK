import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import publisherService from '../../services/publisherService';

const PublisherManager = () => {
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        ten_nha_xuat_ban: ''
    });
    useEffect(() => {
        fetchPublishers();
    }, []);
    const fetchPublishers = async () => {
        setLoading(true);
        try {
            const res = await publisherService.getAll();
            if (res.success) {
                setPublishers(res.data);
            }
        } catch (error) {
            toast.error('Lỗi khi tải danh sách nhà xuất bản');
        } finally {
            setLoading(false);
        }
    };
    const openModal = (publisher = null) => {
        if (publisher) {
            setEditId(publisher.id);
            setFormData({
                ten_nha_xuat_ban: publisher.ten_nha_xuat_ban
            });
        } else {
            setEditId(null);
            setFormData({
                ten_nha_xuat_ban: ''
            });
        }
        setShowModal(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                const res = await publisherService.update(editId, formData);
                if (res.success) toast.success('Cập nhật thành công');
            } else {
                const res = await publisherService.create(formData);
                if (res.success) toast.success('Thêm nhà xuất bản thành công');
            }
            setShowModal(false);
            fetchPublishers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhà xuất bản này?')) {
            try {
                const res = await publisherService.delete(id);
                if (res.success) {
                    toast.success('Xóa nhà xuất bản thành công');
                    fetchPublishers();
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Không thể xóa vì nhà xuất bản đang có sách trong hệ thống');
            }
        }
    };
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[calc(100vh-100px)] animate-fade-in-down">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-heading font-bold text-gray-800">Quản Lý Nhà Xuất Bản</h2>
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
                            <th className="p-4 font-bold">Tên nhà xuất bản</th>
                            <th className="p-4 font-bold text-right rounded-tr-lg w-32">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {loading ? (
                            <tr><td colSpan="3" className="text-center py-10">Đang tải dữ liệu...</td></tr>
                        ) : publishers.length === 0 ? (
                            <tr><td colSpan="3" className="text-center py-10">Chưa có nhà xuất bản nào</td></tr>
                        ) : (
                            publishers.map((pub) => (
                                <tr key={pub.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-medium text-gray-500">#{pub.id}</td>
                                    <td className="p-4 font-bold text-gray-800">{pub.ten_nha_xuat_ban}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => openModal(pub)}
                                                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(pub.id)}
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
                            <h3 className="text-lg font-bold text-gray-800">{editId ? 'Cập Nhật NXB' : 'Thêm NXB Mới'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="p-6">
                            <form id="publisherForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tên nhà xuất bản <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.ten_nha_xuat_ban} 
                                        onChange={e => setFormData({...formData, ten_nha_xuat_ban: e.target.value})}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                        placeholder="VD: NXB Trẻ"
                                    />
                                </div>
                            </form>
                        </div> 
                        <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
                                Hủy
                            </button>
                            <button type="submit" form="publisherForm" className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-colors flex items-center gap-2 shadow-lg shadow-brand-primary/30">
                                <FontAwesomeIcon icon={faSave} /> {editId ? 'Lưu Thay Đổi' : 'Thêm Mới'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default PublisherManager;