import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBook, faUsers, faShoppingCart, faMoneyBillWave, faFilter, 
    faRefresh, faExclamationTriangle, faFire, faStar, faUndo
} from '@fortawesome/free-solid-svg-icons';
import { 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    ComposedChart, Bar, Line, Area, Cell
} from 'recharts';
import statisticService from '../services/statisticService';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({ startDate: '', endDate: '' });
    const [lowStockBooks, setLowStockBooks] = useState([]);
    const [topSelling, setTopSelling] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [data, setData] = useState({
        overview: { totalRevenue: 0, newOrdersCount: 0, totalUsers: 0, totalBooks: 0 },
        revenueChart: [],
        statusChart: []
    });

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    const formatYAxis = (value) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}tr`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
        return value;
    };

    const fetchData = async (start = filter.startDate, end = filter.endDate) => {
        setLoading(true);
        try {
            const [res, lowStockRes, sellingRes, ratedRes] = await Promise.all([
                statisticService.getDashboardData(start, end),
                statisticService.getLowStockBooks(),
                statisticService.getTopSelling(),
                statisticService.getTopRated()
            ]);

            if (res.success) {
                setData({
                    overview: res.overview,
                    revenueChart: (res.revenueChart || []).map(item => ({ ...item, revenue: Number(item.revenue) || 0 })),
                    statusChart: res.statusChart || []
                });
            }
            if (lowStockRes.success) setLowStockBooks(lowStockRes.data);
            if (sellingRes.success) setTopSelling(sellingRes.data);
            if (ratedRes.success) setTopRated(ratedRes.data);
        } catch (error) {
            console.error("Dashboard Error:", error);
            toast.error("Không thể tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        const resetFilter = { startDate: '', endDate: '' };
        setFilter(resetFilter);
        fetchData('', '');
    };

    useEffect(() => { fetchData(); }, []);

    const STATUS_MAP = {
        'cho_duyet': 'Chờ duyệt',
        'da_duyet': 'Đã duyệt',
        'dang_giao': 'Đang giao',
        'da_giao': 'Đã giao',
        'da_huy': 'Đã hủy'
    };

    const STATUS_COLORS = {
        'cho_duyet': '#3b82f6',
        'da_duyet': '#10b981',
        'dang_giao': '#f59e0b',
        'da_giao': '#8b5cf6',
        'da_huy': '#ef4444'
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Thống Kê Hệ Thống</h2>
                    <p className="text-sm text-gray-500 font-medium">LUMI-BOOK Dashboard</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                    <input 
                        type="date" 
                        className="text-sm border-none bg-gray-50 rounded-lg p-2 outline-none" 
                        value={filter.startDate} 
                        onChange={(e) => setFilter({...filter, startDate: e.target.value})} 
                    />
                    <span className="text-gray-400 font-bold">→</span>
                    <input 
                        type="date" 
                        className="text-sm border-none bg-gray-50 rounded-lg p-2 outline-none" 
                        value={filter.endDate} 
                        onChange={(e) => setFilter({...filter, endDate: e.target.value})} 
                    />
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={() => fetchData()} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                            <FontAwesomeIcon icon={loading ? faRefresh : faFilter} className={loading ? 'animate-spin' : ''} /> 
                            Lọc
                        </button>
                        
                        <button 
                            onClick={handleReset} 
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                            title="Làm mới bộ lọc"
                        >
                            <FontAwesomeIcon icon={faUndo} />
                            Làm mới
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { title: 'Doanh Thu', value: formatCurrency(data.overview.totalRevenue), icon: faMoneyBillWave, color: 'text-green-600', bg: 'bg-green-50' },
                    { title: 'Đơn Mới', value: data.overview.newOrdersCount, icon: faShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { title: 'Sản Phẩm', value: data.overview.totalBooks, icon: faBook, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { title: 'Khách Hàng', value: data.overview.totalUsers, icon: faUsers, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2">{stat.title}</p>
                            <h3 className="text-2xl font-black text-gray-800">{loading ? '...' : stat.value}</h3>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.bg} ${stat.color}`}>
                            <FontAwesomeIcon icon={stat.icon} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
                    <h4 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tight">Biểu đồ doanh thu</h4>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data.revenueChart}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={formatYAxis} />
                                <Tooltip 
                                    formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="none" fill="url(#colorRev)" tooltipType="none" />
                                <Bar dataKey="revenue" fill="#3b82f6" fillOpacity={0.1} barSize={40} radius={[4, 4, 0, 0]} tooltipType="none" />
                                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} name="Doanh thu" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tight">Tình trạng Đơn Hàng</h4>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data.statusChart}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="status" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tickFormatter={(val) => STATUS_MAP[val] || val}
                                    tick={{fontSize: 10, fontWeight: 700}} 
                                />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={30} name="Số lượng">
                                    {data.statusChart.map((entry, index) => (
                                        <Cell key={index} fill={STATUS_COLORS[entry.status] || '#94a3b8'} />
                                    ))}
                                </Bar>
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tight flex items-center gap-2">
                        <FontAwesomeIcon icon={faFire} className="text-orange-500" /> Sản phẩm bán chạy
                    </h4>
                    <div className="space-y-4">
                        {topSelling.map((item, i) => (
                            <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-black text-gray-200 w-6">0{i+1}</span>
                                    <img src={item.hinh_anh} className="w-12 h-16 object-cover rounded-lg shadow-sm" alt="" />
                                    <div>
                                        <p className="font-bold text-gray-700 text-sm line-clamp-1">{item.ten_sach}</p>
                                        <p className="text-xs text-blue-600 font-bold">{item.total_sold} đã bán</p>
                                    </div>
                                </div>
                                <p className="font-black text-gray-800 text-sm">{formatCurrency(item.gia_ban)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tight flex items-center gap-2">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-500" /> Đánh giá cao nhất
                    </h4>
                    <div className="space-y-4">
                        {topRated.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-all">
                                <div className="flex items-center gap-3">
                                    <img src={item.hinh_anh} className="w-12 h-16 object-cover rounded-lg shadow-sm" alt="" />
                                    <div>
                                        <p className="font-bold text-gray-700 text-sm line-clamp-1">{item.ten_sach}</p>
                                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-black">
                                            <span>★ {Number(item.avg_rating).toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Top Rate</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                <h4 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tight flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" /> Sản phẩm sắp hết hàng
                </h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-[10px] uppercase font-black border-b border-gray-50">
                                <th className="pb-4">Sản phẩm</th>
                                <th className="pb-4 text-center">Tồn kho</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockBooks.map((book) => (
                                <tr key={book.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                    <td className="py-4 flex items-center gap-3">
                                        <img src={book.hinh_anh} className="w-10 h-14 object-cover rounded-lg shadow-sm" alt="" />
                                        <span className="font-bold text-gray-700 text-sm">{book.ten_sach}</span>
                                    </td>
                                    <td className="py-4 text-center font-black text-red-500">{book.so_luong_ton}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;