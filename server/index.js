const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');
const path = require('path');

dotenv.config();
// Route imports
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authorRoutes = require('./routes/authorRoutes');
const cartRoutes = require('./routes/cartRoutes');
const publisherRoutes = require('./routes/publisherRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const adminRoutes = require('./routes/adminRoutes');
const voucherRoutes = require('./routes/voucherRoutes');
// Config
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/publishers', publisherRoutes);
app.use('/api/checkout',checkoutRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/vouchers', voucherRoutes);
// Root route
app.get('/', (req, res) => {
    res.send('API Lumi Book is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});