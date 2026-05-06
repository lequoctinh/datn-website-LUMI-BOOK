const nodemailer = require('nodemailer');
require('dotenv').config();

const sendCancelOrderEmail = async (userEmail, orderId, reason) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, 
        }
    });

    const mailOptions = {
            from: `"LUMI-BOOK Support" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Thông báo hủy đơn hàng #${orderId} - LUMI BOOK`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                    <h3 style="color: #d9534f;">Thông báo hủy đơn hàng!</h3>
                    <p>Chào bạn,</p>
                    <p>Chúng tôi rất tiếc phải thông báo rằng đơn hàng <b>#${orderId}</b> của bạn tại <strong>LUMI BOOK</strong> đã bị hủy.</p>
                    
                    <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <strong>Lý do từ cửa hàng:</strong> ${reason || "Không có lý do cụ thể"}
                    </div>

                    <p>Nếu bạn đã thanh toán trước đó, số tiền sẽ được hoàn trả trong vòng 3-5 ngày làm việc.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #888;">Đây là email tự động, vui lòng không trả lời trực tiếp.</p>
                </div>
            `
        };

        return transporter.sendMail(mailOptions);
};

module.exports = sendCancelOrderEmail;