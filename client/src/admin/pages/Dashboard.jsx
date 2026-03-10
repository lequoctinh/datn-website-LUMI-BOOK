import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUsers, faShoppingCart, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const stats = [
        { title: 'Tổng Doanh Thu', value: '24.500.000đ', icon: faMoneyBillWave, color: 'text-green-500', bg: 'bg-green-100' },
        { title: 'Đơn Hàng Mới', value: '156', icon: faShoppingCart, color: 'text-blue-500', bg: 'bg-blue-100' },
        { title: 'Sản Phẩm', value: '1,240', icon: faBook, color: 'text-brand-primary', bg: 'bg-brand-primary/20' },
        { title: 'Khách Hàng', value: '890', icon: faUsers, color: 'text-purple-500', bg: 'bg-purple-100' },
    ];

    return (
        <div className="animate-fade-in-down">
            <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6">Tổng Quan Hệ Thống</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-black text-gray-800">{stat.value}</h3>
                        </div>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${stat.bg} ${stat.color}`}>
                            <FontAwesomeIcon icon={stat.icon} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Đơn hàng gần đây</h3>
                <div className="text-center py-10 text-gray-400">
                    Bảng thống kê đơn hàng sẽ được hiển thị tại đây
                </div>
            </div>
        </div>
    );
};

export default Dashboard;