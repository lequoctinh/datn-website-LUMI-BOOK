import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

const VnpayReturn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('Đang xác thực giao dịch...');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Lấy toàn bộ query string từ VNPAY trả về
                const params = Object.fromEntries([...searchParams]);
                
                // Gọi API backend để kiểm tra chữ ký và cập nhật DB
                const res = await axiosClient.get('/checkout/vnpay-return', { params });

                if (res.success) {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
                } else {
                    setStatus('error');
                    setMessage(res.message || 'Thanh toán không thành công.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Có lỗi xảy ra khi xác thực giao dịch.');
            }
        };

        verifyPayment();
    }, [searchParams]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center font-body">
            <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 text-center max-w-md w-full">
                {status === 'loading' && (
                    <div className="text-blue-500">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-5xl mb-4" />
                        <p className="text-gray-600 font-bold">{message}</p>
                    </div>
                )}
                {status === 'success' && (
                    <div>
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-5xl mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thành công!</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <button onClick={() => navigate('/my-orders')} className="bg-gray-900 text-white px-6 py-2 rounded font-bold uppercase text-xs tracking-widest">
                            Xem đơn hàng
                        </button>
                    </div>
                )}
                {status === 'error' && (
                    <div>
                        <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 text-5xl mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thất bại</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <button onClick={() => navigate('/checkout')} className="bg-red-600 text-white px-6 py-2 rounded font-bold uppercase text-xs tracking-widest">
                            Thử lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VnpayReturn;