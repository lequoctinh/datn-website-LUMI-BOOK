import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faEdit, faEye, faEyeSlash, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import bookService from '../../services/bookService';
import categoryService from '../../services/categoryService';
import authorService from '../../services/authorService';
import publisherService from '../../services/publisherService';

const BookManager = () => {
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
        hinh_anh: '', album_anh: [], mo_ta: '', noi_dung: '', trang_thai: 'hien_thi', danh_muc_ids: [], tac_gia_ids: []
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
        } catch (error) {}
    };

    const fetchBooks = async (page, searchQuery) => {
        setLoading(true);
        try {
            const res = await bookService.getBooksAdmin(page, pagination.limit, searchQuery);
            if (res.success) { setBooks(res.data); setPagination(res.pagination); }
        } catch (error) { toast.error('Lỗi tải danh sách'); } finally { setLoading(false); }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination({ ...pagination, page: 1 });
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
        } catch (error) { toast.error('Lỗi cập nhật'); }
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
                    } catch (e) {}

                    setEditId(b.id);
                    setFormData({
                        ...b, 
                        nxb_id: b.nxb_id || '',
                        album_anh: parsedAlbum,
                        danh_muc_ids: b.danh_muc.map(i => i.id),
                        tac_gia_ids: b.tac_gia.map(i => i.id)
                    });
                }
            } catch (error) { toast.error("Lỗi lấy chi tiết"); }
        } else {
            setEditId(null);
            setFormData({
                ten_sach: '', nha_cung_cap: '', nguoi_dich: '', nxb_id: '', nam_xuat_ban: '', ngon_ngu: 'Tiếng Việt',
                gia_ban: '', gia_giam: '0', so_luong_ton: '', so_trang: '', kich_thuoc: '', hinh_thuc: '',
                hinh_anh: '', album_anh: [], mo_ta: '', noi_dung: '', trang_thai: 'hien_thi', danh_muc_ids: [], tac_gia_ids: []
            });
        }
        setShowModal(true);
    };

    const handleCheckboxChange = (e, listName) => {
        const value = parseInt(e.target.value);
        const currentList = [...formData[listName]];
        setFormData({ ...formData, [listName]: e.target.checked ? [...currentList, value] : currentList.filter(id => id !== value) });
    };

    const handleAddAlbumImage = () => {
        setFormData({ ...formData, album_anh: [...formData.album_anh, ''] });
    };

    const handleAlbumChange = (index, value) => {
        const newAlbum = [...formData.album_anh];
        newAlbum[index] = value;
        setFormData({ ...formData, album_anh: newAlbum });
    };

    const handleRemoveAlbumImage = (index) => {
        const newAlbum = formData.album_anh.filter((_, i) => i !== index);
        setFormData({ ...formData, album_anh: newAlbum });
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
            if (Array.isArray(formData.album_anh)) {
                formData.album_anh.forEach((file) => {
                    if (file instanceof File) {
                        data.append('album_anh', file);
                    }
                });
            }
            const res = editId 
                ? await bookService.updateBook(editId, data) 
                : await bookService.createBook(data);

            if (res.success) {
                toast.success('Thành công');
                setShowModal(false);
                fetchBooks(pagination.page, search);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi lưu dữ liệu');
        } finally {
            setLoading(false);
        }
    };
    const handleAlbumFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, album_anh: [...formData.album_anh, ...files] });
    };
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[calc(100vh-100px)]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-xl font-heading font-bold text-gray-800">Quản Lý Sách</h2>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="relative w-full md:w-64">
                        <input type="text" placeholder="Tìm tên sách..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-brand-primary" />
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </form>
                    <button onClick={() => openModal()} className="bg-brand-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-dark transition-colors whitespace-nowrap"><FontAwesomeIcon icon={faPlus} /> Thêm Mới</button>
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar pb-4">
                <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <th className="p-4 font-bold border-b border-gray-100">ID</th>
                            <th className="p-4 font-bold border-b border-gray-100">Sản phẩm</th>
                            <th className="p-4 font-bold border-b border-gray-100">Giá bán</th>
                            <th className="p-4 font-bold border-b border-gray-100">Tồn kho</th>
                            <th className="p-4 font-bold border-b border-gray-100">Nhà xuất bản</th>
                            <th className="p-4 font-bold border-b border-gray-100">Nhà cung cấp</th>
                            <th className="p-4 font-bold border-b border-gray-100">Người dịch</th>
                            <th className="p-4 font-bold border-b border-gray-100 text-center">Năm XB</th>
                            <th className="p-4 font-bold border-b border-gray-100 text-center">Ngôn ngữ</th>
                            <th className="p-4 font-bold border-b border-gray-100 text-center">Số trang</th>
                            <th className="p-4 font-bold border-b border-gray-100 text-center">Kích thước</th>
                            <th className="p-4 font-bold border-b border-gray-100 text-center">Hình thức</th>
                            <th className="p-4 font-bold border-b border-gray-100 text-center">Trạng thái</th>
                            <th className="p-4 font-bold border-b border-gray-100 text-right sticky right-0 bg-gray-50 shadow-[-5px_0_10px_rgba(0,0,0,0.02)]">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (<tr><td colSpan="14" className="text-center py-10">Đang tải...</td></tr>) : books.map((book) => (
                            <tr key={book.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                <td className="p-4 text-gray-500">#{book.id}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3 w-64">
                                        <img src={book.hinh_anh ? `http://localhost:5000/uploads/products/${book.hinh_anh}` : 'https://via.placeholder.com/150'} className="w-10 h-14 object-cover rounded shadow-sm border" alt={book.ten_sach} />
                                        <span className="font-bold text-gray-800 whitespace-normal line-clamp-2">{book.ten_sach}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-0.5">
                                        {book.gia_giam > 0 ? (
                                            <>
                                                <span className="font-bold text-red-600">{Number(book.gia_giam).toLocaleString()}đ</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-400 line-through">{Number(book.gia_ban).toLocaleString()}đ</span>
                                                    <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded font-bold">-{Math.round(((book.gia_ban - book.gia_giam) / book.gia_ban) * 100)}%</span>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="font-bold text-brand-primary">{Number(book.gia_ban).toLocaleString()}đ</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${book.so_luong_ton > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {book.so_luong_ton} cuốn
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">{book.ten_nha_xuat_ban || '-'}</td>
                                <td className="p-4 text-gray-600">{book.nha_cung_cap || '-'}</td>
                                <td className="p-4 text-gray-600">{book.nguoi_dich || '-'}</td>
                                <td className="p-4 text-center text-gray-600">{book.nam_xuat_ban || '-'}</td>
                                <td className="p-4 text-center text-gray-600">{book.ngon_ngu || '-'}</td>
                                <td className="p-4 text-center text-gray-600">{book.so_trang || '-'}</td>
                                <td className="p-4 text-center text-gray-600">{book.kich_thuoc || '-'}</td>
                                <td className="p-4 text-center text-gray-600">{book.hinh_thuc || '-'}</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleToggleStatus(book.id, book.trang_thai)} className={`px-3 py-1 rounded-full text-[11px] font-black uppercase transition-colors ${book.trang_thai === 'hien_thi' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                        <FontAwesomeIcon icon={book.trang_thai === 'hien_thi' ? faEye : faEyeSlash} className="mr-1" />
                                        {book.trang_thai === 'hien_thi' ? 'Hiển thị' : 'Đang ẩn'}
                                    </button>
                                </td>
                                <td className="p-4 text-right sticky right-0 bg-white shadow-[-5px_0_10px_rgba(0,0,0,0.02)] group-hover:bg-gray-50/50 transition-colors">
                                    <button onClick={() => openModal(book)} className="text-white bg-brand-primary hover:bg-brand-dark w-8 h-8 rounded-lg shadow-md transition-all">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <button key={i} onClick={() => setPagination({ ...pagination, page: i + 1 })} className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${pagination.page === i + 1 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-black text-gray-800 uppercase">{editId ? 'Chỉnh sửa sách' : 'Thêm sách mới'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><FontAwesomeIcon icon={faTimes} className="text-xl" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
                            <form id="bookForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <h4 className="font-bold border-b pb-1 text-brand-primary">Thông tin cơ bản</h4>
                                    <div><label className="text-xs font-bold uppercase text-gray-500">Tên sách *</label>
                                    <input type="text" required value={formData.ten_sach} onChange={e => setFormData({...formData, ten_sach: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none focus:border-brand-primary" /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs font-bold uppercase text-gray-500">Giá bán *</label>
                                        <input type="number" required value={formData.gia_ban} onChange={e => setFormData({...formData, gia_ban: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none" /></div>
                                        <div><label className="text-xs font-bold uppercase text-gray-500">Giá giảm</label>
                                        <input type="number" value={formData.gia_giam} onChange={e => setFormData({...formData, gia_giam: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs font-bold uppercase text-gray-500">Tồn kho *</label>
                                        <input type="number" required value={formData.so_luong_ton} onChange={e => setFormData({...formData, so_luong_ton: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none" /></div>
                                        <div><label className="text-xs font-bold uppercase text-gray-500">Số trang</label>
                                        <input type="number" value={formData.so_trang} onChange={e => setFormData({...formData, so_trang: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none" /></div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-500">Ảnh đại diện *</label>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={e => setFormData({...formData, hinh_anh: e.target.files[0]})} 
                                            className="w-full p-2 text-sm bg-gray-50 border rounded-xl outline-none" 
                                        />
                                        {formData.hinh_anh && (
                                            <img 
                                                src={formData.hinh_anh instanceof File ? URL.createObjectURL(formData.hinh_anh) : `http://localhost:5000/uploads/products/${formData.hinh_anh}`} 
                                                className="mt-2 w-20 h-28 object-cover rounded border" 
                                                alt="Preview" 
                                            />
                                        )}
                                    </div>
                                    
                                    <div>
                                        <div>
                                            <label className="text-xs font-bold uppercase text-gray-500">Album ảnh phụ</label>
                                            <input 
                                                type="file" 
                                                multiple 
                                                accept="image/*"
                                                onChange={handleAlbumFileChange}
                                                className="w-full p-2 text-sm bg-gray-50 border rounded-xl outline-none mb-2"
                                            />
                                            <div className="flex flex-wrap gap-2">
                                                {formData.album_anh.map((file, index) => (
                                                    <div key={index} className="relative group">
                                                        <img 
                                                            src={file instanceof File ? URL.createObjectURL(file) : `http://localhost:5000/uploads/products/${file}`} 
                                                            className="w-16 h-16 object-cover rounded border" 
                                                        />
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleRemoveAlbumImage(index)}
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px]"
                                                        >✕</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                                            {formData.album_anh.map((url, index) => (
                                                <div key={index} className="flex gap-2 items-center">
                                                    <img src={url || 'https://via.placeholder.com/40'} className="w-8 h-8 object-cover rounded border" alt="" />
                                                    <input type="text" value={url} onChange={(e) => handleAlbumChange(index, e.target.value)} className="flex-1 p-2 text-sm bg-gray-50 border rounded-xl outline-none" placeholder="Link ảnh..." />
                                                    <button type="button" onClick={() => handleRemoveAlbumImage(index)} className="text-red-500 hover:text-red-700 px-2"><FontAwesomeIcon icon={faTimes} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold border-b pb-1 text-brand-primary">Thông tin chi tiết</h4>
                                    <div><label className="text-xs font-bold uppercase text-gray-500">Nhà cung cấp</label>
                                    <input type="text" value={formData.nha_cung_cap} onChange={e => setFormData({...formData, nha_cung_cap: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none" /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs font-bold uppercase text-gray-500">Người dịch</label>
                                        <input type="text" value={formData.nguoi_dich} onChange={e => setFormData({...formData, nguoi_dich: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none" /></div>
                                        <div><label className="text-xs font-bold uppercase text-gray-500">Năm XB</label>
                                        <input type="number" value={formData.nam_xuat_ban} onChange={e => setFormData({...formData, nam_xuat_ban: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs font-bold uppercase text-gray-500">Ngôn ngữ</label>
                                        <input type="text" value={formData.ngon_ngu} onChange={e => setFormData({...formData, ngon_ngu: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none" /></div>
                                        <div><label className="text-xs font-bold uppercase text-gray-500">Hình thức</label>
                                        <input type="text" value={formData.hinh_thuc} onChange={e => setFormData({...formData, hinh_thuc: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none" placeholder="Bìa mềm" /></div>
                                    </div>
                                    <div><label className="text-xs font-bold uppercase text-gray-500">Kích thước</label>
                                    <input type="text" value={formData.kich_thuoc} onChange={e => setFormData({...formData, kich_thuoc: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none" placeholder="13 x 20 cm" /></div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold border-b pb-1 text-brand-primary">Phân loại & Nội dung</h4>
                                    <div><label className="text-xs font-bold uppercase text-gray-500">Nhà xuất bản</label>
                                    <select value={formData.nxb_id} onChange={e => setFormData({...formData, nxb_id: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none"><option value="">-- Chọn NXB --</option>{publishers.map(p => <option key={p.id} value={p.id}>{p.ten_nha_xuat_ban}</option>)}</select></div>
                                    <div><label className="text-xs font-bold uppercase text-gray-500">Danh mục</label>
                                    <div className="grid grid-cols-2 gap-1 max-h-24 overflow-y-auto p-2 border bg-gray-50 rounded-xl">{categories.map(c => (<label key={c.id} className="flex items-center gap-2 text-xs"><input type="checkbox" value={c.id} checked={formData.danh_muc_ids.includes(c.id)} onChange={e => handleCheckboxChange(e, 'danh_muc_ids')} />{c.ten_danh_muc}</label>))}</div></div>
                                    <div><label className="text-xs font-bold uppercase text-gray-500">Tác giả</label>
                                    <div className="grid grid-cols-2 gap-1 max-h-24 overflow-y-auto p-2 border bg-gray-50 rounded-xl">{authors.map(a => (<label key={a.id} className="flex items-center gap-2 text-xs"><input type="checkbox" value={a.id} checked={formData.tac_gia_ids.includes(a.id)} onChange={e => handleCheckboxChange(e, 'tac_gia_ids')} />{a.ten_tac_gia}</label>))}</div></div>
                                    <div><label className="text-xs font-bold uppercase text-gray-500">Mô tả ngắn</label>
                                    <textarea rows="3" value={formData.mo_ta} onChange={e => setFormData({...formData, mo_ta: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none resize-none"></textarea></div>
                                    <div><label className="text-xs font-bold uppercase text-gray-500">Nội dung chi tiết</label>
                                    <textarea rows="5" value={formData.noi_dung} onChange={e => setFormData({...formData, noi_dung: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none resize-none"></textarea></div>
                                </div>
                            </form>
                        </div>
                        <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-200 rounded-xl transition-all">Hủy</button>
                            <button type="submit" form="bookForm" className="px-8 py-2 bg-brand-primary text-white font-black rounded-xl shadow-lg shadow-brand-primary/20 uppercase tracking-tighter hover:bg-brand-dark transition-all"><FontAwesomeIcon icon={faSave} /> {editId ? 'Lưu thay đổi' : 'Đăng bán sách'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookManager;