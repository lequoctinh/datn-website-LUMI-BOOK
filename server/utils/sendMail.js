const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, 
        }
    });

    const verificationLink = `http://localhost:5173/verify-email?token=${token}`;

    const mailOptions = {
        from: '"Lumi Book Support" <no-reply@lumibook.com>',
        to: email,
        subject: 'Xác thực tài khoản LUMI BOOK',
        html: `
            <h3>Chào mừng bạn đến với Lumi Book!</h3>
            <p>Vui lòng click vào link dưới đây để kích hoạt tài khoản của bạn:</p>
            <a href="${verificationLink}" style="padding: 10px 20px; background-color: #8B5E3C; color: white; text-decoration: none; border-radius: 5px;">Xác thực ngay</a>
            <p>Link này sẽ hết hạn sau 24 giờ.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;