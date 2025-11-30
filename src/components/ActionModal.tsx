import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaQuestionCircle, FaTrash } from 'react-icons/fa';

export type ModalType = 'success' | 'error' | 'confirm' | 'delete';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  isLoading?: boolean;
}

const ActionModal: React.FC<ActionModalProps> = ({ 
  isOpen, onClose, type, title, message, onConfirm, confirmText = "Ya, Lanjutkan", isLoading 
}) => {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: <FaCheckCircle className="text-4xl text-success" />,
      bgIcon: "bg-green-50",
      btnColor: "bg-success hover:bg-green-600 shadow-success/30",
      showCancel: false
    },
    error: {
      icon: <FaExclamationCircle className="text-4xl text-danger" />,
      bgIcon: "bg-red-50",
      btnColor: "bg-danger hover:bg-red-600 shadow-danger/30",
      showCancel: false
    },
    confirm: {
      icon: <FaQuestionCircle className="text-4xl text-accent" />,
      bgIcon: "bg-blue-50",
      btnColor: "bg-accent hover:bg-blue-600 shadow-accent/30",
      showCancel: true
    },
    delete: {
      icon: <FaTrash className="text-3xl text-danger" />,
      bgIcon: "bg-red-50",
      btnColor: "bg-danger hover:bg-red-600 shadow-danger/30",
      showCancel: true
    }
  };

  const currentConfig = config[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={type === 'success' || type === 'error' ? onClose : undefined}
      ></div>

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 transform transition-all animate-scale-in border border-white/20">
        
        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${currentConfig.bgIcon} shadow-inner`}>
          {currentConfig.icon}
        </div>

        <h3 className="font-heading font-extrabold text-2xl text-textPrimary mb-3 text-center">
          {title}
        </h3>
        <p className="text-textSecondary text-sm leading-relaxed mb-8 text-center px-2">
          {message}
        </p>

        <div className="flex gap-3">
          {currentConfig.showCancel && (
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3.5 rounded-xl border border-border text-textSecondary font-bold text-sm hover:bg-background transition active:scale-95"
            >
              Batal
            </button>
          )}
          
          <button 
            onClick={type === 'success' || type === 'error' ? onClose : onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3.5 rounded-xl text-white font-bold text-sm shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 ${currentConfig.btnColor}`}
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
