import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
faTrashCan, 
faPlus, 
faMinus, 
faArrowLeft, 
faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/cartContext';

const Cart = () => {
const navigate = useNavigate();
    const { cartItems, updateQuantity, removeItem } = useCart();

    const subtotal = cartItems.reduce((acc, item) => acc + (item.gia_ban * item.so_luong), 0);
    const shipping = 0;

    const handleUpdateQuantity = async (id, currentQty, delta, stock) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    if (newQty > stock) return; 
    await updateQuantity(id, newQty);
};

    return (
    <div className="min-h-screen bg-gray-50 font-body py-12 px-4 sm:px-6 lg:px-8 text-gray-900">
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                    <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                </div>
                <h1 className="font-heading text-4xl font-black tracking-tight">
                    Giỏ hàng <span className="text-brand-primary">({cartItems.length})</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-md">
                                <div className="group relative w-28 h-40 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                    <img 
                                        src={item.hinh_anh ? `http://localhost:5000/uploads/products/${item.hinh_anh}` : 'https://via.placeholder.com/300x400'} 
                                        alt={item.ten_sach} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-heading text-xl font-bold mb-1 line-clamp-2">{item.ten_sach}</h3>
                                        <p className="text-gray-500 text-sm mb-3">Đơn giá: <span className="font-bold text-gray-800">{Number(item.gia_ban).toLocaleString('vi-VN')} đ</span></p>
                                        <button 
                                            onClick={() => removeItem(item.id)} 
                                            className="text-red-400 hover:text-red-600 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors mx-auto sm:mx-0"
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} /> Loại bỏ
                                        </button>
                                    </div>

                                    <div className="flex flex-col items-center sm:items-end gap-4 min-w-[140px]">
                                        <div className="flex items-center border-2 border-gray-100 rounded-xl bg-gray-50 p-1">
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, item.so_luong, -1, item.kho_con)} 
                                                className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-brand-primary rounded-lg transition-all"
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                            <span className="px-4 font-black text-gray-800">{item.so_luong}</span>
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, item.so_luong, 1, item.kho_con)} 
                                                className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-brand-primary rounded-lg transition-all"
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        </div>
                                        <p className="text-brand-primary font-black text-lg">
                                            {(item.gia_ban * item.so_luong).toLocaleString('vi-VN')} đ
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                    <FontAwesomeIcon icon={faShoppingCart} size="2x" />
                                </div>
                                <p className="text-gray-500 mb-8 font-medium italic">Giỏ hàng đang trống rỗng như một cuốn sách chưa viết...</p>
                                <Link to="/" className="inline-flex items-center gap-3 bg-brand-primary text-white px-8 py-3 rounded-xl hover:bg-brand-dark transition-all font-bold shadow-lg shadow-brand-primary/20">
                                    <FontAwesomeIcon icon={faArrowLeft} /> Tiếp tục mua sắm
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
                            <h2 className="font-heading text-2xl font-black mb-6 text-gray-800 border-b border-gray-50 pb-4">Tóm tắt đơn hàng</h2>
                            <div className="space-y-5">
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Tạm tính</span>
                                    <span className="text-gray-900 font-bold">{subtotal.toLocaleString('vi-VN')} đ</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Phí vận chuyển</span>
                                    <span className="text-green-600 font-bold uppercase text-xs">Miễn phí toàn quốc</span>
                                </div>
                                <div className="pt-5 border-t border-gray-100 flex justify-between items-end">
                                    <span className="font-bold text-gray-800">Tổng cộng</span>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-red-600">{(subtotal + shipping).toLocaleString('vi-VN')} đ</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">(Đã bao gồm VAT)</p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/checkout')}
                                disabled={cartItems.length === 0}
                                className={`w-full mt-10 font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 tracking-widest uppercase ${
                                    cartItems.length > 0 
                                    ? 'bg-brand-primary hover:bg-brand-dark text-white shadow-brand-primary/30 active:scale-95' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                }`}
                            >
                                Thanh toán ngay
                            </button>

                            <div className="mt-6 flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-xs text-gray-400 font-medium justify-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Giao hàng nhanh từ 2-4 ngày
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;