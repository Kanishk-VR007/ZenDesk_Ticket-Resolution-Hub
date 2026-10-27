import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const DetailDrawer = ({ isOpen, onClose, title, children }) => {
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const drawerContent = (
        <div className="fixed inset-0 z-[9999] flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <aside 
                className="relative w-full max-w-[560px] bg-[#0b071b] shadow-2xl border-l border-purple-500/30 flex flex-col h-[100vh] overflow-hidden transform transition-transform"
                role="dialog"
                aria-modal="true"
            >
                {/* Header - Sticky */}
                <div className="flex items-center justify-between p-5 border-b border-purple-500/30 bg-[#1a0b2e] sticky top-0 z-10 shrink-0">
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                        {title || 'Ticket Details'}
                    </h2>
                    <button 
                        onClick={onClose}
                        aria-label="Close ticket details"
                        data-testid="ticket-detail-close"
                        className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-full transition-colors flex-shrink-0"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
                    {children}
                </div>
            </aside>
        </div>
    );

    return createPortal(drawerContent, document.body);
};

export default DetailDrawer;
