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

      <div className="mb-8 text-center md:text-left">
        <h1 className="font-heading font-extrabold text-3xl text-gray-900">Ulasan Pembeli</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-2xl">
          Pantau ulasan yang masuk untuk menjaga kualitas komunitas.
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse"></div>)}</div>
      ) : reviews?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
           <div className="text-4xl text-gray-300 mb-4">💬</div>
           <p className="text-gray-500 font-medium">Belum ada ulasan yang masuk.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews?.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition duration-300 flex flex-col relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br ${['from-blue-400 to-blue-600', 'from-purple-400 to-purple-600', 'from-orange-400 to-orange-600'][review.reviewer_name.length % 3]}`}>
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{review.reviewer_name}</h3>
                    <div className="flex text-yellow-400 text-xs mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.rating ? "fill-current" : "text-gray-200"} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative mb-4 flex-1">
                <FaQuoteLeft className="absolute -top-1 -left-1 text-gray-100 text-2xl -z-10" />
                <p className="text-gray-600 text-sm leading-relaxed italic">"{review.comment}"</p>
              </div>
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                 <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                    <FaMotorcycle />
                    <span className="truncate max-w-[150px]">{getMotorName(review.motorcycle_id)}</span>
                 </div>
                 <button onClick={() => confirmDelete(review.id)} className="text-gray-300 hover:text-red-500 transition p-2" title="Hapus Ulasan"><FaTrash size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;