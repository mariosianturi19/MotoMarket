import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviews, deleteReview, getMotorcycles } from '../services/apiServices';
import ActionModal, { type ModalType } from '../components/ActionModal';
import { FaTrash, FaStar, FaQuoteLeft, FaMotorcycle } from 'react-icons/fa';

const Reviews = () => {
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useQuery({ queryKey: ['reviews'], queryFn: getReviews });
  const { data: motors } = useQuery({ queryKey: ['motorcycles'], queryFn: getMotorcycles });

  // State Modal
  const [modal, setModal] = useState({
    isOpen: false, type: 'success' as ModalType, title: '', message: '', onConfirm: () => {}
  });
  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  const handleDelete = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setModal({ isOpen: true, type: 'success', title: 'Terhapus', message: 'Ulasan berhasil dihapus.', onConfirm: closeModal });
    },
    onError: () => setModal({ isOpen: true, type: 'error', title: 'Gagal', message: 'Gagal menghapus ulasan.', onConfirm: closeModal })
  });

  const confirmDelete = (id: string) => {
    setModal({
      isOpen: true,
      type: 'delete',
      title: 'Hapus Ulasan?',
      message: 'Apakah Anda yakin ingin menghapus ulasan pembeli ini?',
      onConfirm: () => handleDelete.mutate(id)
    });
  };

  const getMotorName = (id: string) => {
    const m = motors?.find(motor => motor.id === id);
    return m ? m.model_name : 'Motor Terhapus/Tidak Dikenal';
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen pb-24">
      <ActionModal onClose={closeModal} {...modal} isLoading={handleDelete.isPending} />

      <div className="mb-12 text-center md:text-left">
        <h1 className="font-heading font-extrabold text-3xl text-textPrimary">Ulasan Pembeli</h1>
        <p className="text-textSecondary text-sm mt-2 max-w-2xl">
          Pantau ulasan yang masuk untuk menjaga kualitas komunitas dan kepercayaan pelanggan.
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-[2rem] animate-pulse"></div>)}</div>
      ) : reviews?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-border rounded-[2.5rem]">
           <div className="text-5xl text-gray-200 mb-4">💬</div>
           <p className="text-textSecondary font-medium">Belum ada ulasan yang masuk.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews?.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-[2rem] border border-border shadow-sm hover:shadow-card-hover transition duration-300 flex flex-col relative group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg bg-gradient-to-br ${['from-blue-400 to-blue-600', 'from-purple-400 to-purple-600', 'from-orange-400 to-orange-600'][review.reviewer_name.length % 3]}`}>
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-textPrimary text-base">{review.reviewer_name}</h3>
                    <div className="flex text-warning text-xs mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.rating ? "fill-current" : "text-gray-200"} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative mb-6 flex-1">
                <FaQuoteLeft className="absolute -top-2 -left-2 text-blue-50 text-4xl -z-10" />
                <p className="text-textSecondary text-sm leading-relaxed italic relative z-10">"{review.comment}"</p>
              </div>
              <div className="pt-5 border-t border-border flex items-center justify-between mt-auto">
                 <div className="flex items-center gap-2 text-xs text-textSecondary bg-background px-3 py-1.5 rounded-lg border border-border">
                    <FaMotorcycle className="text-accent" />
                    <span className="truncate max-w-[150px] font-medium">{getMotorName(review.motorcycle_id)}</span>
                 </div>
                 <button onClick={() => confirmDelete(review.id)} className="text-gray-300 hover:text-danger transition p-2 bg-transparent hover:bg-red-50 rounded-full" title="Hapus Ulasan"><FaTrash size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
