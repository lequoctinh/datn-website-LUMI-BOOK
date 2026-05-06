import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faEdit, faEye, faEyeSlash, faTimes, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import bookService from '../../services/bookService';
import categoryService from '../../services/categoryService';
import authorService from '../../services/authorService';
import publisherService from '../../services/publisherService';

function BookManager() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        ten_sach: '', nha_cung_cap: '', nguoi_dich: '', nxb_id: '', nam_xuat_ban: '', ngon_ngu: 'Tiếng Việt',
        gia_ban: '', gia_giam: '0', so_luong_ton: '', so_trang: '', kich_thuoc: '', hinh_thuc: '',
        hinh_anh: null, album_anh: [], mo_ta: '', noi_dung: '', trang_thai: 'hien_thi', danh_muc_ids: [], tac_gia_ids: []
    });

    useEffect(() => {
        fetchBooks(pagination.page, search);
        fetchHelpers();
    }, [pagination.page]);

    const fetchHelpers = async () => {
        try {
            const [resCat, resAut, resPub] = await Promise.all([
                categoryService.getAll(), authorService.getAll(), publisherService.getAll()
            ]);
            if (resCat.success) setCategories(resCat.data);
            if (resAut.success) setAuthors(resAut.data);
            if (resPub.success) setPublishers(resPub.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchBooks = async (page, searchQuery) => {
        setLoading(true);
        try {
            const res = await bookService.getBooksAdmin(page, pagination.limit, searchQuery);
            if (res.success) {
                setBooks(res.data);
                setPagination(res.pagination);
            }
        } catch (error) {
            toast.error('Lỗi tải danh sách');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchBooks(1, search);
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'hien_thi' ? 'an' : 'hien_thi';
        try {
            const res = await bookService.toggleStatus(id, newStatus);
            if (res.success) {
                toast.success('Đã cập nhật trạng thái');
                setBooks(books.map(book => book.id === id ? { ...book, trang_thai: newStatus } : book));
            }
        } catch (error) {
            toast.error('Lỗi cập nhật');
        }
    };

    const openModal = async (book = null) => {
        if (book) {
            try {
                const res = await bookService.getBookById(book.id);
                if (res.success) {
                    const b = res.data;
                    let parsedAlbum = [];
                    try {
                        parsedAlbum = typeof b.album_anh === 'string' ? JSON.parse(b.album_anh) : (b.album_anh || []);
                    } catch (e) {
                        parsedAlbum = [];
                    }

                    setEditId(b.id);
                    setFormData({
                        ...b,
                        nxb_id: b.nxb_id || '',
                        album_anh: parsedAlbum,
                        danh_muc_ids: b.danh_muc?.map(i => i.id) || [],
                        tac_gia_ids: b.tac_gia?.map(i => i.id) || []
                    });
                }
            } catch (error) {
                toast.error("Lỗi lấy chi tiết");
            }
        } else {
            setEditId(null);
            setFormData({
                ten_sach: '', nha_cung_cap: '', nguoi_dich: '', nxb_id: '', nam_xuat_ban: '', ngon_ngu: 'Tiếng Việt',
                gia_ban: '', gia_giam: '0', so_luong_ton: '', so_trang: '', kich_thuoc: '', hinh_thuc: '',
                hinh_anh: null, album_anh: [], mo_ta: '', noi_dung: '', trang_thai: 'hien_thi', danh_muc_ids: [], tac_gia_ids: []
            });
        }
        setShowModal(true);
    };

    const handleCheckboxChange = (id, listName) => {
        const currentList = [...formData[listName]];
        const newList = currentList.includes(id) 
            ? currentList.filter(item => item !== id) 
            : [...currentList, id];
        setFormData({ ...formData, [listName]: newList });
    };

    const handleFileChange = (e, field) => {
        const files = Array.from(e.target.files);
        if (field === 'hinh_anh') {
            setFormData({ ...formData, hinh_anh: files[0] });
        } else {
            setFormData({ ...formData, album_anh: [...formData.album_anh, ...files] });
        }
    };

    const removeAlbumImage = (index) => {
        setFormData({
            ...formData,
            album_anh: formData.album_anh.filter((_, i) => i !== index)
        });
    };

    const formatPrice = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (!['hinh_anh', 'album_anh', 'danh_muc_ids', 'tac_gia_ids'].includes(key)) {
                    data.append(key, formData[key]);
                }
            });

            data.append('danh_muc_ids', JSON.stringify(formData.danh_muc_ids));
            data.append('tac_gia_ids', JSON.stringify(formData.tac_gia_ids));

            if (formData.hinh_anh instanceof File) {
                data.append('hinh_anh', formData.hinh_anh);
            }

            const existingAlbum = [];
            formData.album_anh.forEach((item) => {
                if (item instanceof File) {
                    data.append('album_anh', item);
                } else {
                    existingAlbum.push(item);
                }
            });
            data.append('existing_album', JSON.stringify(existingAlbum));

            const res = editId 
                ? await bookService.updateBook(editId, data) 
                : await bookService.createBook(data);

            if (res.success) {
                toast.success(editId ? 'Cập nhật thành công' : 'Đăng bán thành công');
                setShowModal(false);
                fetchBooks(pagination.page, search);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi thao tác');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Thư viện sách</h2>
                    <p className="text-gray-500 text-sm">Quản lý kho hàng và nội dung xuất bản</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="relative flex-1 md:w-72">
                        <input 
                            type="text" 
                            placeholder="Tìm mã hoặc tên sách..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                        />
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </form>
                    <button 
                        onClick={() => openModal()} 
                        className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-dark shadow-lg shadow-brand-primary/25 transition-all whitespace-nowrap"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Thêm sách
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-50/80 text-gray-600">
                            <th className="p-4 font-bold border-b border-gray-100">Sản phẩm</th>
                            <th className="p-4 font-bold border-b border-gray-100 text-right">Giá niêm yết</th>
                            <th className="p-4 font-bold border-b border-gray-100 text-right">Giá bán lẻ</th>
                            <th className="p-4 font-bold border-b border-gray-100 text-center">Tồn kho</th>
                            <th className="p-4 font-bold border-b border-gray-100">Thông tin xuất bản</th>
                            <th className="p-4 font-bold border-b border-gray-100 text-center">Trạng thái</th>
                            <th className="p-4 font-bold border-b border-gray-100 text-right sticky right-0 bg-gray-50">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-20 text-gray-400">Đang đồng bộ dữ liệu...</td></tr>
                        ) : books.map((book) => (
                            <tr key={book.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-4 w-72">
                                        <img 
                                            src={book.hinh_anh ? `http://localhost:5000/uploads/products/${book.hinh_anh}` : 'https://via.placeholder.com/150'} 
                                            className="w-12 h-16 object-cover rounded-lg shadow-sm border border-gray-100 bg-white" 
                                            alt={book.ten_sach} 
                                        />
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-gray-800 truncate mb-1">{book.ten_sach}</p>
                                            <p className="text-[10px] text-gray-400 font-mono">ID: #{book.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-right text-gray-400 line-through">
                                    {formatPrice(book.gia_ban)}đ
                                </td>
                                <td className="p-4 text-right font-black text-brand-primary text-base">
                                    {formatPrice(book.gia_giam > 0 ? book.gia_giam : book.gia_ban)}đ
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${book.so_luong_ton > 10 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {book.so_luong_ton}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="text-xs space-y-1">
                                        <p><span className="text-gray-400">NXB:</span> <span className="text-gray-600 font-medium">{book.ten_nha_xuat_ban}</span></p>
                                        <p><span className="text-gray-400">Năm:</span> <span className="text-gray-600 font-medium">{book.nam_xuat_ban}</span></p>
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <button 
                                        onClick={() => handleToggleStatus(book.id, book.trang_thai)} 
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${book.trang_thai === 'hien_thi' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        <FontAwesomeIcon icon={book.trang_thai === 'hien_thi' ? faEye : faEyeSlash} className="mr-1.5" />
                                        {book.trang_thai === 'hien_thi' ? 'Hiển thị' : 'Tạm ẩn'}
                                    </button>
                                </td>
                                <td className="p-4 text-right sticky right-0 bg-white group-hover:bg-gray-50/50">
                                    <button 
                                        onClick={() => openModal(book)} 
                                        className="text-white bg-brand-primary hover:bg-brand-dark w-9 h-9 rounded-xl shadow-md transition-all active:scale-95"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-1.5">
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setPagination({ ...pagination, page: i + 1 })} 
                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${pagination.page === i + 1 ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' : 'bg-white border border-gray-100 text-gray-400 hover:border-brand-primary hover:text-brand-primary'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                            <div>
                                <h3 className="text-xl font-black text-gray-800 uppercase italic leading-none">{editId ? 'Cập nhật bản ghi' : 'Tạo ấn phẩm mới'}</h3>
                                <p className="text-xs text-gray-400 mt-1">Vui lòng điền đầy đủ các thông tin có dấu (*)</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center">
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                            <form id="bookForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="space-y-6">
                                    <h4 className="font-black text-xs uppercase tracking-widest text-brand-primary border-l-4 border-brand-primary pl-3">Thông tin chính</h4>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Tên sách thương mại *</label>
                                            <input type="text" required value={formData.ten_sach} onChange={e => setFormData({...formData, ten_sach: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-brand-primary focus:bg-white transition-all" placeholder="Ví dụ: Đắc Nhân Tâm" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Giá niêm yết *</label>
                                                <input type="number" required value={formData.gia_ban} onChange={e => setFormData({...formData, gia_ban: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none" placeholder="0" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Giá khuyến mãi</label>
                                                <input type="number" value={formData.gia_giam} onChange={e => setFormData({...formData, gia_giam: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none" placeholder="0" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">TỒN KHO *</label>
                                                <input type="number" required value={formData.so_luong_ton} onChange={e => setFormData({...formData, so_luong_ton: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Số trang</label>
                                                <input type="number" value={formData.so_trang} onChange={e => setFormData({...formData, so_trang: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Ảnh đại diện (Thumbnail)</label>
                                            <div className="flex items-center gap-4">
                                                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl py-4 hover:bg-gray-50 cursor-pointer transition-all">
                                                    <span className="text-xs text-gray-500 font-bold">Chọn ảnh</span>
                                                    <input type="file" hidden accept="image/*" onChange={e => handleFileChange(e, 'hinh_anh')} />
                                                </label>
                                                {(formData.hinh_anh) && (
                                                    <div className="relative">
                                                        <img 
                                                            src={formData.hinh_anh instanceof File ? URL.createObjectURL(formData.hinh_anh) : `http://localhost:5000/uploads/products/${formData.hinh_anh}`} 
                                                            className="w-20 h-24 object-cover rounded-xl border-2 border-brand-primary/20" 
                                                            alt="Preview" 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Album ảnh chi tiết</label>
                                            <input type="file" multiple hidden id="album-input" accept="image/*" onChange={e => handleFileChange(e, 'album_anh')} />
                                            <label htmlFor="album-input" className="w-full py-2 border-2 border-dotted border-gray-200 rounded-xl text-center text-xs font-bold text-gray-400 block hover:border-brand-primary hover:text-brand-primary cursor-pointer transition-all">
                                                + Thêm ảnh vào Album
                                            </label>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {formData.album_anh.map((file, index) => (
                                                    <div key={index} className="relative group w-14 h-14">
                                                        <img 
                                                            src={file instanceof File ? URL.createObjectURL(file) : `http://localhost:5000/uploads/products/${file}`} 
                                                            className="w-full h-full object-cover rounded-lg border border-gray-100" 
                                                        />
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeAlbumImage(index)}
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                        >✕</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="font-black text-xs uppercase tracking-widest text-brand-primary border-l-4 border-brand-primary pl-3">Thông số kỹ thuật</h4>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Nhà cung cấp / Đối tác</label>
                                            <input type="text" value={formData.nha_cung_cap} onChange={e => setFormData({...formData, nha_cung_cap: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Người dịch</label>
                                                <input type="text" value={formData.nguoi_dich} onChange={e => setFormData({...formData, nguoi_dich: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Năm xuất bản</label>
                                                <input type="number" value={formData.nam_xuat_ban} onChange={e => setFormData({...formData, nam_xuat_ban: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Ngôn ngữ</label>
                                                <input type="text" value={formData.ngon_ngu} onChange={e => setFormData({...formData, ngon_ngu: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Hình thức bìa</label>
                                                <input type="text" value={formData.hinh_thuc} onChange={e => setFormData({...formData, hinh_thuc: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none" placeholder="Bìa mềm" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Kích thước vật lý</label>
                                            <input type="text" value={formData.kich_thuoc} onChange={e => setFormData({...formData, kich_thuoc: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none" placeholder="13 x 20.5 cm" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Mô tả ngắn gọn</label>
                                            <textarea rows="4" value={formData.mo_ta} onChange={e => setFormData({...formData, mo_ta: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none resize-none focus:bg-white transition-all"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="font-black text-xs uppercase tracking-widest text-brand-primary border-l-4 border-brand-primary pl-3">Phân loại & Nội dung</h4>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Nhà xuất bản *</label>
                                            <select value={formData.nxb_id} onChange={e => setFormData({...formData, nxb_id: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none">
                                                <option value="">-- Chọn đơn vị NXB --</option>
                                                {publishers.map(p => <option key={p.id} value={p.id}>{p.ten_nha_xuat_ban}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Danh mục thể loại</label>
                                            <div className="grid grid-cols-2 gap-2 p-4 border border-gray-100 bg-gray-50 rounded-2xl max-h-40 overflow-y-auto custom-scrollbar">
                                                {categories.map(c => (
                                                    <label key={c.id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${formData.danh_muc_ids.includes(c.id) ? 'bg-brand-primary/10 text-brand-primary' : 'hover:bg-white text-gray-500'}`}>
                                                        <input type="checkbox" className="hidden" checked={formData.danh_muc_ids.includes(c.id)} onChange={() => handleCheckboxChange(c.id, 'danh_muc_ids')} />
                                                        <span className="text-[11px] font-bold uppercase">{c.ten_danh_muc}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Tác giả biên soạn</label>
                                            <div className="grid grid-cols-2 gap-2 p-4 border border-gray-100 bg-gray-50 rounded-2xl max-h-40 overflow-y-auto custom-scrollbar">
                                                {authors.map(a => (
                                                    <label key={a.id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${formData.tac_gia_ids.includes(a.id) ? 'bg-brand-primary/10 text-brand-primary' : 'hover:bg-white text-gray-500'}`}>
                                                        <input type="checkbox" className="hidden" checked={formData.tac_gia_ids.includes(a.id)} onChange={() => handleCheckboxChange(a.id, 'tac_gia_ids')} />
                                                        <span className="text-[11px] font-bold uppercase">{a.ten_tac_gia}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Nội dung chi tiết sản phẩm</label>
                                            <textarea rows="6" value={formData.noi_dung} onChange={e => setFormData({...formData, noi_dung: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none resize-none focus:bg-white transition-all"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-white">
                            <button onClick={() => setShowModal(false)} className="px-8 py-3 text-gray-400 font-bold hover:text-gray-600 transition-all">Đóng</button>
                            <button 
                                type="submit" 
                                form="bookForm" 
                                disabled={loading}
                                className="px-10 py-3 bg-brand-primary text-white font-black rounded-2xl shadow-xl shadow-brand-primary/30 uppercase tracking-tighter hover:bg-brand-dark transition-all disabled:opacity-50"
                            >
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                {editId ? 'Cập nhật ngay' : 'Niêm yết sách'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookManager;