import React from 'react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  itemPrice?: string;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, onClose, onConfirm, title, message, itemName, itemPrice, isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop dengan Blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 animate-fade-in border border-white/20">
        
        {/* Tombol Close Pojok */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100"
        >
          <FaTimes />
        </button>

        {/* Icon Header */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center text-3xl shadow-inner">
            <FaShoppingCart />
          </div>
        </div>

        {/* Konten Teks */}
        <div className="text-center space-y-2 mb-6">
          <h3 className="font-heading font-extrabold text-2xl text-gray-900">
            {title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed px-4">
            {message}
          </p>
        </div>

        {/* Detail Item Box (Opsional) */}
        {itemName && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 flex justify-between items-center">
            <span className="font-bold text-gray-800 text-sm">{itemName}</span>
            <span className="text-primary font-bold text-sm">{itemPrice}</span>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition active:scale-95"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-5 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Memproses...
              </>
            ) : (
              'Ya, Beli Sekarang'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;