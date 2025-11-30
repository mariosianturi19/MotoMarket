import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMotorcycles, getReviews, createReview, deleteMotorcycle } from '../services/apiServices';
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaWhatsapp, FaCalendarAlt, FaTachometerAlt, FaCog, FaShieldAlt, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import ActionModal, { type ModalType } from '../components/ActionModal';
import ConfirmationModal from '../components/ConfirmationModal';

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

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  const { data: motors } = useQuery({ queryKey: ['motorcycles'], queryFn: getMotorcycles });
  const { data: reviews } = useQuery({ queryKey: ['reviews'], queryFn: getReviews });
  const [reviewForm, setReviewForm] = useState({ reviewer_name: '', comment: '', rating: 5 });

  const motor = motors?.find(m => m.id === id);
  const [lastKnownMotor, setLastKnownMotor] = useState<typeof motor | null>(null);

  React.useEffect(() => {
    if (motor) setLastKnownMotor(motor);
  }, [motor]);

  const displayMotor = motor || lastKnownMotor;
  const motorReviews = reviews?.filter(r => String(r.motorcycle_id) === String(id));

  // --- MUTATION BELI ---
  const buyMutation = useMutation({
    mutationFn: (motorId: string) => deleteMotorcycle(motorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
      setConfirmModalOpen(false);
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Pembelian Berhasil! 🎉',
        message: 'Selamat! Motor ini sekarang resmi milik Anda. Item telah dihapus dari listing marketplace.',
        onConfirm: () => navigate('/')
      });
    },
    onError: () => {
      setConfirmModalOpen(false);
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
    setConfirmModalOpen(true);
  };

  if (!displayMotor) return <div className="h-screen flex items-center justify-center text-textSecondary font-medium">Loading...</div>;

  return (
    <>
      <ActionModal 
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        isLoading={buyMutation.isPending || reviewMutation.isPending}
      />

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => id && buyMutation.mutate(id)}
        title="Konfirmasi Pembelian"
        message="Apakah Anda yakin ingin membeli motor ini? Pastikan saldo Anda mencukupi."
        itemName={displayMotor.model_name}
        itemPrice={`Rp ${Number(displayMotor.price).toLocaleString('id-ID')}`}
        isLoading={buyMutation.isPending}
      />

      <div className="bg-background min-h-screen pb-28 md:pb-16" data-aos="fade-in">
        {/* Mobile Nav Overlay */}
        <div className="md:hidden fixed top-0 left-0 right-0 p-4 z-50 flex justify-between pointer-events-none">
          <Link to="/" className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-textPrimary shadow-lg pointer-events-auto active:scale-90 transition">
            <FaArrowLeft />
          </Link>
        </div>

        <div className="max-w-7xl mx-auto md:px-6 md:py-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Column: Image */}
            <div className="bg-white md:rounded-[2.5rem] shadow-card overflow-hidden relative group h-[50vh] md:h-auto" data-aos="zoom-in">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>
              <img src={displayMotor.logo_url} alt={displayMotor.model_name} className="w-full h-full object-contain p-8 md:p-12 mix-blend-multiply group-hover:scale-105 transition duration-700" />
            </div>

            {/* Right Column: Info */}
            <div className="px-6 md:px-0" data-aos="fade-up" data-aos-delay="200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-50 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">{displayMotor.brands?.name}</span>
                  <div className="flex items-center gap-1 text-warning text-sm font-bold">
                    <FaStar /> 4.8
                  </div>
                </div>

                <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-textPrimary mb-2 leading-tight">{displayMotor.model_name}</h1>
                <div className="flex items-center gap-2 text-textSecondary text-sm mb-8">
                  <FaMapMarkerAlt className="text-danger" />
                  <span>Jakarta Selatan, Indonesia</span>
                </div>

                <div className="flex items-end gap-4 mb-8 pb-8 border-b border-border">
                  <div>
                    <p className="text-xs text-textSecondary font-bold uppercase tracking-wider mb-1">Harga Cash</p>
                    <h2 className="font-heading font-extrabold text-4xl text-primary">Rp {Number(displayMotor.price).toLocaleString('id-ID')}</h2>
                  </div>
                </div>              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-background p-4 rounded-2xl border border-border">
                  <FaCalendarAlt className="text-accent mb-2 text-xl" />
                  <p className="text-xs text-textSecondary">Tahun</p>
                  <p className="font-bold text-textPrimary">2023</p>
                </div>
                <div className="bg-background p-4 rounded-2xl border border-border">
                  <FaTachometerAlt className="text-accent mb-2 text-xl" />
                  <p className="text-xs text-textSecondary">Kilometer</p>
                  <p className="font-bold text-textPrimary">5.000 km</p>
                </div>
                <div className="bg-background p-4 rounded-2xl border border-border">
                  <FaCog className="text-accent mb-2 text-xl" />
                  <p className="text-xs text-textSecondary">Transmisi</p>
                  <p className="font-bold text-textPrimary">Otomatis</p>
                </div>
                <div className="bg-background p-4 rounded-2xl border border-border">
                  <FaShieldAlt className="text-accent mb-2 text-xl" />
                  <p className="text-xs text-textSecondary">Garansi</p>
                  <p className="font-bold text-textPrimary">Aktif</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-lg text-textPrimary mb-3">Deskripsi</h3>
                <p className="text-textSecondary leading-relaxed text-sm">
                  {displayMotor.specs}. Motor dalam kondisi sangat prima, servis rutin di bengkel resmi. 
                  Surat-surat lengkap (STNK, BPKB, Faktur). Pajak hidup panjang. 
                  Siap pakai untuk harian maupun touring.
                </p>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-blue-50 transition flex items-center justify-center gap-2">
                  <FaWhatsapp size={20} /> Chat Penjual
                </button>
                <button 
                  onClick={handleBuyClick}
                  className="flex-[2] py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-accent hover:shadow-accent/40 transition transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Beli Sekarang
                </button>
              </div>

            {/* Reviews Section */}
            <div className="mt-8 bg-white rounded-[2.5rem] p-8 shadow-card border border-border">
              <h3 className="font-heading font-bold text-xl text-textPrimary mb-6">Ulasan Pembeli ({motorReviews?.length || 0})</h3>
              
              {/* Form Review */}
              <form onSubmit={reviewMutation.mutate} className="mb-8 bg-background p-6 rounded-2xl border border-border">
                <h4 className="font-bold text-sm text-textPrimary mb-4">Tulis Ulasan Anda</h4>
                <div className="space-y-4">
                  <input 
                    placeholder="Nama Anda" 
                    value={reviewForm.reviewer_name}
                    onChange={e => setReviewForm({...reviewForm, reviewer_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none text-sm"
                    required
                  />
                  <textarea 
                    placeholder="Ceritakan pengalaman Anda..." 
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none text-sm min-h-[80px]"
                    required
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button type="button" key={star} onClick={() => setReviewForm({...reviewForm, rating: star})} className={`text-lg ${star <= reviewForm.rating ? 'text-warning' : 'text-gray-300'}`}>
                          <FaStar />
                        </button>
                      ))}
                    </div>
                    <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-accent transition">
                      Kirim
                    </button>
                  </div>
                </div>
              </form>

              <div className="space-y-6">
                {motorReviews?.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <FaUserCircle size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-textPrimary text-sm">{review.reviewer_name}</p>
                        <div className="flex text-warning text-xs">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? "fill-current" : "text-gray-200"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-textSecondary text-sm pl-14">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default DetailMotor;
