import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaQuestionCircle, FaTrash } from 'react-icons/fa';

export type ModalType = 'success' | 'error' | 'confirm' | 'delete';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title: string;
  message: string;
  onConfirm?: () => void; // Hanya perlu untuk tipe confirm/delete
  confirmText?: string;
  isLoading?: boolean;
}

const ActionModal: React.FC<ActionModalProps> = ({ 
  isOpen, onClose, type, title, message, onConfirm, confirmText = "Ya, Lanjutkan", isLoading 
}) => {
  if (!isOpen) return null;

  // Konfigurasi tampilan berdasarkan Tipe Modal
  const config = {
    success: {
      icon: <FaCheckCircle className="text-4xl text-green-500" />,
      bgIcon: "bg-green-50",
      btnColor: "bg-green-600 hover:bg-green-700",
      showCancel: false
    },
    error: {
      icon: <FaExclamationCircle className="text-4xl text-red-500" />,
      bgIcon: "bg-red-50",
      btnColor: "bg-red-600 hover:bg-red-700",
      showCancel: false
    },
    confirm: {
      icon: <FaQuestionCircle className="text-4xl text-primary" />,
      bgIcon: "bg-blue-50",
      btnColor: "bg-primary hover:bg-blue-700",
      showCancel: true
    },
    delete: {
      icon: <FaTrash className="text-3xl text-red-500" />,
      bgIcon: "bg-red-50",
      btnColor: "bg-red-600 hover:bg-red-700",
      showCancel: true
    }
  };

  const currentConfig = config[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={type === 'success' || type === 'error' ? onClose : undefined}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 animate-fade-in border border-white/10 text-center">
        
        {/* Icon Header */}
        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-5 ${currentConfig.bgIcon} shadow-inner`}>
          {currentConfig.icon}
        </div>

        {/* Content */}
        <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 px-2">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {currentConfig.showCancel && (
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition active:scale-95"
            >
              Batal
            </button>
          )}
          
          <button 
            onClick={type === 'success' || type === 'error' ? onClose : onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 ${currentConfig.btnColor}`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Proses...
              </>
            ) : (
              type === 'success' || type === 'error' ? 'Tutup' : confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;