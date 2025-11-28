import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMotorcycles, getReviews, createReview, deleteMotorcycle } from '../services/apiServices';
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaWhatsapp, FaShareAlt, FaCalendarAlt, FaTachometerAlt, FaCog, FaShieldAlt, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import ActionModal, { type ModalType } from '../components/ActionModal';

const DetailMotor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State Modal
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'success' as ModalType,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  const { data: motors } = useQuery({ queryKey: ['motorcycles'], queryFn: getMotorcycles });
  const { data: reviews } = useQuery({ queryKey: ['reviews'], queryFn: getReviews });
  const [reviewForm, setReviewForm] = useState({ reviewer_name: '', comment: '', rating: 5 });

  const motor = motors?.find(m => m.id === id);
  const motorReviews = reviews?.filter(r => String(r.motorcycle_id) === String(id));

  // --- MUTATION BELI ---
  const buyMutation = useMutation({
    mutationFn: (motorId: string) => deleteMotorcycle(motorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Pembelian Berhasil! 🎉',
        message: 'Selamat! Motor ini sekarang resmi milik Anda. Item telah dihapus dari listing marketplace.',
        onConfirm: () => navigate('/')
      });
    },
    onError: () => {
      setModal({ isOpen: true, type: 'error', title: 'Gagal Membeli', message: 'Terjadi kesalahan sistem saat memproses pembelian.', onConfirm: closeModal });
    }
  });

  // --- MUTATION REVIEW ---
  const reviewMutation = useMutation({
    mutationFn: (e: React.FormEvent) => {
      e.preventDefault();
      return createReview({ ...reviewForm, motorcycle_id: id || '' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setReviewForm({ reviewer_name: '', comment: '', rating: 5 });
      setModal({ isOpen: true, type: 'success', title: 'Ulasan Terkirim', message: 'Terima kasih telah membagikan pengalaman Anda!', onConfirm: closeModal });
    },
    onError: () => {
      setModal({ isOpen: true, type: 'error', title: 'Gagal', message: 'Gagal mengirim ulasan.', onConfirm: closeModal });
    }
  });

  const handleBuyClick = () => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Konfirmasi Pembelian',
      message: `Apakah Anda yakin ingin membeli ${motor?.model_name} seharga Rp ${Number(motor?.price).toLocaleString('id-ID')}?`,
      onConfirm: () => id && buyMutation.mutate(id)
    });
  };

  if (!motor) return <div className="h-screen flex items-center justify-center text-gray-500">Loading...</div>;

  return (
    <div className="bg-white min-h-screen pb-28 md:pb-16">
      {/* Component Modal Global */}
      <ActionModal 
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        isLoading={buyMutation.isPending || reviewMutation.isPending}
      />

      {/* Mobile Nav Overlay */}
      <div className="md:hidden fixed top-0 left-0 right-0 p-4 z-50 flex justify-between pointer-events-none">
        <Link to="/" className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-lg pointer-events-auto active:scale-90 transition">
          <FaArrowLeft />
        </Link>
        <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-lg pointer-events-auto active:scale-90 transition">
          <FaShareAlt />
        </button>
      </div>

      <div className="max-w-7xl mx-auto md:px-6 md:py-8">
        <div className="flex flex-col lg:flex-row lg:gap-12">
          
          {/* --- LEFT COLUMN: IMAGE --- */}
          <div className="lg:w-7/12">
            <div className="sticky top-24">
              <div className="relative w-full aspect-[4/3] lg:aspect-video bg-gray-100 lg:rounded-3xl overflow-hidden shadow-sm group">
                <img src={motor.logo_url} alt={motor.model_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition duration-500"></div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold shadow-sm">
                  Stok Tersedia
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: INFO --- */}
          <div className="lg:w-5/12 p-5 lg:p-0">
            <div className="flex flex-col h-full">
              
              <div className="mb-6 border-b border-gray-100 pb-6">
                <div className="flex items-center justify-between mb-2">
                   <span className="bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{motor.brands?.name}</span>
                   <span className="text-gray-400 text-xs">ID: {motor.id.slice(0,6)}</span>
                </div>
                <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-gray-900 mb-2 leading-tight">{motor.model_name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <FaMapMarkerAlt className="text-red-500" /> Jakarta Selatan • Diposting hari ini
                </div>
                
                <h2 className="text-4xl font-bold text-primary mb-6">Rp {Number(motor.price).toLocaleString('id-ID')}</h2>

                {/* --- TOMBOL BELI DESKTOP --- */}
                <div className="hidden lg:flex gap-3">
                  <button 
                    onClick={handleBuyClick}
                    className="flex-1 bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transform active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart /> Beli Sekarang
                  </button>
                  <button className="flex-1 border border-gray-200 hover:border-green-500 hover:text-green-600 text-gray-700 font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
                    <FaWhatsapp size={20}/> Chat Penjual
                  </button>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm"><FaCalendarAlt/></div>
                   <div><p className="text-xs text-gray-400">Tahun</p><p className="font-bold text-sm">2023</p></div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm"><FaTachometerAlt/></div>
                   <div><p className="text-xs text-gray-400">Kilometer</p><p className="font-bold text-sm">5.000</p></div>
                </div>
                <div className="col-span-2 bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm"><FaCog/></div>
                   <div><p className="text-xs text-gray-400">Mesin & Spesifikasi</p><p className="font-bold text-sm">{motor.specs}</p></div>
                </div>
              </div>

              {/* Seller Info */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl mb-8 hover:border-primary/30 transition bg-white shadow-sm">
                 <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl">🏍️</div>
                 <div className="flex-1">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">Garasi Motor ID <FaShieldAlt className="text-blue-500 text-xs"/></h3>
                    <p className="text-xs text-green-600 font-medium">● Online sekarang</p>
                 </div>
                 <button className="text-primary text-sm font-bold border border-primary px-4 py-2 rounded-full hover:bg-blue-50 transition">Lihat Profil</button>
              </div>

              {/* Reviews */}
              <div className="bg-white">
                <h3 className="font-heading font-bold text-xl mb-4">Ulasan Pembeli ({motorReviews?.length})</h3>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar mb-6">
                  {motorReviews?.length === 0 ? (
                    <p className="text-gray-400 text-sm italic">Belum ada ulasan.</p>
                  ) : motorReviews?.map((rev) => (
                    <div key={rev.id} className="bg-gray-50 p-4 rounded-xl border border-gray-50">
                       <div className="flex justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <FaUserCircle className="text-gray-300"/>
                            <span className="font-bold text-sm text-gray-900">{rev.reviewer_name}</span>
                          </div>
                          <div className="flex text-yellow-400 text-xs">
                            {[...Array(5)].map((_, i) => <FaStar key={i} className={i < rev.rating ? "" : "text-gray-300"} />)}
                          </div>
                       </div>
                       <p className="text-sm text-gray-600 pl-6">{rev.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Form Review */}
                <form onSubmit={reviewMutation.mutate} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-sm mb-3 text-gray-700">Tulis Ulasan</h4>
                  <div className="space-y-3">
                    <input className="w-full bg-white border-none rounded-lg text-sm px-4 py-3 focus:ring-2 focus:ring-primary/20" placeholder="Nama Anda" value={reviewForm.reviewer_name} onChange={e => setReviewForm({...reviewForm, reviewer_name: e.target.value})} required />
                    <textarea className="w-full bg-white border-none rounded-lg text-sm px-4 py-3 h-20 focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Tulis ulasan..." value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} required />
                    <div className="flex items-center justify-between">
                       <div className="flex gap-1">
                         {[1,2,3,4,5].map(s => (
                           <button key={s} type="button" onClick={() => setReviewForm({...reviewForm, rating: s})} className={`text-lg transition hover:scale-110 ${s <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}><FaStar/></button>
                         ))}
                       </div>
                       <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-black transition">Kirim</button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE STICKY ACTION BAR --- */}
      <div className="fixed bottom-[70px] md:bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 z-40 lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
         <div className="flex gap-3">
            <button 
              onClick={handleBuyClick}
              className="flex-1 bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition"
            >
              Beli Sekarang
            </button>
            <button className="flex-none w-14 bg-green-100 text-green-600 font-bold rounded-xl flex items-center justify-center">
               <FaWhatsapp size={24}/>
            </button>
         </div>
      </div>
    </div>
  );
};

export default DetailMotor;