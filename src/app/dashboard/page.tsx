import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getData, addMovie, editMovie, deleteMovie } from '@/store/feature/movie';
import type { Movie } from '@/store/feature/movie';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Plus, Edit2, Trash2, X, Save, Star, Eye, ImageOff, AlertCircle, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import withAdmin from '@/hoc/withAdmin';

const DashboardComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { movies, loading } = useAppSelector((state) => state.movies);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchYear, setSearchYear] = useState<string>('All');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imgPreviewError, setImgPreviewError] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  const [formData, setFormData] = useState<Partial<Movie>>({
    title: '',
    image: '',
    rating: 0,
    year: new Date().getFullYear(),
    category: 'Action',
    description: '',
    trailerId: '',
    isNewEpisode: false
  });

  useEffect(() => {
    dispatch(getData());
  }, [dispatch]);

  const handleOpenModal = (movie?: Movie) => {
    if (movie) {
      setEditingId(movie.id);
      setFormData(movie);
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        image: '',
        rating: 0,
        year: new Date().getFullYear(),
        category: 'Action',
        description: '',
        trailerId: '',
        isNewEpisode: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(editMovie(editingId, formData));
        toast.success('Berhasil memperbarui konten!');
      } else {
        await dispatch(addMovie(formData));
        toast.success('Berhasil menambahkan konten baru!');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Gagal menyimpan data.');
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!id) {
        toast.error('ID tidak valid.');
        return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
      try {
        await dispatch(deleteMovie(id));
        toast.success('Konten berhasil dihapus!');
      } catch (err) {
        console.error("Delete handler error:", err);
        toast.error('Gagal menghapus konten.');
      }
    }
  };

  const uniqueYears = Array.from(new Set(movies.map((m: Movie) => m.year))).sort((a, b) => b - a);

  const filteredMovies = movies.filter((movie: Movie) => {
    const matchText = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      movie.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchYear = searchYear === 'All' || String(movie.year) === searchYear;
    return matchText && matchYear;
  });


  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const currentMovies = filteredMovies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Generate blank dummy items to fill the remaining rows so height stays identical flawlessly
  const emptySlots = itemsPerPage - currentMovies.length;
  const dummyArray = Array.from({ length: emptySlots > 0 ? emptySlots : 0 });

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <span className="text-[10px] font-semibold tracking-widest text-gray-400">Admin Control Panel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-gray-500 leading-[1.1]">
              Manage Collections
            </h2>
            <p className="text-gray-400 text-xs md:text-sm max-w-xl leading-relaxed">
              Pusat kendali katalog film, serial, dan anime untuk pantau dan perbarui konten Chill secara real-time.
            </p>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Integrated Search Bar */}
            <div className="relative group flex items-center bg-white/[0.03] border border-white/10 rounded-full focus-within:ring-2 focus-within:ring-white/20 focus-within:bg-white/[0.05] transition-all w-full sm:w-[380px]">
              
              {/* Search Icon */}
              <div className="pl-4 pr-2">
                <Search className="text-gray-500 group-focus-within:text-purple-500 transition-colors pointer-events-none" size={16} />
              </div>

              {/* Text Input */}
              <input
                type="text"
                placeholder="Cari judul atau kategori..."
                className="bg-transparent py-2 md:py-2.5 w-full focus:outline-none text-xs md:text-sm placeholder:text-gray-600 border-none outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />

              {/* Separator Divider */}
              <div className="w-px h-5 bg-white/10 mx-2"></div>

              {/* Custom Year Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="bg-transparent py-2 md:py-2.5 px-4 focus:outline-none text-xs md:text-sm text-gray-400 hover:text-white cursor-pointer border-none outline-none flex items-center justify-center gap-2 min-w-[96px] select-none"
                >
                  <span className="font-medium">{searchYear === 'All' ? 'Tahun' : searchYear}</span>
                  <ChevronDown size={14} className="transition-transform duration-300" style={{ transform: isYearDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>

                <AnimatePresence>
                  {isYearDropdownOpen && (
                     <motion.div
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       className="absolute right-0 top-full mt-2 w-36 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] shadow-2xl py-2 z-50 overflow-hidden"
                     >
                        <div className="max-h-56 overflow-y-auto custom-scrollbar flex flex-col gap-1 px-1.5">
                          <button 
                            type="button"
                            onClick={() => { setSearchYear('All'); setCurrentPage(1); setIsYearDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${searchYear === 'All' ? 'text-white font-bold bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                          >
                            Semua Tahun
                          </button>
                          {uniqueYears.map(year => (
                            <button 
                              key={year}
                              type="button"
                              onClick={() => { setSearchYear(String(year)); setCurrentPage(1); setIsYearDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${searchYear === String(year) ? 'text-white font-bold bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                     </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <button
              onClick={() => handleOpenModal()}
              className="w-full sm:w-auto px-5 md:px-6 py-2 md:py-2.5 bg-white text-black/80 hover:bg-gray-200 rounded-full font-semibold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-white/5 text-xs md:text-sm cursor-pointer"
            >
              <Plus size={16} /> Tambah Baru
            </button>
          </div>
        </div>

        {/* Dynamic Wrapper */}
        <div className="flex flex-col">
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-10 py-6 text-xs font-semibold uppercase tracking-widest text-gray-500 w-16 text-center">#</th>
                  <th className="px-10 py-6 text-xs font-semibold uppercase tracking-widest text-gray-500">Katalog</th>
                  <th className="px-10 py-6 text-xs font-semibold uppercase tracking-widest text-gray-500 w-32 text-center">Genre</th>
                  <th className="px-10 py-6 text-xs font-semibold uppercase tracking-widest text-gray-500 w-28 text-center">Rating</th>
                  <th className="px-10 py-6 text-xs font-semibold uppercase tracking-widest text-gray-500 w-28 text-center">Tahun</th>
                  <th className="px-10 py-6 text-xs font-semibold uppercase tracking-widest text-gray-500 text-right w-40">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && movies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-10 py-56">
                      <div className="flex flex-col items-center gap-8">
                        <div className="relative w-16 h-16 border-2 border-white/5 rounded-full">
                          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-white/40 rounded-full animate-spin"></div>
                        </div>
                        <span className="text-gray-500 font-semibold uppercase tracking-[0.3em] text-[10px]">Sinkronisasi Database</span>
                      </div>
                    </td>
                  </tr>
                ) : currentMovies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-10 py-40 text-center text-gray-500 font-medium">
                      Database tidak memiliki data yang cocok dengan pencarian Anda.
                    </td>
                  </tr>
                ) : (
                  <>
                  {currentMovies.map((movie: Movie, index: number) => (
                    <tr key={movie.id} className="hover:bg-white/[0.03] transition-all group">
                      <td className="px-10 py-6 text-center text-xs font-black text-white/30">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                          <div 
                            onClick={() => setSelectedImage(movie.image)}
                            className="relative flex-shrink-0 group/img cursor-zoom-in"
                          >
                            <img src={movie.image || undefined} alt={movie.title} className="w-14 h-20 object-cover rounded-xl shadow-2xl border border-white/10 transition-transform group-hover/img:scale-105" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                               <Eye size={16} className="text-white" />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-base text-white/80 group-hover:text-white transition-colors line-clamp-1">{movie.title}</div>
                            <div className="flex items-center gap-2 mt-2">
                                {movie.isNewEpisode && (
                                    <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-[9px] font-semibold uppercase rounded-md tracking-wider border border-white/10">
                                      Baru
                                    </span>
                                )}
                                <span className="text-[10px] text-gray-500 font-medium">Updated 2m ago</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center justify-center">
                          <span className="inline-flex items-center justify-center px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 text-gray-400 leading-none">
                            {movie.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center justify-center gap-1.5 text-yellow-500 font-bold text-xs md:text-sm">
                          <Star size={14} fill="currentColor" strokeWidth={2} className="flex-shrink-0" /> {movie.rating}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center justify-center text-sm font-semibold text-gray-400">
                          {movie.year}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center justify-end gap-3 opacity-30 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => handleOpenModal(movie)} 
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(movie.id)} 
                            className="p-2 text-red-500/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Exact Structural Dummy Clones for mathematically perfect height locking */}
                  {dummyArray.map((_, i) => (
                    <tr key={`dummy-${i}`} className="opacity-0 pointer-events-none select-none" aria-hidden="true" tabIndex={-1}>
                      <td className="px-10 py-6 text-center text-xs font-black">0</td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-20 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-base leading-tight">Dummy</div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-medium">Updated</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className="px-4 py-1.5 text-[10px] font-black tracking-[0.2em]">GENRE</span>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm"><Star size={16} /> 0.0</div>
                      </td>
                      <td className="px-10 py-6 text-center text-sm font-semibold">2020</td>
                      <td className="px-10 py-6 text-right">
                        <div className="p-3 inline-block"><Edit2 size={20} /></div>
                      </td>
                    </tr>
                  ))}
                </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
          {loading && movies.length === 0 ? (
             <div className="col-span-full py-40 flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-4 border-t-purple-600 border-white/10 rounded-full animate-spin"></div>
             </div>
          ) : currentMovies.length === 0 ? (
            <div className="col-span-full py-40 text-center text-gray-500">Tidak ada data.</div>
          ) : (
            <>
            {currentMovies.map((movie: Movie) => (
              <div key={movie.id} className="bg-white/[0.03] p-8 rounded-[3rem] border border-white/5 space-y-8 hover:bg-white/[0.05] transition-all group">
                <div className="flex gap-8">
                  <div 
                    onClick={() => setSelectedImage(movie.image)}
                    className="relative flex-shrink-0 cursor-zoom-in"
                  >
                    <img src={movie.image || undefined} className="w-24 h-36 object-cover rounded-[1.5rem] shadow-2xl border border-white/10" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors rounded-[1.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Eye size={24} className="text-white" />
                    </div>
                    <div className="absolute -top-3 -left-3">
                         <span className="w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-[10px] font-black text-white/40 border border-white/10">
                            {movie.rating}
                         </span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <h3 className="font-semibold text-xl text-white/80 leading-tight group-hover:text-white transition-colors line-clamp-2">{movie.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                       <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[9px] font-semibold uppercase tracking-widest text-gray-400 border border-white/5">{movie.category}</span>
                       {movie.isNewEpisode && <span className="px-2.5 py-1 bg-white/10 text-gray-400 text-[9px] font-semibold uppercase rounded-lg border border-white/10">New</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 p-2 bg-white/[0.02] rounded-[2rem] border border-white/5">
                   <button onClick={() => handleOpenModal(movie)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-[1.5rem] flex items-center justify-center gap-2 font-semibold text-xs text-blue-400 transition-all active:scale-95 cursor-pointer"><Edit2 size={16}/> Edit</button>
                   <button onClick={() => handleDelete(movie.id)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-[1.5rem] flex items-center justify-center gap-2 font-semibold text-xs text-red-400 transition-all active:scale-95 cursor-pointer"><Trash2 size={16}/> Delete</button>
                </div>
              </div>
            ))}
            {/* Exact Structural Dummy Cards for perfectly locked mobile heights */}
            {dummyArray.map((_, i) => (
              <div key={`dummy-card-${i}`} className="opacity-0 pointer-events-none select-none bg-white/[0.03] p-8 rounded-[3rem] border border-white/5 space-y-8" aria-hidden="true" tabIndex={-1}>
                <div className="flex gap-8">
                  <div className="relative flex-shrink-0 w-24 h-36"></div>
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <h3 className="font-semibold text-xl leading-tight">Dummy</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                       <span className="px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest">Cat</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 p-2 bg-white/[0.02] rounded-[2rem] border border-white/5">
                   <div className="flex-1 py-4 flex items-center justify-center gap-2 font-semibold text-xs"><Edit2 size={16}/> Edit</div>
                   <div className="flex-1 py-4 flex items-center justify-center gap-2 font-semibold text-xs"><Trash2 size={16}/> Del</div>
                </div>
              </div>
            ))}
            </>
          )}
        </div>
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-12 mb-8">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-3 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-full border border-white/10 transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full flex items-center justify-center gap-2 font-semibold tabular-nums min-w-[88px] transition-all">
              <span className="text-white/80">{currentPage}</span>
              <span className="text-gray-500">/</span>
              <span className="text-gray-400">{totalPages}</span>
            </div>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-3 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-full border border-white/10 transition-all active:scale-90 cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()} // Guard against any parent click handlers
              className="bg-[#0f172a]/10 backdrop-blur-2xl w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-2xl relative z-10 overflow-hidden"
            >


              <div className="px-10 py-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold tracking-tight text-gray-500 text-left">{editingId ? 'Edit Content' : 'Add Content'}</h2>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 md:p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-white/40 hover:text-white transition-all active:scale-90 cursor-pointer shadow-none"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSave}>
                <div className="p-8 md:p-12 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar pr-4 md:pr-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-semibold text-gray-400/80 uppercase tracking-widest ml-1 mb-1">Nama Judul</label>
                      <input
                        type="text"
                        required
                        placeholder="Masukkan judul konten"
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-600 text-sm font-medium"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-semibold text-gray-400/80 uppercase tracking-widest ml-1 mb-1">Cover URL</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/90 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all placeholder:text-gray-600 text-sm"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3 relative">
                      <label className="block text-[10px] font-semibold text-gray-400/80 uppercase tracking-widest ml-1 mb-1">Kategori</label>
                      <div className="relative group">
                        <select
                          className="w-full h-[54px] px-5 appearance-none bg-white/5 border border-white/10 rounded-2xl text-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm font-semibold cursor-pointer"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="Action" className="bg-[#1e293b] text-white">Action</option>
                          <option value="Series" className="bg-[#1e293b] text-white">Series</option>
                          <option value="Anime" className="bg-[#1e293b] text-white">Anime</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-purple-500 transition-colors">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-semibold text-gray-400/80 uppercase tracking-widest ml-1 mb-1">Rating Bintang (0-5)</label>
                      <input
                        type="number"
                        step="0.1"
                        max="5"
                        min="0"
                        placeholder="Contoh: 4.8"
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-600 text-sm font-semibold"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-semibold text-gray-400/80 uppercase tracking-widest ml-1 mb-1">Tahun Rilis</label>
                      <input
                        type="number"
                        placeholder="Contoh: 2024"
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-600 text-sm"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-semibold text-gray-400/80 uppercase tracking-widest ml-1 mb-1">YouTube Video ID</label>
                      <input
                        type="text"
                        placeholder="Masukkan ID Video"
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-600 text-sm"
                        value={formData.trailerId}
                        onChange={(e) => setFormData({ ...formData, trailerId: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-semibold text-gray-400/80 uppercase tracking-widest ml-1 mb-1">IMDb Link</label>
                      <input
                        type="text"
                        placeholder="https://www.imdb.com/title/..."
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-600 text-sm"
                        value={formData.imdbLink || ''}
                        onChange={(e) => setFormData({ ...formData, imdbLink: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-semibold text-gray-400/80 uppercase tracking-widest ml-1 mb-1">Rotten Tomatoes Link</label>
                      <input
                        type="text"
                        placeholder="https://www.rottentomatoes.com/m/..."
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-600 text-sm"
                        value={formData.tomatoLink || ''}
                        onChange={(e) => setFormData({ ...formData, tomatoLink: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-[10px] font-semibold text-gray-400/80 uppercase tracking-widest ml-1 mb-1">Ringkasan Cerita</label>
                    <textarea
                      rows={4}
                      placeholder="Tuliskan deskripsi singkat..."
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-600 text-sm leading-relaxed resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-white/[0.02] rounded-[2rem] border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          id="isNew"
                          className="peer appearance-none w-6 h-6 sm:w-7 sm:h-7 bg-white/5 border border-white/10 rounded-full cursor-pointer checked:bg-white/20 checked:border-white/40 transition-all outline-none"
                          checked={formData.isNewEpisode}
                          onChange={(e) => setFormData({ ...formData, isNewEpisode: e.target.checked })}
                        />
                        <Check size={16} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <div>
                        <label htmlFor="isNew" className="text-sm font-semibold text-white/90 cursor-pointer block">Tandai sebagai Episode Baru</label>
                        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Akan muncul label khusus di katalog</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-white/5 flex flex-col sm:flex-row justify-end gap-4 bg-white/[0.01]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="order-2 sm:order-1 px-10 py-2 md:py-2.5 bg-white/10 backdrop-blur-2xl hover:bg-white/20 border border-white/10 rounded-full text-white/90 font-semibold transition-all active:scale-90 text-xs md:text-sm cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="order-1 sm:order-2 px-10 py-2 md:py-2.5 bg-white text-black font-semibold rounded-full transition active:scale-[0.98] text-xs md:text-sm shadow-xl shadow-white/5 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <Save size={16} /> {editingId ? 'Simpan Konten' : 'Tayangkan Konten'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 flex flex-col items-center"
            >
              <button 
                onClick={() => {
                  setSelectedImage(null);
                  setImgPreviewError(false);
                }}
                className="absolute -top-10 -right-2 md:-right-10 p-2 md:p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-90 shadow-2xl border border-white/10 z-20 cursor-pointer"
              >
                <X size={18} />
              </button>
              
              <div className="relative max-w-[90vw] max-h-[80vh] bg-white/5 rounded-[2.5rem] overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl">
                {!selectedImage ? (
                  <div className="w-[280px] md:w-[320px] aspect-[2/3] flex flex-col items-center justify-center gap-4 text-gray-500 bg-white/[0.02]">
                    <ImageOff size={48} strokeWidth={1.5} />
                    <span className="text-[10px] font-semibold uppercase tracking-widest opacity-50">No Image URL</span>
                  </div>
                ) : imgPreviewError ? (
                  <div className="w-[280px] md:w-[320px] aspect-[2/3] flex flex-col items-center justify-center gap-4 text-red-400/60 bg-red-500/[0.02]">
                    <AlertCircle size={48} strokeWidth={1.5} />
                    <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">Failed to Load</span>
                  </div>
                ) : (
                  <img 
                    src={selectedImage} 
                    className="max-w-full max-h-[80vh] w-auto h-auto object-contain" 
                    referrerPolicy="no-referrer"
                    onError={() => setImgPreviewError(true)}
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default withAdmin(DashboardComponent);
