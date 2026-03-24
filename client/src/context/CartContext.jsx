import React, { createContext, useState, useContext, useEffect } from 'react';
import cartService from '../services/cartServices';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        // 1. Kiểm tra token trước   khi gọi để tránh gọi thừa
        const token = localStorage.getItem('lumi_token'); 
        if (!token) {
            setCartItems([]);
            return;
        }
    
        try {
            const res = await cartService.getCart();
            // console.log("Check dữ liệu giỏ hàng:", res);
    
            if (res && res.success) {
                setCartItems(res.data || []); 
            }
        } catch (error) {
            // console.error("Lỗi fetch giỏ hàng:", error);
            if (error.response?.status === 401) {
                setCartItems([]);
            }
        }
    };

    const addToCart = async (sach_id, so_luong) => {
        try {
            const res = await cartService.addToCart({ 
                sach_id: sach_id, 
                so_luong: so_luong 
            });
            
            if (res.success) {
                toast.success("Đã thêm vào giỏ hàng");
                await fetchCart();
            }
        } catch (error) {
            console.error("Lỗi chi tiết:", error.response?.data); 
            toast.error(error.response?.data?.message || "Lỗi khi thêm");
        }
    };

    const updateQuantity = async (id, so_luong) => {
        if (so_luong < 1) return;
        try {
            const res = await cartService.updateCart(id, so_luong);
            if (res.success) {
                await fetchCart();
            }
        } catch (error) {
            toast.error("Lỗi cập nhật số lượng");
        }
    };

    const removeItem = async (id) => {
        try {
            const res = await cartService.removeFromCart(id);
            if (res.success) {
                toast.success("Đã xóa khỏi giỏ hàng");
                await fetchCart();
            }
        } catch (error) {
            toast.error("Lỗi khi xóa");
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);