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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const [errors, setErrors] = useState({});

const validateForm = () => {
  let newErrors = {};
  const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỳỵỷỹýÝ\s]+$/;
  if (!formData.ho_ten_nhan?.trim()) {
    newErrors.ho_ten_nhan = "Họ tên không được để trống";
  } else if (!nameRegex.test(formData.ho_ten_nhan)) {
    newErrors.ho_ten_nhan = "Họ tên chỉ được chứa chữ cái, không bao gồm số";
  }

  const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
  if (!formData.sdt_nhan?.trim()) {
    newErrors.sdt_nhan = "Số điện thoại không được để trống";
  } else if (!phoneRegex.test(formData.sdt_nhan)) {
    newErrors.sdt_nhan = "Số điện thoại phải đủ 10 số và đúng định dạng VN";
  }

  if (!formData.dia_chi_giao_hang?.trim()) {
    newErrors.dia_chi_giao_hang = "Địa chỉ nhận hàng không được để trống";
  } else if (formData.dia_chi_giao_hang.trim().length < 10) {
    newErrors.dia_chi_giao_hang = "Vui lòng nhập địa chỉ cụ thể (Số nhà, tên đường...)";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

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
  return (
    <div className="min-h-screen bg-[#FBFBFD] py-12 px-4 font-body">
      <div className="max-w-2xl mx-auto">
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
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${errors.ho_ten_nhan ? 'border-red-500 bg-red-50' : 'border-border-default bg-background/30 focus:bg-white'}`}
                    />
                  </div>
                  {errors.ho_ten_nhan && <p className="text-red-500 text-xs italic ml-1">{errors.ho_ten_nhan}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Số điện thoại</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50">
                      <FontAwesomeIcon icon={faPhoneAlt} />
                    </span>
                    <input 
                      type="text"
                      name="sdt_nhan"
                      value={formData.sdt_nhan}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${errors.sdt_nhan ? 'border-red-500 bg-red-50' : 'border-border-default bg-background/30 focus:bg-white'}`}
                    />
                  </div>
                  {errors.sdt_nhan && <p className="text-red-500 text-xs italic ml-1">{errors.sdt_nhan}</p>}
                </div>
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
                      rows="4"
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${errors.dia_chi_giao_hang ? 'border-red-500 bg-red-50' : 'border-border-default bg-background/30 focus:bg-white'}`}
                    ></textarea>
                  </div>
                  {errors.dia_chi_giao_hang && <p className="text-red-500 text-xs italic ml-1">{errors.dia_chi_giao_hang}</p>}
                </div>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-amber-700">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mt-1" />
                <p className="text-xs leading-relaxed font-medium">
                  Lưu ý: Bạn chỉ có thể sửa thông tin khi đơn hàng đang ở trạng thái <b>Chờ duyệt</b>. Khi đơn hàng đã chuyển sang giao, mọi thay đổi sẽ không được áp dụng.
                </p>
              </div>
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