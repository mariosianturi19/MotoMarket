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
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 transform transition-all animate-scale-in border border-white/20">
        
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-textSecondary hover:text-textPrimary transition p-2 rounded-full hover:bg-background"
        >
          <FaTimes />
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-50 text-accent rounded-full flex items-center justify-center text-3xl shadow-inner">
            <FaShoppingCart />
          </div>
        </div>

        <div className="text-center space-y-3 mb-8">
          <h3 className="font-heading font-extrabold text-2xl text-textPrimary">
            {title}
          </h3>
          <p className="text-textSecondary text-sm leading-relaxed px-4">
            {message}
          </p>
        </div>

        {itemName && (
          <div className="bg-background rounded-2xl p-5 mb-8 border border-border flex justify-between items-center shadow-inner">
            <span className="font-bold text-textPrimary text-sm">{itemName}</span>
            <span className="text-accent font-bold text-sm">{itemPrice}</span>
          </div>
        )}

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-5 py-3.5 rounded-xl border border-border text-textSecondary font-bold text-sm hover:bg-background transition active:scale-95"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-5 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-accent shadow-lg shadow-primary/30 transition transform active:scale-95 flex items-center justify-center gap-2"
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
