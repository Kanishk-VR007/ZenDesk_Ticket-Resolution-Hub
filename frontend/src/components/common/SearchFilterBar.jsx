import React from 'react';

const SearchFilterBar = ({ searchTerm, onSearchChange, placeholder = "Search..." }) => {
    return (
        <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-cyan-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full p-2 pl-10 text-sm bg-[#0d1424] border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-500 rounded-lg shadow-sm focus:outline-none transition-all duration-300"
                placeholder={placeholder}
            />
        </div>
    );
};

export default SearchFilterBar;