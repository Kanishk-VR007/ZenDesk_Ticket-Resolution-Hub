import React from 'react';
import { createPortal } from 'react-dom';

const ActionConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor, processing }) => {
    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!processing ? onClose : undefined}></div>
            <div className="relative bg-[#0b071b] border border-purple-500/30 rounded-2xl shadow-2xl p-6 max-w-sm w-full transform transition-all">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-300 text-sm mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        disabled={processing}
                        className="px-4 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        disabled={processing}
                        className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg disabled:opacity-50 ${confirmColor}`}
                    >
                        {processing ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ActionConfirmationModal;
