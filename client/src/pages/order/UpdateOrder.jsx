import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSave, faMapMarkedAlt, faUserEdit, faPhoneAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-toastify';

const UpdateOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    ho_ten_nhan: '',
    sdt_nhan: '',
    dia_chi_giao_hang: ''
  });

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await axiosClient.get(`/checkout/my-orders/${id}`);
        // Kiểm tra logic: Nếu không phải 'cho_duyet', chặn không cho sửa
        if (res.order.trang_thai !== 'cho_duyet') {
          toast.warning("Đơn hàng đã được xử lý, không thể chỉnh sửa!");
          navigate('/my-orders');
          return;
        }
        
        setFormData({
          ho_ten_nhan: res.order.ho_ten_nguoi_nhan,
          sdt_nhan: res.order.sdt_nguoi_nhan,
          dia_chi_giao_hang: res.order.dia_chi_giao_hang
        });
      } catch (err) {
        toast.error("Không thể lấy thông tin đơn hàng");
        navigate('/my-orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axiosClient.put(`/checkout/update-order/${id}`, formData);
      toast.success("Cập nhật thông tin giao hàng thành công!");
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi cập nhật");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  return (
    <div className="min-h-screen bg-[#FBFBFD] py-12 px-4 font-body">
      <div className="max-w-2xl mx-auto">
        {/* Nút quay lại */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors mb-6 group"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Quay lại đơn hàng</span>
        </button>

        <div className="bg-white rounded-[32px] shadow-card border border-border-light overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="mb-10">
              <h1 className="font-heading text-3xl text-text-primary mb-2">Chỉnh sửa thông tin</h1>
              <p className="text-text-secondary text-sm">Đơn hàng <span className="font-bold text-brand-primary">#LUMI-{id}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Họ tên */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Họ tên người nhận</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50">
                    <FontAwesomeIcon icon={faUserEdit} />
                  </span>
                  <input 
                    type="text"
                    name="ho_ten_nhan"
                    value={formData.ho_ten_nhan}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border-default focus:border-brand-primary outline-none transition-all bg-background/30 focus:bg-white"
                  />
                </div>
              </div>
              {/* Số điện thoại */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Số điện thoại</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50">
                    <FontAwesomeIcon icon={faPhoneAlt} />
                  </span>
                  <input 
                    type="tel"
                    name="sdt_nhan"
                    value={formData.sdt_nhan}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border-default focus:border-brand-primary outline-none transition-all bg-background/30 focus:bg-white"
                  />
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Địa chỉ giao hàng</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-text-secondary/50">
                    <FontAwesomeIcon icon={faMapMarkedAlt} />
                  </span>
                  <textarea 
                    name="dia_chi_giao_hang"
                    value={formData.dia_chi_giao_hang}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border-default focus:border-brand-primary outline-none transition-all bg-background/30 focus:bg-white"
                  ></textarea>
                </div>
              </div>

              {/* Warning box */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-amber-700">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mt-1" />
                <p className="text-xs leading-relaxed font-medium">
                  Lưu ý: Bạn chỉ có thể sửa thông tin khi đơn hàng đang ở trạng thái <b>Chờ duyệt</b>. Khi đơn hàng đã chuyển sang giao, mọi thay đổi sẽ không được áp dụng.
                </p>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={updating}
                className="w-full bg-text-primary hover:bg-black text-white font-bold py-5 rounded-2xl transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 disabled:bg-gray-400"
              >
                <FontAwesomeIcon icon={updating ? faSave : faSave} className={updating ? 'animate-pulse' : ''} />
                {updating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;