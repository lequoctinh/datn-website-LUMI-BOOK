import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faArrowLeft, 
  faBoxOpen, 
  faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || { orderId: '8888' };

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    const handlePopState = () => {
      navigate('/', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-12 shadow-sm">
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Đặt hàng thành công!
            </h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã tin tưởng chọn <span className="font-semibold text-blue-600">Lumi Book</span>. 
              Đơn hàng của bạn đang được hệ thống xử lý.
            </p>
          </div>

          <div className="bg-gray-50 rounded-md p-6 mb-8 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Thông tin đơn hàng
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-gray-900">#LUMI-{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                  Đang chờ xử lý
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Thời gian đặt:</span>
                <span className="text-gray-900 text-sm">{new Date().toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/my-orders', { state: { highlightOrderId: orderId } })}
              className="flex-1 bg-gray-900 text-white font-medium py-3 px-6 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faBoxOpen} size="sm" />
              Theo dõi đơn hàng
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-white text-gray-700 font-medium py-3 px-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} size="sm" />
              Tiếp tục mua sắm
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-sm text-gray-500">
          <Link to="/support" className="hover:underline flex items-center gap-1">
            <FontAwesomeIcon icon={faQuestionCircle} />
            Bạn cần hỗ trợ?
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/policy" className="hover:underline">Chính sách hoàn trả</Link>
        </div>

        <p className="mt-12 text-center text-gray-400 text-xs">
          © 2026 Lumi Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;