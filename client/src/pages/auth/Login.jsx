import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-surface w-full max-w-[1000px] h-[600px] rounded-2xl shadow-2xl overflow-hidden flex relative">
                
                <Link to="/" className="absolute top-6 left-6 text-text-muted hover:text-brand-primary transition-colors z-20 flex items-center gap-2 text-sm font-bold">
                    <FontAwesomeIcon icon={faArrowLeft} /> Trang chủ
                </Link>

                <div className="hidden md:flex w-1/2 bg-brand-primary relative items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/93/ee/39/93ee397185f4ba8932c373798b558cce.jpg')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                    <div className="relative z-10 text-center p-12 text-white">
                        <h2 className="font-heading text-4xl font-bold mb-4">LUMI BOOK</h2>
                        <p className="font-body text-white/90 leading-relaxed">
                            Chào mừng bạn trở lại. Hãy đăng nhập để tiếp tục hành trình khám phá tri thức vô tận.
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                    <div className="text-center mb-8">
                        <h3 className="font-heading text-3xl font-bold text-brand-primary mb-2">Đăng Nhập</h3>
                        <p className="text-text-muted text-sm">Nhập thông tin tài khoản của bạn</p>
                    </div>

                    <form className="space-y-5">
                        <div className="group">
                            <div className="relative">
                                <div className="absolute top-1/2 -translate-y-1/2 left-4 text-text-muted group-focus-within:text-brand-primary transition-colors">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <input 
                                    type="email" 
                                    placeholder="Địa chỉ Email" 
                                    className="w-full py-3.5 pl-12 pr-4 bg-background/50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-primary/50 focus:shadow-md transition-all duration-300 font-body text-text-primary placeholder:text-text-muted/70"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <div className="relative">
                                <div className="absolute top-1/2 -translate-y-1/2 left-4 text-text-muted group-focus-within:text-brand-primary transition-colors">
                                    <FontAwesomeIcon icon={faLock} />
                                </div>
                                <input 
                                    type="password" 
                                    placeholder="Mật khẩu" 
                                    className="w-full py-3.5 pl-12 pr-4 bg-background/50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-primary/50 focus:shadow-md transition-all duration-300 font-body text-text-primary placeholder:text-text-muted/70"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-brand-primary transition-colors">
                                <input type="checkbox" className="accent-brand-primary w-4 h-4 rounded border-gray-300" />
                                Ghi nhớ đăng nhập
                            </label>
                            <a href="#" className="hover:text-accent-primary transition-colors hover:underline">Quên mật khẩu?</a>
                        </div>

                        <button className="w-full py-3.5 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/30 hover:bg-brand-dark hover:shadow-brand-primary/50 transition-all duration-300 transform active:scale-[0.98]">
                            ĐĂNG NHẬP
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-text-muted font-bold tracking-wider">Hoặc tiếp tục với</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold text-text-secondary">
                            <FontAwesomeIcon icon={faGoogle} className="text-red-500 text-lg" /> Google
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm font-medium text-text-secondary">
                        Bạn chưa có tài khoản? 
                        <Link to="/register" className="text-brand-primary font-bold ml-1 hover:underline decoration-2 underline-offset-4">
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;