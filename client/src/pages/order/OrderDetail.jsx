import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faBox, faMapMarkerAlt, faCreditCard, faTruck } from '@fortawesome/free-solid-svg-icons';
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/cartContext";

const OrderDetail = () => {
    const { orderId } = useParams();
    const { user } = useUser();
    const { cartItems } = useCart(); // Trong thực tế, đây sẽ là dữ liệu gọi từ API theo orderId

    // Tính toán số liệu (Dùng logic giống trang Checkout của Toàn)
    const tamTinh = cartItems.reduce((total, item) => total + (item.gia_ban * item.so_luong), 0);
    const phiVanChuyen = tamTinh > 500000 ? 0 : 30000;
    const tongTien = tamTinh + phiVanChuyen;

    return (
        <div className="min-h-screen bg-background py-10 px-4 font-body">
            <div className="max-w-5xl mx-auto">
                {/* Breadcrumb & Quay lại */}
                <Link to="/order-history" className="flex items-center gap-2 text-sm text-text-secondary mb-6 hover:text-brand-primary transition-colors">
                    <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
                    <span>Quay lại lịch sử đơn hàng</span>
                </Link>

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-text-primary">Chi tiết đơn hàng</h1>
                        <p className="text-text-secondary">Mã đơn hàng: <span className="font-bold text-brand-primary">#{orderId || 'LUMI-12345'}</span></p>
                    </div>
                    <div className="text-right">
                        <span className="bg-state-success/10 text-state-success px-4 py-1 rounded-full text-sm font-bold border border-state-success/20">
                            Đang xử lý
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-surface p-6 rounded-2xl shadow-card border border-border-light">
                            <h2 className="font-heading text-lg text-text-primary mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faBox} className="text-brand-primary" />
                                Sản phẩm đã đặt
                            </h2>
                            <div className="divide-y divide-border-light">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="py-4 flex items-center gap-4">
                                        <img src={item.hinh_anh} alt={item.ten_sach} className="w-16 h-20 object-cover rounded shadow-sm" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-text-primary">{item.ten_sach}</h3>
                                            <p className="text-sm text-text-secondary">Số lượng: {item.so_luong}</p>
                                        </div>
                                        <div className="text-right font-bold text-text-primary">
                                            {(item.gia_ban * item.so_luong).toLocaleString()} đ
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* TIẾN TRÌNH ĐƠN HÀNG */}
                        <section className="bg-surface p-6 rounded-2xl shadow-card border border-border-light">
                            <h2 className="font-heading text-lg text-text-primary mb-6 flex items-center gap-2">
                                <FontAwesomeIcon icon={faTruck} className="text-brand-primary" />
                                Trạng thái vận chuyển
                            </h2>
                            <div className="relative flex justify-between">
                                <div className="flex flex-col items-center z-10">
                                    <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/30">1</div>
                                    <p className="text-xs mt-2 font-bold text-brand-primary">Đã đặt</p>
                                </div>
                                <div className="flex flex-col items-center z-10">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">2</div>
                                    <p className="text-xs mt-2 text-gray-400">Đang giao</p>
                                </div>
                                <div className="flex flex-col items-center z-10">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">3</div>
                                    <p className="text-xs mt-2 text-gray-400">Hoàn thành</p>
                                </div>
                                {/* Đường kẻ nối */}
                                <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-100 -z-0"></div>
                            </div>
                        </section>
                    </div>

                    {/* CỘT PHẢI: THÔNG TIN NHẬN HÀNG & THANH TOÁN */}
                    <div className="space-y-6">
                        <section className="bg-surface p-6 rounded-2xl shadow-card border border-border-light">
                            <div className="mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-brand-primary" />
                                    Người nhận
                                </h3>
                                <p className="font-bold text-text-primary">{user?.ho_ten || 'Khách hàng'}</p>
                                <p className="text-sm text-text-secondary">{user?.so_dien_thoai || 'Chưa có SĐT'}</p>
                                <p className="text-sm text-text-secondary mt-2 italic">Số 1 Trịnh Văn Bô, Nam Từ Liêm, Hà Nội</p>
                            </div>

                            <div className="pt-6 border-t border-border-light">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCreditCard} className="text-brand-primary" />
                                    Thanh toán
                                </h3>
                                <p className="text-sm font-medium text-text-primary capitalize">
                                    {/* Hiển thị loại thanh toán */}
                                    COD (Thanh toán khi nhận hàng)
                                </p>
                            </div>
                        </section>

                        <section className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/10">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-text-secondary">
                                    <span>Tạm tính:</span>
                                    <span>{tamTinh.toLocaleString()} đ</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Phí giao hàng:</span>
                                    <span>{phiVanChuyen === 0 ? "Miễn phí" : `${phiVanChuyen.toLocaleString()} đ`}</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-brand-primary/20 text-xl font-black text-brand-primary">
                                    <span>Tổng cộng:</span>
                                    <span>{tongTien.toLocaleString()} đ</span>
                                </div>
                            </div>
                        </section>

                        <button className="w-full py-4 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-bold hover:bg-brand-primary hover:text-white transition-all active:scale-95 shadow-sm">
                            Hủy đơn hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;