import React from 'react';

const EmptyState = ({ message, actionText, onAction }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 border border-dashed rounded-lg">
            <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 font-medium mb-4">{message}</p>
            {actionText && onAction && (
                <button 
                    onClick={onAction}
                    className="px-4 py-2 text-sm font-semibold text-white transition bg-blue-600 rounded hover:bg-blue-700"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
};

export default EmptyState;