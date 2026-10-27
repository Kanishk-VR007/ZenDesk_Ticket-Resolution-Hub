import React from 'react';

const StatusBadge = ({ status }) => {
    let colors = 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    if (status === 'OPEN') colors = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (status === 'IN_PROGRESS') colors = 'bg-pink-500/20 text-pink-300 border-pink-500/30';
    if (status === 'RESOLVED') colors = 'bg-green-500/20 text-green-300 border-green-500/30';
    if (status === 'ESCALATED') colors = 'bg-red-500/20 text-red-300 border-red-500/30';
    if (status === 'CLOSED') colors = 'bg-slate-700/50 text-slate-400 border-slate-700/50';

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colors}`}>
            {status?.replace('_', ' ') || 'UNKNOWN'}
        </span>
    );
};

export default StatusBadge;
