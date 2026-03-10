import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPlus, faMinus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  // Dữ liệu mẫu
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Nhà Giả Kim",
      author: "Paulo Coelho",
      price: 79000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 2,
      title: "Đắc Nhân Tâm",
      author: "Dale Carnegie",
      price: 125000,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600"
    }
  ]);

  const updateQuantity = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 30000;

  return (
    <div className="min-h-screen bg-background font-body py-12 px-4 sm:px-6 lg:px-8 text-text-primary">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-heading text-4xl mb-8 border-b border-border-default pb-4">
          Giỏ hàng của bạn
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="bg-surface p-4 rounded-xl shadow-card flex items-center gap-4 transition-all hover:shadow-hover">
                  <img src={item.image} alt={item.title} className="w-24 h-32 object-cover rounded-md" />
                  
                  <div className="flex-1">
                    <h3 className="font-heading text-lg">{item.title}</h3>
                    <p className="text-text-secondary text-sm mb-2 italic">Tác giả: {item.author}</p>
                    <p className="text-brand-primary font-bold">{item.price.toLocaleString('vi-VN')} đ</p>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center border border-border-default rounded-lg bg-background">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:text-accent-primary">
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <span className="px-4 font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:text-accent-primary">
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                    
                    <button onClick={() => removeItem(item.id)} className="text-text-muted hover:text-state-danger flex items-center gap-2 text-sm transition-colors">
                      <FontAwesomeIcon icon={faTrashCan} /> Xóa
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-surface rounded-2xl shadow-card">
                <p className="text-text-secondary mb-4 italic">Giỏ hàng đang trống rỗng như một cuốn sách chưa viết...</p>
                <Link to="/" className="text-brand-primary flex items-center gap-2 mx-auto justify-center hover:underline font-semibold">
                  <FontAwesomeIcon icon={faArrowLeft} /> Quay lại cửa hàng
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface p-6 rounded-2xl shadow-card sticky top-8 border border-border-light">
              <h2 className="font-heading text-2xl mb-6 text-brand-primary border-b border-border-light pb-2">Hóa đơn</h2>
              <div className="space-y-4 text-text-secondary">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="text-text-primary">{subtotal.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between border-b border-border-light pb-4">
                  <span>Phí vận chuyển</span>
                  <span className="text-text-primary">{shipping.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-text-primary pt-2">
                  <span>Tổng cộng</span>
                  <span className="text-accent-primary">{(subtotal + shipping).toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
              <button 
  onClick={() => navigate('/checkout')}
  className="w-full mt-8 bg-accent-primary hover:bg-accent-hover text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95"
>
  TIẾN HÀNH THANH TOÁN
</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;