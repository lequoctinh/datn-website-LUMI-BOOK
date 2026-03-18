if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm trong giỏ'
            });
        }

        res.json({
            success: true,
            message: 'Cập nhật số lượng thành công'
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật giỏ hàng' });
    }
};



// ================= XÓA SẢN PHẨM =================
exports.removeCartItem = async (req, res) => {
    try {

        const cartId = req.params.id;
        const userId = req.user.id;

        const [result] = await pool.execute(
            'DELETE FROM gio_hang WHERE id = ? AND nguoi_dung_id = ?',
            [cartId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm trong giỏ'
            });
        }

        res.json({
            success: true,
            message: 'Đã xóa sản phẩm khỏi giỏ hàng'
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm' });
    }
};



// ================= XÓA TOÀN BỘ GIỎ HÀNG =================
exports.clearCart = async (req, res) => {
    try {

        const userId = req.user.id;

        await pool.execute(
            'DELETE FROM gio_hang WHERE nguoi_dung_id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Đã xóa toàn bộ giỏ hàng'
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng' });
    }
};