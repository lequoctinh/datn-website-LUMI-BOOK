import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEye, faEyeSlash, faTrash, faCommentDots, faBook, faUser } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import reviewService from '../services/reviewService';

const ReviewManager = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await reviewService.getAll();
            if (res.success) {
                setReviews(res.data);
            }
        } catch (error) {
            toast.error('Lỗi khi tải danh sách đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (review) => {
        const newStatus = review.trang_thai === 'hien_thi' ? 'an' : 'hien_thi';
        const actionText = newStatus === 'hien_thi' ? 'Hiện' : 'Ẩn';

        try {
            const res = await reviewService.updateStatus(review.id, newStatus);
            if (res.success) {
                toast.success(`${actionText} đánh giá thành công`);
                fetchReviews();
            }
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa vĩnh viễn đánh giá này?')) {
            try {
                const res = await reviewService.delete(id);
                if (res.success) {
                    toast.success('Xóa đánh giá thành công');
                    fetchReviews();
                }
            } catch (error) {
                toast.error('Lỗi khi xóa đánh giá');
            }
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FontAwesomeIcon
                key={index}
                icon={faStar}
                className={index < rating ? 'text-yellow-400' : 'text-gray-200'}
            />
        ));
    };
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[calc(100vh-100px)] animate-fade-in-down">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-heading font-bold text-gray-800 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCommentDots} className="text-brand-primary" />
                    Quản Lý Đánh Giá
                </h2>
                <div className="text-sm text-gray-500 font-medium">
                    Tổng cộng: <span className="text-brand-primary">{reviews.length}</span> đánh giá
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                            <th className="p-4 font-bold rounded-tl-lg">Khách hàng / Sách</th>
                            <th className="p-4 font-bold">Nội dung đánh giá</th>
                            <th className="p-4 font-bold text-center">Sao</th>
                            <th className="p-4 font-bold">Trạng thái</th>
                            <th className="p-4 font-bold">Thời gian</th>
                            <th className="p-4 font-bold text-right rounded-tr-lg">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-10">Đang tải dữ liệu...</td></tr>
                        ) : reviews.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-10">Chưa có đánh giá nào</td></tr>
                        ) : (
                            reviews.map((item) => (
                                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 font-bold text-gray-800">
                                                <FontAwesomeIcon icon={faUser} className="text-[10px] text-gray-400" />
                                                {item.ho_ten}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-brand-primary italic">
                                                <FontAwesomeIcon icon={faBook} className="text-[10px]" />
                                                {item.ten_sach}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 max-w-xs">
                                        <p className="line-clamp-2 text-gray-600 italic">"{item.binh_luan}"</p>
                                    </td>
                                    <td className="p-4 text-center whitespace-nowrap">
                                        <div className="flex justify-center gap-0.5 text-[10px]">
                                            {renderStars(item.so_sao)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            item.trang_thai === 'hien_thi' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {item.trang_thai === 'hien_thi' ? 'Hiển thị' : 'Đã ẩn'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-xs">
                                        {new Date(item.ngay_danh_gia).toLocaleString('vi-VN')}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleToggleStatus(item)}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                                    item.trang_thai === 'hien_thi' 
                                                    ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                                                    : 'bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white'
                                                }`}
                                                title={item.trang_thai === 'hien_thi' ? 'Ẩn đánh giá' : 'Hiện đánh giá'}
                                            >
                                                <FontAwesomeIcon icon={item.trang_thai === 'hien_thi' ? faEyeSlash : faEye} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                                title="Xóa đánh giá"
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
        </div>
    );
};

export default ReviewManager;