import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import notificationService from '../services/notificationService';

function NotificationBell() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
    try {
        const response = await notificationService.getAll();
        if (response.unreadCount > unreadCount && unreadCount !== 0) {
                toast.info("🔔 Bạn có cập nhật mới về đơn hàng!");
            }
            setNotifications(response.data);
            setUnreadCount(response.unreadCount);
    } catch (error) {
        console.error("Lỗi lấy thông báo:", error);
    }
};

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleMarkAllRead = async () => {
        if (unreadCount === 0) return;

        try {
            await notificationService.markAllAsRead();
            
            setUnreadCount(0);
            
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, trang_thai_doc: 1 }))
            );
        } catch (error) {
            console.error(error);
        }
        };

        const handleItemClick = async (notification) => {
        if (notification.trang_thai_doc === 0) {
            try {
                await notificationService.markAsRead(notification.id);
                
                setUnreadCount((prev) => Math.max(0, prev - 1));
                
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notification.id ? { ...n, trang_thai_doc: 1 } : n
                    )
                );
            } catch (error) {
                console.error(error);
            }
        }

        if (notification.don_hang_id) {
                navigate(`/order-detail/${notification.don_hang_id}`);
            } else {
                navigate('/my-orders');
            }
    };

    return (
        <div className="relative">
            <button 
                onClick={handleToggleDropdown}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
                <FontAwesomeIcon icon={faBell} className="text-xl" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-100 font-bold text-gray-700 flex justify-between items-center">
                        <span>Thông báo</span>
                        <div className="flex gap-3">
                            {unreadCount > 0 && (
                                <button 
                                    onClick={handleMarkAllRead}
                                    className="text-blue-500 text-xs font-normal hover:underline"
                                >
                                    Đọc tất cả
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 text-sm">Đóng</button>
                        </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => handleItemClick(n)}
                                    className={`p-3 cursor-pointer border-b transition-colors ${
                                        n.trang_thai_doc === 0 ? "bg-blue-50 hover:bg-blue-100" : "bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    <h4 className={`text-sm ${n.trang_thai_doc === 0 ? "font-bold" : "font-semibold"}`}>
                                        {n.tieu_de}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1">{n.noi_dung}</p>
                                    <span className="text-[10px] text-gray-400 mt-2 block">
                                        {new Date(n.ngay_tao).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">Không có thông báo nào</div>
                        )}
                    </div>
                    
                    <div className="p-2 border-t border-gray-100 text-center">
                        <button className="text-blue-500 text-xs font-medium hover:underline">
                            Xem tất cả thông báo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;