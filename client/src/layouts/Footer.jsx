import React from "react";
import './css/Footer.css';

function Footer() {
    return (
        <footer className="lumi-footer-section">
            <div className="lumi-footer-bg-pattern"></div>
            
            <div className="lumi-footer-container">
                
                {/* --- PHẦN TRÊN: THƯƠNG HIỆU & NEWSLETTER --- */}
                <div className="lumi-footer-top">
                    <div className="lumi-footer-brand">
                        <a href="/" className="lumi-footer-logo">LUMI BOOK</a>
                        <p className="lumi-footer-desc">
                            Hành trình tri thức bắt đầu từ những trang sách. Chúng tôi cam kết mang đến những ấn phẩm tinh hoa, lan tỏa văn hóa đọc đến mọi miền tổ quốc.
                        </p>
                    </div>

                    <div className="lumi-newsletter-box">
                        <h3 className="lumi-newsletter-title">
                            <i className="fa-regular fa-envelope"></i> Đăng ký nhận tin
                        </h3>
                        <form className="lumi-newsletter-form">
                            <input 
                                type="email" 
                                placeholder="Nhập email của bạn..." 
                                className="lumi-input-email" 
                            />
                            <button type="button" className="lumi-btn-sub">
                                Theo dõi
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- PHẦN GIỮA: LIÊN KẾT --- */}
                <div className="lumi-footer-links-grid">
                    
                    {/* Cột 1: Về Chúng Tôi */}
                    <div>
                        <h4 className="lumi-col-title">Về Lumi Book</h4>
                        <ul className="lumi-link-list">
                            <li className="lumi-link-item">
                                <a href="/about" className="lumi-link"><i className="fa-solid fa-chevron-right"></i> Câu chuyện thương hiệu</a>
                            </li>
                            <li className="lumi-link-item">
                                <a href="/careers" className="lumi-link"><i className="fa-solid fa-chevron-right"></i> Tuyển dụng nhân tài</a>
                            </li>
                            <li className="lumi-link-item">
                                <a href="/blog" className="lumi-link"><i className="fa-solid fa-chevron-right"></i> Góc đọc sách</a>
                            </li>
                            <li className="lumi-link-item">
                                <a href="/contact" className="lumi-link"><i className="fa-solid fa-chevron-right"></i> Liên hệ hợp tác</a>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 2: Danh Mục Chính (Liên kết Header) */}
                    <div>
                        <h4 className="lumi-col-title">Khám Phá</h4>
                        <ul className="lumi-link-list">
                            <li className="lumi-link-item">
                                <a href="/category/sach-moi" className="lumi-link"><i className="fa-solid fa-chevron-right"></i> Sách Mới Phát Hành</a>
                            </li>
                            <li className="lumi-link-item">
                                <a href="/category/ban-chay" className="lumi-link"><i className="fa-solid fa-chevron-right"></i> Sách Bán Chạy Nhất</a>
                            </li>
                            <li className="lumi-link-item">
                                <a href="/category/van-hoc" className="lumi-link"><i className="fa-solid fa-chevron-right"></i> Văn Học Kinh Điển</a>
                            </li>
                            <li className="lumi-link-item">
                                <a href="/category/thieu-nhi" className="lumi-link"><i className="fa-solid fa-chevron-right"></i> Sách Thiếu Nhi</a>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ Trợ Khách Hàng */}
                    <div>
                        <h4 className="lumi-col-title">Hỗ Trợ</h4>
                        <ul className="lumi-link-list">
                            <li className="lumi-link-item">
                                <a href="/help/shipping" className="lumi-link"><i className="fa-solid fa-chevron-right"></i> Chính sách vận chuyển</a>
                            </li>
                            <li className="lumi-link-item">
                                <a href="/help/return" className="lumi-link"><i className="fa-solid fa-chevron-right"></i> Đổi trả & Hoàn tiền</a>
                            </li>
                            <li className="lumi-link-item">
                                <a href="/help/payment" className="lumi-link"><i className="fa-solid fa-chevron-right"></i> Phương thức thanh toán</a>
                            </li>
                            <li className="lumi-link-item">
                                <a href="/help/faq" className="lumi-link"><i className="fa-solid fa-chevron-right"></i> Câu hỏi thường gặp</a>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 4: Liên Hệ */}
                    <div>
                        <h4 className="lumi-col-title">Liên Hệ</h4>
                        <ul className="lumi-link-list lumi-contact-info">
                            <li>
                                <i className="fa-solid fa-location-dot"></i>
                                <span>FPT Polytechnic, Tòa nhà Innovation, TP. Hồ Chí Minh</span>
                            </li>
                            <li>
                                <i className="fa-solid fa-phone"></i>
                                <span>1900 6789 (8:00 - 21:00)</span>
                            </li>
                            <li>
                                <i className="fa-solid fa-envelope"></i>
                                <span>cskh@lumibook.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="lumi-footer-bottom">
                    <p>© 2026 LUMI BOOK. All rights reserved. Designed by Nhom 2.</p>
                    
                    <div className="lumi-socials">
                        <a href="#" className="lumi-social-link"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#" className="lumi-social-link"><i className="fa-brands fa-instagram"></i></a>
                        <a href="#" className="lumi-social-link"><i className="fa-brands fa-tiktok"></i></a>
                        <a href="#" className="lumi-social-link"><i className="fa-brands fa-youtube"></i></a>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;