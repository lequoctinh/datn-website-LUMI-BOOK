import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-surface w-full max-w-[1000px] h-[650px] rounded-2xl shadow-2xl overflow-hidden flex relative flex-row-reverse">
                
                <Link to="/" className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-20 flex items-center gap-2 text-sm font-bold md:text-text-muted md:hover:text-brand-primary md:left-6 md:right-auto md:top-6">
                    Trang chủ <FontAwesomeIcon icon={faArrowRight} className="md:hidden" />
                </Link>

                <div className="hidden md:flex w-1/2 bg-brand-dark relative items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/1c/c4/58/1cc4586c5878bbcc13f5f65ba26dd2ba.jpg')] bg-cover bg-center opacity-50 mix-blend-overlay"></div>
                    <div className="relative z-10 text-center p-12 text-white">
                        <h2 className="font-heading text-4xl font-bold mb-4">GIA NHẬP LUMI</h2>
                        <p className="font-body text-white/90 leading-relaxed mb-8">
                            Tạo tài khoản ngay hôm nay để nhận ưu đãi thành viên, theo dõi đơn hàng và lưu giữ những cuốn sách yêu thích.
                        </p>
                        <div className="inline-block px-6 py-2 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-sm font-bold tracking-wide">
                            ✨ Voucher -20% cho thành viên mới
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white relative">
                    <div className="text-center mb-6">
                        <h3 className="font-heading text-3xl font-bold text-brand-primary mb-2">Đăng Ký</h3>
                        <p className="text-text-muted text-sm">Điền thông tin để tạo tài khoản mới</p>
                    </div>

                    <form className="space-y-4">
                        <div className="group relative">
                            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-text-muted group-focus-within:text-brand-primary transition-colors">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <input type="text" placeholder="Họ và tên" className="w-full py-3.5 pl-12 pr-4 bg-background/50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-primary/50 focus:shadow-md transition-all duration-300 font-body text-text-primary" />
                        </div>

                        <div className="group relative">
                            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-text-muted group-focus-within:text-brand-primary transition-colors">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </div>
                            <input type="email" placeholder="Địa chỉ Email" className="w-full py-3.5 pl-12 pr-4 bg-background/50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-primary/50 focus:shadow-md transition-all duration-300 font-body text-text-primary" />
                        </div>

                        <div className="group relative">
                            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-text-muted group-focus-within:text-brand-primary transition-colors">
                                <FontAwesomeIcon icon={faPhone} />
                            </div>
                            <input type="tel" placeholder="Số điện thoại" className="w-full py-3.5 pl-12 pr-4 bg-background/50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-primary/50 focus:shadow-md transition-all duration-300 font-body text-text-primary" />
                        </div>

                        <div className="group relative">
                            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-text-muted group-focus-within:text-brand-primary transition-colors">
                                <FontAwesomeIcon icon={faLock} />
                            </div>
                            <input type="password" placeholder="Mật khẩu" className="w-full py-3.5 pl-12 pr-4 bg-background/50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-primary/50 focus:shadow-md transition-all duration-300 font-body text-text-primary" />
                        </div>

                        <div className="group relative">
                            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-text-muted group-focus-within:text-brand-primary transition-colors">
                                <FontAwesomeIcon icon={faLock} />
                            </div>
                            <input type="password" placeholder="Nhập lại mật khẩu" className="w-full py-3.5 pl-12 pr-4 bg-background/50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-primary/50 focus:shadow-md transition-all duration-300 font-body text-text-primary" />
                        </div>

                        <div className="flex items-start gap-2 mt-2">
                            <input type="checkbox" className="mt-1 accent-brand-primary w-4 h-4 rounded border-gray-300" />
                            <span className="text-xs text-text-secondary leading-tight">
                                Tôi đồng ý với <a href="#" className="text-brand-primary font-bold hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-brand-primary font-bold hover:underline">Chính sách bảo mật</a> của Lumi Book.
                            </span>
                        </div>

                        <button className="w-full py-3.5 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/30 hover:bg-brand-dark hover:shadow-brand-primary/50 transition-all duration-300 transform active:scale-[0.98] mt-2">
                            ĐĂNG KÝ TÀI KHOẢN
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm font-medium text-text-secondary">
                        Đã có tài khoản? 
                        <Link to="/login" className="text-brand-primary font-bold ml-1 hover:underline decoration-2 underline-offset-4">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;