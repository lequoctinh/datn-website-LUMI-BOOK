import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'; 

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    
    const [status, setStatus] = useState('loading'); 
    const [message, setMessage] = useState('Đang xác thực tài khoản...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Link không hợp lệ!');
            toast.error('❌ Link xác thực không hợp lệ!');
            return;
        }

        const verify = async () => {
            try {
                await axiosClient.post('/auth/verify-email', { token });
                setStatus('success');
                setMessage('Xác thực thành công! Đang chuyển hướng đăng nhập...');
                toast.success('🎉 Xác thực thành công! Bạn có thể đăng nhập ngay.');
                
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setStatus('error');
                const errMsg = error.response?.data?.message || 'Xác thực thất bại! Link có thể đã hết hạn.';
                setMessage(errMsg);
                toast.error(`❌ ${errMsg}`);
            }
        };

        verify();
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                {status === 'loading' && (
                    <>
                        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-brand-primary mb-4" />
                        <h2 className="text-xl font-bold text-gray-800">Đang xử lý...</h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <FontAwesomeIcon icon={faCheckCircle} className="text-5xl text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Thành Công!</h2>
                        <p className="text-gray-600">{message}</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <FontAwesomeIcon icon={faTimesCircle} className="text-5xl text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Thất Bại</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-dark transition-colors"
                        >
                            Về trang đăng nhập
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;