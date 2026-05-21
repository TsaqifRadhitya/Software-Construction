import React from 'react';
import { AlertTriangle, LogOut, Trash2 } from 'lucide-react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger' // 'danger' | 'warning' | 'logout'
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return (
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                        <Trash2 size={24} />
                    </div>
                );
            case 'warning':
                return (
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                        <AlertTriangle size={24} />
                    </div>
                );
            case 'logout':
                return (
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                        <LogOut size={24} />
                    </div>
                );
            default:
                return null;
        }
    };

    const getConfirmButtonClass = () => {
        switch (type) {
            case 'danger':
                return 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20';
            case 'warning':
                return 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20';
            case 'logout':
                return 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20';
            default:
                return 'bg-indigo-600 hover:bg-indigo-700 text-white';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                {getIcon()}
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">{message}</p>
                
                <div className="flex gap-3 w-full">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-medium text-sm"
                    >
                        {cancelText}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${getConfirmButtonClass()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
