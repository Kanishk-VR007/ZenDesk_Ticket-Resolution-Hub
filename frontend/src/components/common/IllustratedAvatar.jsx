import React from 'react';

const IllustratedAvatar = ({ name, size = 'md' }) => {
    // Generate a consistent SVG avatar based on name string
    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < (str?.length || 0); i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    };

    const color1 = stringToColor(name || 'default');
    const color2 = stringToColor((name || 'default') + 'reverse');

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-24 h-24 text-2xl',
    };

    return (
        <div 
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-lg overflow-hidden shrink-0`}
            style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
            title={name}
        >
            {/* Simple abstract face using SVG */}
            <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-80" fill="currentColor">
                <circle cx="50" cy="35" r="20" />
                <path d="M 20 90 Q 50 50 80 90 Z" />
            </svg>
        </div>
    );
};

export default IllustratedAvatar;
